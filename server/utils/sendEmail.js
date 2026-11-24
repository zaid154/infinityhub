import { sendTransactionalEmail } from '../config/mailer.js';
import SiteSettings from '../models/SiteSettings.js';

/**
 * Send 6-Digit OTP Email with embedded 1-Click Magic Link
 */
export const sendOtpEmail = async (email, otp, type = 'register', magicLink = '', name = 'Valued Customer') => {
  const settings = await SiteSettings.findOne().catch(() => null);
  const brandName = settings?.brand_name || 'Demo Infotech';
  const tagline = settings?.tagline || 'Commercial IT Hardware & Rentals';
  const supportPhone = settings?.phone || '+91 11 4123 4567';
  const supportEmail = settings?.support_email || 'support@demoinfotech.in';

  const isRegister = type === 'register';
  const subject = isRegister
    ? `Your Verification Code is ${otp} — ${brandName}`
    : `Your Password Reset Code is ${otp} — ${brandName}`;

  const headerTitle = isRegister
    ? 'Corporate Account Verification'
    : 'Password Reset Verification';

  const actionDescription = isRegister
    ? `Use the 6-digit verification code below to activate your enterprise procurement desk for <strong>${brandName}</strong>.`
    : `Use the 6-digit verification code below to securely reset the password for your <strong>${brandName}</strong> account.`;

  const buttonText = isRegister
    ? 'Verify Account in 1-Click →'
    : 'Reset Password in 1-Click →';

  // Format OTP digits with visible spacing
  const formattedOtp = otp.toString().split('').join('&nbsp;&nbsp;');

  const text = `${headerTitle}\n\nHello ${name},\n\nYour 6-digit verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nAlternatively, verify immediately using your 1-Click Magic Link:\n${magicLink}\n\nSupport: ${supportPhone} | ${supportEmail}\n${brandName} • ${tagline}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 24px 12px; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5dfd3; overflow: hidden; box-shadow: 0 4px 16px rgba(13, 59, 42, 0.08);">
          
          <!-- Corporate Brand Header -->
          <div style="background-color: #0D3B2A; padding: 32px 24px; text-align: center;">
            <div style="color: #D4A24C; font-size: 22px; font-weight: bold; letter-spacing: 1px; font-family: Georgia, serif;">
              ★ ${brandName.toUpperCase()}
            </div>
            <div style="color: rgba(250, 247, 242, 0.75); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
              Enterprise IT Procurement & Hardware Leasing
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 28px;">
            <div style="display: inline-block; padding: 4px 12px; background: #FAF7F2; border: 1px solid rgba(212, 162, 76, 0.4); border-radius: 9999px; font-size: 11px; font-weight: bold; color: #8A5E12; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
              ${headerTitle}
            </div>

            <h2 style="color: #0D3B2A; font-size: 20px; font-weight: bold; margin: 0 0 12px 0; font-family: Georgia, serif;">
              Hello ${name},
            </h2>

            <p style="color: #4A5568; font-size: 13.5px; line-height: 1.6; margin: 0 0 24px 0;">
              ${actionDescription}
            </p>

            <!-- 6-DIGIT OTP BOX -->
            <div style="background: #FAF7F2; border: 2px dashed rgba(212, 162, 76, 0.6); border-radius: 12px; padding: 22px 16px; text-align: center; margin-bottom: 24px;">
              <div style="color: #8A5E12; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                Your 6-Digit Verification Code
              </div>
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; color: #0D3B2A; letter-spacing: 6px; user-select: all;">
                ${formattedOtp}
              </div>
              <div style="color: #5A6B63; font-size: 11.5px; margin-top: 8px;">
                ⏱ Valid for <strong>10 minutes</strong>. Do not share this code with anyone.
              </div>
            </div>

            ${magicLink ? `
            <!-- 1-CLICK MAGIC LINK BUTTON -->
            <div style="text-align: center; margin: 28px 0 20px 0;">
              <div style="color: #718096; font-size: 11.5px; margin-bottom: 12px;">
                — OR VERIFY IN ONE CLICK —
              </div>
              <a href="${magicLink}" style="background-color: #0D3B2A; color: #FAF7F2; padding: 14px 34px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; border: 1px solid rgba(212, 162, 76, 0.5); box-shadow: 0 4px 10px rgba(13, 59, 42, 0.15);">
                ${buttonText}
              </a>
            </div>
            ` : ''}

            <div style="margin-top: 24px; padding: 14px 16px; background: #FAF7F2; border-radius: 10px; border-left: 3px solid #D4A24C;">
              <p style="color: #5A6B63; font-size: 11px; margin: 0; line-height: 1.5;">
                <strong>Enterprise Security Notice:</strong> If you did not initiate this request on ${brandName}, please ignore this email or contact our security desk immediately at <a href="mailto:${supportEmail}" style="color: #8A5E12; text-decoration: none;">${supportEmail}</a>.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8f6f0; border-top: 1px solid #eae5db; padding: 16px 28px; text-align: center; color: #8C9B90; font-size: 10.5px;">
            <p style="margin: 0;">${brandName} • ${tagline}</p>
            <p style="margin: 4px 0 0 0;">Helpdesk: ${supportPhone} | ${supportEmail}</p>
          </div>

        </div>
      </body>
    </html>
  `;

  return await sendTransactionalEmail({
    to: email,
    subject,
    html,
    text,
    fromName: brandName,
    templateType: isRegister ? 'register_otp' : 'reset_otp'
  });
};

