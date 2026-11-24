import crypto from 'crypto';
import User from '../models/User.js';
import OtpToken from '../models/OtpToken.js';
import { generateToken } from '../utils/generateToken.js';
import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOtpEmail
} from '../utils/sendEmail.js';
import {
  hashWithPepper,
  generateOtp,
  generateSecureToken
} from '../middleware/securityMiddleware.js';

// Helper: Dynamically determine user's frontend domain (preserves Vercel domain vs local dev)
export function getFrontendUrl(req) {
  const origin = req.headers['origin'];
  if (origin && typeof origin === 'string' && origin.startsWith('http')) {
    const clean = origin.replace(/\/+$/, '');
    if (!clean.includes('localhost')) {
      return clean;
    }
  }

  const referer = req.headers['referer'];
  if (referer && typeof referer === 'string' && referer.startsWith('http')) {
    try {
      const u = new URL(referer);
      if (!u.host.includes('localhost')) {
        return `${u.protocol}//${u.host}`;
      }
    } catch {}
  }

  if (process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('localhost')) {
    return process.env.CLIENT_URL.replace(/\/+$/, '');
  }

  if (origin && origin.includes('localhost')) {
    return origin.replace(/\/+$/, '');
  }

  return 'https://infinityhub-pro.vercel.app';
}

// ─────────────────────────────────────────────────────────────
// Step 1: Send Registration 6-Digit OTP & 1-Click Magic Link
// ─────────────────────────────────────────────────────────────
export const sendRegisterOtp = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      company_name,
      designation,
      primary_interest,
      company_size,
      city,
      honeypot
    } = req.body;

    // Anti-bot honeypot trap
    if (honeypot) {
      return res.status(200).json({
        success: true,
        message: 'Verification code sent to your corporate email address.'
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name, work email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if account already exists
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An enterprise account with this email address already exists. Please sign in.'
      });
    }

    // Enforce 60-second cooldown between requests
    const existingOtp = await OtpToken.findOne({ email: normalizedEmail, type: 'register' });
    if (existingOtp && existingOtp.lastSentAt) {
      const elapsedMs = Date.now() - new Date(existingOtp.lastSentAt).getTime();
      if (elapsedMs < 60000) {
        const remainingSec = Math.ceil((60000 - elapsedMs) / 1000);
        return res.status(429).json({
          success: false,
          error: `Please wait ${remainingSec} seconds before requesting another verification code.`
        });
      }
    }

    // Normalize company size
    let normalizedSize = 'Undisclosed';
    const rawSize = (company_size || '').toString().trim().toLowerCase();
    if (rawSize.includes('200+') || rawSize.includes('enterprise')) {
      normalizedSize = '200+';
    } else if (rawSize.includes('51') || rawSize.includes('200')) {
      normalizedSize = '51-200';
    } else if (rawSize.includes('11') || rawSize.includes('50')) {
      normalizedSize = '11-50';
    } else if (rawSize.includes('1') || rawSize.includes('10')) {
      normalizedSize = '1-10';
    } else if (['1-10', '11-50', '51-200', '200+'].includes(company_size)) {
      normalizedSize = company_size;
    }

    // Generate credentials & tokens
    const otp = generateOtp();
    const magicToken = generateSecureToken(32);
    const otpHash = hashWithPepper(otp);
    const magicTokenHash = hashWithPepper(magicToken);

    // Save temporary registration data to OtpToken
    await OtpToken.findOneAndUpdate(
      { email: normalizedEmail, type: 'register' },
      {
        email: normalizedEmail,
        otpHash,
        magicTokenHash,
        type: 'register',
        tempData: {
          name: name.trim(),
          password,
          phone: phone || '',
          company_name: company_name || '',
          designation: designation || 'IT Head / Sysadmin',
          primary_interest: ['rent', 'buy', 'both', 'buyback'].includes(primary_interest) ? primary_interest : 'both',
          company_size: normalizedSize,
          city: city || ''
        },
        attempts: 0,
        lastSentAt: new Date(),
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Build 1-Click Magic Link
    const frontendUrl = getFrontendUrl(req);
    const magicLink = `${frontendUrl}/verify-email?verify_email=${encodeURIComponent(normalizedEmail)}&verify_token=${magicToken}`;

    // Dispatch via Dual-Channel Engine (Brevo HTTPS first on cloud, SMTP on local)
    try {
      await sendOtpEmail(normalizedEmail, otp, 'register', magicLink, name.trim());
    } catch (mailErr) {
      console.error('[OTP Register Error] Mail dispatch failed:', mailErr.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please check your email or try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}. Valid for 10 minutes.`,
      email: normalizedEmail
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// Step 2: Verify Registration OTP & Complete Account Setup
// ─────────────────────────────────────────────────────────────
export const verifyRegisterOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Work email and 6-digit verification code are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = await OtpToken.findOne({ email: normalizedEmail, type: 'register' });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired or is invalid. Please request a new code.'
      });
    }

    // Check brute-force attempts
    if (record.attempts >= 5) {
      await OtpToken.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: 'Too many incorrect attempts. For security, this code has been invalidated. Please register again.'
      });
    }

    // Verify HMAC-SHA256 hash
    const inputHash = hashWithPepper(otp.toString().trim());
    if (inputHash !== record.otpHash) {
      record.attempts = (record.attempts || 0) + 1;
      await record.save();
      const remaining = 5 - record.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid verification code. ${remaining} attempt(s) remaining.`
      });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      await OtpToken.deleteOne({ _id: record._id });
      return res.status(400).json({
        success: false,
        message: 'This email is already registered and verified. Please sign in.'
      });
    }

    // Create verified User
    const user = await User.create({
      name: record.tempData?.name || 'Valued Client',
      email: normalizedEmail,
      password: record.tempData?.password,
      phone: record.tempData?.phone || '',
      company_name: record.tempData?.company_name || '',
      designation: record.tempData?.designation || 'Other / Professional',
      primary_interest: record.tempData?.primary_interest || 'both',
      company_size: record.tempData?.company_size || 'Undisclosed',
      city: record.tempData?.city || '',
      role: 'customer',
      email_verified: true,
      verification_token: null
    });

    // Clean up temporary OTP record
    await OtpToken.deleteOne({ _id: record._id });

    // Send Welcome Email asynchronously
    sendWelcomeEmail(user.email, user.name, getFrontendUrl(req))
      .catch((e) => console.warn('[Welcome Email Notice]', e.message));

    // Generate JWT Auth Token
    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Corporate account verified and activated successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company_name: user.company_name,
        designation: user.designation,
        primary_interest: user.primary_interest,
        company_size: user.company_size,
        city: user.city,
        role: user.role,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// Step 3: 1-Click Magic Link Verification Handler
