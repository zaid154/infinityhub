import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../utils/sendEmail.js';

// @desc    Register a new customer
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, company_name, designation, primary_interest, company_size, city, honeypot } = req.body;

    // Anti-bot honeypot trap: if filled by a robot, silently pretend success
    if (honeypot) {
      return res.status(200).json({
        success: true,
        requiresVerification: true,
        message: 'Registration initiated. Please check your corporate inbox to verify your email.'
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Normalize company_size to match strict User schema enum: ['1-10', '11-50', '51-200', '200+', 'Undisclosed']
    let normalizedSize = 'Undisclosed';
    const rawSize = (company_size || '').toString().trim().toLowerCase();
    if (rawSize.includes('200+') || rawSize.includes('500+') || rawSize.includes('enterprise')) {
      normalizedSize = '200+';
    } else if (rawSize.includes('51') || rawSize.includes('50') || rawSize.includes('200')) {
      normalizedSize = '51-200';
    } else if (rawSize.includes('11') || rawSize.includes('50')) {
      normalizedSize = '11-50';
    } else if (rawSize.includes('1') || rawSize.includes('10')) {
      normalizedSize = '1-10';
    } else if (['1-10', '11-50', '51-200', '200+'].includes(company_size)) {
      normalizedSize = company_size;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      company_name: company_name || '',
      designation: designation || 'Other / Professional',
      primary_interest: ['rent', 'buy', 'both', 'buyback'].includes(primary_interest) ? primary_interest : 'both',
      company_size: normalizedSize,
      city: city || '',
      role: 'customer',
      email_verified: false,
      verification_token: verificationToken
    });

    // Send corporate verification link via SMTP
    try {
      sendVerificationEmail(
        user.email,
        user.name,
        verificationToken,
        process.env.CLIENT_URL
      ).catch((e) => console.error('[Verification Email Async Error]', e.message));
    } catch (emailErr) {
      console.error('[Verification Email Dispatch Error]', emailErr);
    }

    // Explicitly do NOT return auth JWT token - require email activation first
    res.status(201).json({
      success: true,
      requiresVerification: true,
      message: `Enterprise registration successful! An activation link has been dispatched to ${user.email}.`,
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (Admin or Customer)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
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

    // Check if account has been blocked by administrator
    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: user.block_reason
          ? `Your corporate account has been suspended: ${user.block_reason}`
          : 'Your account has been suspended by the administrator. Please contact enterprise support.'
      });
    }

    // Require email verification for customer accounts to prevent bot/spam abuse
    if (user.role === 'customer' && !user.email_verified) {
      return res.status(403).json({
        success: false,
        isUnverified: true,
        email: user.email,
        message: 'Your corporate email is not verified yet. Please check your inbox or spam folder to activate your account.'
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
        designation: user.designation || 'Other / Professional',
        primary_interest: user.primary_interest || 'both',
        company_size: user.company_size || 'Undisclosed',
        city: user.city || '',
        role: user.role,
        email_verified: user.email_verified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
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

    // Send corporate welcome email asynchronously upon successful verification
    try {
      sendWelcomeEmail(
        user.email,
        user.name,
        process.env.CLIENT_URL
      ).catch((e) => console.error('[Welcome Email Async Notice]', e.message));
    } catch (emailErr) {
      console.error('[Welcome Email Failed]', emailErr);
    }

    res.status(200).json({
      success: true,
      message: 'Email address verified successfully! You can now log in to your corporate desk.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend corporate verification link
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res, next) => {
  try {
    const { email, honeypot } = req.body;

    // Honeypot bot protection
    if (honeypot) {
      return res.status(200).json({
        success: true,
        message: 'If an account matches this corporate address, an activation link has been resent.'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your corporate email address.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't leak registered addresses to prevent user harvesting
      return res.status(200).json({
        success: true,
        message: 'If an account matches this corporate address, an activation link has been resent.'
      });
    }

    if (user.email_verified) {
      return res.status(400).json({
        success: false,
        isAlreadyVerified: true,
        message: 'This corporate account is already verified. Please sign in directly.'
      });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verification_token = verificationToken;
    await user.save();

    await sendVerificationEmail(user.email, user.name, verificationToken, process.env.CLIENT_URL);

    res.status(200).json({
      success: true,
      message: `A fresh activation link has been dispatched to ${user.email}. Please check your inbox and spam folder.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal account existence for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.reset_token = resetToken;
    user.reset_token_expiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken, process.env.CLIENT_URL);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const user = await User.findOne({
      reset_token: token,
      reset_token_expiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token.'
      });
    }

    user.password = password;
    user.reset_token = null;
    user.reset_token_expiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
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

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};