export const sendWelcomeEmail = async (email, name, clientUrl) => {
  const settings = await SiteSettings.findOne().catch(() => null);
  const brandName = settings?.brand_name || 'Demo Infotech';
  const tagline = settings?.tagline || 'Commercial IT Hardware & Rentals';
  const loginUrl = `${settings?.website_url || clientUrl || 'https://infinityhub-pro.vercel.app'}/login`;
  const supportPhone = settings?.phone || '+91 11 4123 4567';
  const supportEmail = settings?.support_email || 'support@demoinfotech.in';

  const subject = `Welcome to ${brandName} — Your Corporate Account is Active`;

  const text = `Hello ${name},\n\nWelcome to ${brandName}. Your enterprise procurement and leasing account is now fully active.\n\nYou can access corporate rental fleet pricing, Net-30 purchase orders, and verified GST invoices directly from your corporate portal.\n\nSign in to your portal: ${loginUrl}\n\nSupport Desk: ${supportPhone} | ${supportEmail}\n${brandName} • ${tagline}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5dfd3; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <div style="background-color: #0D3B2A; padding: 32px 28px; text-align: center;">
            <div style="color: #D4A24C; font-size: 22px; font-weight: bold; letter-spacing: 0.5px; font-family: Georgia, serif;">
              ★ ${brandName.toUpperCase()}
            </div>
            <div style="color: rgba(250, 247, 242, 0.75); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
              Enterprise IT Procurement & Leasing Portal
            </div>
          </div>

          <div style="padding: 32px 28px;">
            <h2 style="color: #0D3B2A; font-size: 20px; font-weight: bold; margin: 0 0 12px 0; font-family: Georgia, serif;">
              Welcome to ${brandName}, ${name}!
            </h2>
            <p style="color: #4A5568; font-size: 13.5px; line-height: 1.6; margin: 0 0 20px 0;">
              Your corporate account is now <strong>active</strong> and ready to use. You can immediately access verified fleet inventory, Net-30 corporate proforma POs, and 18% Input Tax Credit invoicing.
            </p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${loginUrl}" style="background-color: #0D3B2A; color: #FAF7F2; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; border: 1px solid rgba(212, 162, 76, 0.5);">
                Access Corporate Portal →
              </a>
            </div>

            <p style="color: #718096; font-size: 11.5px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
              Need custom procurement assistance? Reach out to our B2B procurement desk at <a href="mailto:${supportEmail}" style="color: #8A5E12; font-weight: bold; text-decoration: none;">${supportEmail}</a> or call <strong>${supportPhone}</strong>.
            </p>
          </div>

          <div style="background: #f8f6f0; border-top: 1px solid #eae5db; padding: 16px 28px; text-align: center; color: #8C9B90; font-size: 10.5px;">
            <p style="margin: 0;">${brandName} • ${tagline}</p>
            <p style="margin: 4px 0 0 0;">This is an official transactional notification sent to ${email}.</p>
          </div>

        </div>
      </body>
    </html>
  `;

  return await sendTransactionalEmail({
    to: email,
    subject,
    html,
    text,
    fromName: brandName,
    templateType: 'welcome'
  });
};