// ─────────────────────────────────────────────────────────────
export const magicVerify = async (req, res, next) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(400).json({
        success: false,
        message: 'Work email and magic verification token are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = await OtpToken.findOne({ email: normalizedEmail });

    if (!record || !record.magicTokenHash) {
      return res.status(400).json({
        success: false,
        message: 'Verification link is invalid or has expired. Please request a new code.'
      });
    }

    const inputHash = hashWithPepper(token.trim());
    if (inputHash !== record.magicTokenHash) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token.'
      });
    }

    if (record.type === 'register') {
      let user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        user = await User.create({
          name: record.tempData?.name || 'Valued Client',
          email: normalizedEmail,
          password: record.tempData?.password,
          phone: record.tempData?.phone || '',
          company_name: record.tempData?.company_name || '',
          designation: record.tempData?.designation || 'Other / Professional',
          primary_interest: record.tempData?.primary_interest || 'both',
          company_size: record.tempData?.company_size || 'Undisclosed',
          city: record.tempData?.city || '',
          role: 'customer',
          email_verified: true,
          verification_token: null
        });
      } else {
        user.email_verified = true;
        await user.save();
      }

      await OtpToken.deleteOne({ _id: record._id });

      sendWelcomeEmail(user.email, user.name, getFrontendUrl(req))
        .catch((e) => console.warn('[Welcome Email Notice]', e.message));

      const jwtToken = generateToken(user._id, user.role);

      return res.status(200).json({
        success: true,
        type: 'register',
        message: 'Account verified via 1-Click Magic Link!',
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          company_name: user.company_name,
          designation: user.designation,
          role: user.role,
          email_verified: user.email_verified
        }
      });
    } else if (record.type === 'reset') {
      return res.status(200).json({
        success: true,
        type: 'reset',
        canReset: true,
        email: normalizedEmail,
        magicToken: token.trim(),
        message: 'Reset link verified. You may now enter your new password.'
      });
    }

    return res.status(400).json({ success: false, message: 'Unknown verification action.' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// Step 4: Send Password Reset 6-Digit OTP & Magic Link
// ─────────────────────────────────────────────────────────────
export const sendResetOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your work email address.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Security: Do not reveal if email is not registered
    if (!user) {
      return res.status(200).json({
        success: true,
        message: `If ${normalizedEmail} is registered, a password reset code has been dispatched.`
      });
    }

    // Enforce 60-second cooldown
    const existingOtp = await OtpToken.findOne({ email: normalizedEmail, type: 'reset' });
    if (existingOtp && existingOtp.lastSentAt) {
      const elapsedMs = Date.now() - new Date(existingOtp.lastSentAt).getTime();
      if (elapsedMs < 60000) {
        const remainingSec = Math.ceil((60000 - elapsedMs) / 1000);
        return res.status(429).json({
          success: false,
          error: `Please wait ${remainingSec} seconds before requesting another reset code.`
        });
      }
    }

    // Generate tokens & pepper hashes
    const otp = generateOtp();
    const magicToken = generateSecureToken(32);
    const otpHash = hashWithPepper(otp);
    const magicTokenHash = hashWithPepper(magicToken);

    await OtpToken.findOneAndUpdate(
      { email: normalizedEmail, type: 'reset' },
      {
        email: normalizedEmail,
        otpHash,
        magicTokenHash,
        type: 'reset',
        attempts: 0,
        lastSentAt: new Date(),
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    const frontendUrl = getFrontendUrl(req);
    const magicLink = `${frontendUrl}/reset-password?reset_email=${encodeURIComponent(normalizedEmail)}&reset_token=${magicToken}`;

    try {
      await sendOtpEmail(normalizedEmail, otp, 'reset', magicLink, user.name);
    } catch (mailErr) {
      console.error('[Send Reset OTP Error]', mailErr.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset code. Please try again in a moment.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `If ${normalizedEmail} is registered, a password reset code has been dispatched.`
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// Step 5: Verify Reset OTP & Update Password
// ─────────────────────────────────────────────────────────────
export const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp, magicToken, newPassword } = req.body;
    if (!email || (!otp && !magicToken) || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Work email, verification code (or magic token), and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = await OtpToken.findOne({ email: normalizedEmail, type: 'reset' });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'No active reset request found or code has expired. Please request a new code.'
      });
    }

    // Verify via Magic Token
    if (magicToken) {
      const tokenHash = hashWithPepper(magicToken.trim());
      if (tokenHash !== record.magicTokenHash) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired magic reset token.'
        });
      }
    } else {
      // Verify via 6-digit OTP
      if (record.attempts >= 5) {
        await OtpToken.deleteOne({ _id: record._id });
        return res.status(400).json({
          success: false,
          message: 'Too many incorrect attempts. Please request a new reset code.'
        });
      }

      const inputHash = hashWithPepper(otp.toString().trim());
      if (inputHash !== record.otpHash) {
        record.attempts = (record.attempts || 0) + 1;
        await record.save();
        const remaining = 5 - record.attempts;
        return res.status(400).json({
          success: false,
          message: `Invalid verification code. ${remaining} attempt(s) remaining.`
        });
      }
    }

    // Update User Password
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      await OtpToken.deleteOne({ _id: record._id });
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    user.password = newPassword;
    user.reset_token = null;
    user.reset_token_expiry = null;
    await user.save();

    // Clean up OTP record
    await OtpToken.deleteOne({ _id: record._id });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// Legacy & Existing Handlers (Preserving 100% Backward Compatibility)
