import { sendTransactionalEmail } from '../config/mailer.js';
import SiteSettings from '../models/SiteSettings.js';

export const sendWelcomeEmail = async (email, name, clientUrl) => {
  const settings = await SiteSettings.findOne().catch(() => null);
  const brandName = settings?.brand_name || 'Demo Infotech';
  const tagline = settings?.tagline || 'Commercial IT Hardware & Rentals';
  const loginUrl = `${settings?.website_url || clientUrl || 'http://localhost:5173'}/login`;
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
          
          <!-- Header -->
          <div style="background-color: #0D3B2A; padding: 32px 28px; text-align: center;">
            <div style="color: #D4A24C; font-size: 22px; font-weight: bold; letter-spacing: 0.5px; font-family: Georgia, serif;">
              ★ ${brandName.toUpperCase()}
            </div>
            <div style="color: rgba(250, 247, 242, 0.75); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
              Enterprise IT Procurement & Leasing Portal
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 28px;">
            <h2 style="color: #0D3B2A; font-size: 20px; font-weight: bold; margin: 0 0 12px 0; font-family: Georgia, serif;">
              Welcome to ${brandName}, ${name}!
            </h2>
            <p style="color: #4A5568; font-size: 13.5px; line-height: 1.6; margin: 0 0 20px 0;">
              Your corporate account is now <strong>active</strong> and ready to use. You can immediately access verified fleet inventory, Net-30 corporate proforma POs, and 18% Input Tax Credit invoicing.
            </p>

            <!-- Feature Pills Box -->
            <div style="background: #FAF7F2; border: 1px solid rgba(212, 162, 76, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
              <div style="color: #0D3B2A; font-weight: bold; font-size: 12.5px; margin-bottom: 8px;">
                Your Enterprise Account Benefits:
              </div>
              <ul style="margin: 0; padding-left: 18px; color: #5A6B63; font-size: 12px; line-height: 1.8;">
                <li><strong>Net-30 Corporate POs:</strong> Order commercial hardware without personal card charges.</li>
                <li><strong>24–48h SLA Standby Swaps:</strong> Zero-capex operating leases with rapid replacements.</li>
                <li><strong>GSTR-2B Verified:</strong> Direct 18% ITC claims on all hardware procurement dispatches.</li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 28px 0;">
              <a href="${loginUrl}" style="background-color: #0D3B2A; color: #FAF7F2; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; border: 1px solid rgba(212, 162, 76, 0.5);">
                Access Corporate Portal →
              </a>
            </div>

            <p style="color: #718096; font-size: 11.5px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
              Need custom procurement assistance? Reach out to our B2B procurement desk at <a href="mailto:${supportEmail}" style="color: #8A5E12; font-weight: bold; text-decoration: none;">${supportEmail}</a> or call <strong>${supportPhone}</strong>.
            </p>
          </div>

          <!-- Footer -->
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
    fromName: brandName
  });
};

export const sendVerificationEmail = async (email, name, token, clientUrl) => {
  const settings = await SiteSettings.findOne().catch(() => null);
  const brandName = settings?.brand_name || 'Demo Infotech';
  const tagline = settings?.tagline || 'Commercial IT Hardware & Rentals';
  const verifyUrl = `${settings?.website_url || clientUrl || 'http://localhost:5173'}/verify-email/${token}`;
  const supportPhone = settings?.phone || '+91 11 4123 4567';
  const supportEmail = settings?.support_email || 'support@demoinfotech.in';

  const subject = `Action Required: Verify Your Corporate Account — ${brandName}`;

  const text = `Hello ${name},\n\nThank you for registering with ${brandName}.\n\nTo activate your corporate procurement desk and access Net-30 purchase orders and verified lease pricing, please verify your email address:\n\n${verifyUrl}\n\nThis activation link is valid for 24 hours. If you did not initiate this registration, please disregard this notification.\n\nSupport Desk: ${supportPhone} | ${supportEmail}\n${brandName} • ${tagline}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e5dfd3; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Corporate Header -->
          <div style="background-color: #0D3B2A; padding: 30px 28px; text-align: center;">
            <div style="color: #D4A24C; font-size: 22px; font-weight: bold; letter-spacing: 0.5px; font-family: Georgia, serif;">
              ★ ${brandName.toUpperCase()}
            </div>
            <div style="color: rgba(250, 247, 242, 0.75); font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">
              Enterprise IT Procurement & Leasing Portal
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 28px;">
            <div style="display: inline-block; padding: 4px 12px; background: #FAF7F2; border: 1px solid rgba(212, 162, 76, 0.4); border-radius: 9999px; font-size: 11px; font-weight: bold; color: #8A5E12; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
              Corporate Account Verification
            </div>

            <h2 style="color: #0D3B2A; font-size: 20px; font-weight: bold; margin: 0 0 12px 0; font-family: Georgia, serif;">
              Activate Your Business Account, ${name}
            </h2>

            <p style="color: #4A5568; font-size: 13.5px; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for registering your company on <strong>${brandName}</strong>. To safeguard corporate accounts and verify your organization credentials, please confirm your email address below.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 28px 0;">
              <a href="${verifyUrl}" style="background-color: #0D3B2A; color: #FAF7F2; padding: 14px 36px; text-decoration: none; border-radius: 9999px; font-weight: bold; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; display: inline-block; border: 1px solid rgba(212, 162, 76, 0.5); box-shadow: 0 4px 8px rgba(13, 59, 42, 0.2);">
                Verify Email Address →
              </a>
            </div>

            <p style="color: #718096; font-size: 11.5px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
              Or copy and paste this link into your browser:<br />
              <a href="${verifyUrl}" style="color: #8A5E12; word-break: break-all; font-size: 11px; text-decoration: underline;">${verifyUrl}</a>
            </p>

            <div style="margin-top: 24px; padding: 14px 16px; background: #FAF7F2; border-radius: 10px; border-left: 3px solid #D4A24C;">
              <p style="color: #5A6B63; font-size: 11px; margin: 0; line-height: 1.5;">
                <strong>Enterprise Security Notice:</strong> This activation link will expire in 24 hours. If you did not create an account with ${brandName}, no further action is necessary.
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
    fromName: brandName
  });
};

export const sendPasswordResetEmail = async (email, name, token, clientUrl) => {
  const resetUrl = `${clientUrl || 'http://localhost:5173'}/reset-password/${token}`;
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
      <p style="color: #94a3b8; font-size: 12px;">
        This link is valid for 1 hour. If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
  `;

  return await sendTransactionalEmail({
    to: email,
    subject: `Password Reset Instructions - ${brandName}`,
    html
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
        <tr><td style="padding: 8px; color: #64748b; font-weight: bold;">City:</td><td style="padding: 8px; color: #0f172a;">${inquiry.city || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; color: #64748b; font-weight: bold;">Notes:</td><td style="padding: 8px; color: #0f172a;">${inquiry.message || 'None'}</td></tr>
      </table>
      <div style="margin-top: 20px;">
        <a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" style="background-color: #25D366; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px; display: inline-block;">
          Reply on WhatsApp
        </a>
      </div>
    </div>
  `;

  return await sendTransactionalEmail({
    to: adminEmail,
    subject: `🚨 [RFQ Alert] ${inquiry.company_name} requested ${inquiry.quantity} units`,
    html
  });
};