export const sendVerificationEmail = async (email, name, token, clientUrl) => {
  const settings = await SiteSettings.findOne().catch(() => null);
  const brandName = settings?.brand_name || 'Demo Infotech';
  const tagline = settings?.tagline || 'Commercial IT Hardware & Rentals';
  const verifyUrl = `${settings?.website_url || clientUrl || 'https://infinityhub-pro.vercel.app'}/verify-email/${token}`;
  const supportPhone = settings?.phone || '+91 11 4123 4567';
  const supportEmail = settings?.support_email || 'support@demoinfotech.in';

  const subject = `Action Required: Verify Your Corporate Account — ${brandName}`;

  const html = `
    <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5dfd3; overflow: hidden;">
      <div style="background-color: #0D3B2A; padding: 30px 28px; text-align: center;">
        <div style="color: #D4A24C; font-size: 22px; font-weight: bold; font-family: Georgia, serif;">★ ${brandName.toUpperCase()}</div>
      </div>
      <div style="padding: 32px 28px;">
        <h2 style="color: #0D3B2A; font-size: 20px;">Activate Your Business Account, ${name}</h2>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${verifyUrl}" style="background-color: #0D3B2A; color: #FAF7F2; padding: 14px 36px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 13px; display: inline-block;">
            Verify Email Address →
          </a>
        </div>
      </div>
    </div>
  `;

  return await sendTransactionalEmail({
    to: email,
    subject,
    html,
    fromName: brandName,
    templateType: 'verification'
  });
};

export const sendPasswordResetEmail = async (email, name, token, clientUrl) => {
  const resetUrl = `${clientUrl || 'https://infinityhub-pro.vercel.app'}/reset-password/${token}`;
  const settings = await SiteSettings.findOne().catch(() => null);
  const brandName = settings?.brand_name || 'Demo Infotech';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0D3B2A; margin-bottom: 8px;">Password Reset Request</h2>
      <p style="color: #475569; font-size: 14px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        We received a request to reset your password for ${brandName}. Click the button below to set a new password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #0D3B2A; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
          Reset My Password
        </a>
      </div>
    </div>
  `;

  return await sendTransactionalEmail({
    to: email,
    subject: `Password Reset Instructions - ${brandName}`,
    html,
    templateType: 'reset_otp'
  });
};

export const sendInquiryAdminAlert = async (adminEmail, inquiry) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #16a34a; margin-bottom: 8px;">🚨 New Corporate RFQ / Inquiry Received</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr><td style="padding: 8px; color: #64748b; font-weight: bold;">Company:</td><td style="padding: 8px; color: #0f172a;">${inquiry.company_name}</td></tr>
        <tr><td style="padding: 8px; color: #64748b; font-weight: bold;">Contact Person:</td><td style="padding: 8px; color: #0f172a;">${inquiry.contact_person}</td></tr>
        <tr><td style="padding: 8px; color: #64748b; font-weight: bold;">Phone:</td><td style="padding: 8px; color: #0f172a;">${inquiry.phone}</td></tr>
        <tr><td style="padding: 8px; color: #64748b; font-weight: bold;">Email:</td><td style="padding: 8px; color: #0f172a;">${inquiry.email || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; color: #64748b; font-weight: bold;">Requirement:</td><td style="padding: 8px; color: #0f172a;">${inquiry.inquiry_type}</td></tr>
        <tr><td style="padding: 8px; color: #64748b; font-weight: bold;">Quantity:</td><td style="padding: 8px; color: #0f172a;">${inquiry.quantity}</td></tr>
      </table>
    </div>
  `;

  return await sendTransactionalEmail({
    to: adminEmail,
    subject: `🚨 [RFQ Alert] ${inquiry.company_name} requested ${inquiry.quantity} units`,
    html,
    templateType: 'rfq_alert'
  });
};