// ─────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  return sendRegisterOtp(req, res, next);
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: user.block_reason || 'Your account has been suspended by the administrator.'
      });
    }

    if (user.role === 'customer' && !user.email_verified) {
      return res.status(403).json({
        success: false,
        isUnverified: true,
        email: user.email,
        message: 'Your corporate email is not verified yet. Please enter the verification code or request a fresh one.'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company_name: user.company_name,
        designation: user.designation,
        primary_interest: user.primary_interest,
        company_size: user.company_size,
        city: user.city,
        role: user.role,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verification_token: token });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification link.'
      });
    }

    user.email_verified = true;
    user.verification_token = null;
    await user.save();

    sendWelcomeEmail(user.email, user.name, getFrontendUrl(req))
      .catch((e) => console.warn('[Welcome Email Notice]', e.message));

    res.status(200).json({
      success: true,
      message: 'Email address verified successfully! You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  const { email } = req.body;
  req.body = { email, name: 'Valued Customer', password: 'TemporaryPassword123!' };
  return sendRegisterOtp(req, res, next);
};

export const forgotPassword = async (req, res, next) => {
  return sendResetOtp(req, res, next);
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, email } = req.body;
  req.body = { email, magicToken: token, newPassword: password };
  return verifyResetOtp(req, res, next);
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, company_name, designation, primary_interest, company_size, city, address } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (company_name) user.company_name = company_name;
    if (designation) user.designation = designation;
    if (primary_interest) user.primary_interest = primary_interest;
    if (company_size) user.company_size = company_size;
    if (city) user.city = city;
    if (address) user.address = address;
    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
};
