import { sendTransactionalEmail } from '../config/mailer.js';

export const sendVerificationEmail = async (email, name, token, clientUrl) => {
  const verifyUrl = `${clientUrl || 'http://localhost:5173'}/verify-email/${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-bottom: 8px;">Verify Your TechNova IT Account</h2>
      <p style="color: #475569; font-size: 14px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        Thank you for signing up with TechNova IT Solutions. Please click the button below to verify your email address and activate your corporate procurement account.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #94a3b8; font-size: 12px;">
        If you did not request this account, please ignore this email. Link valid for 24 hours.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 11px;">TechNova IT Solutions • Commercial IT Hardware & Rentals</p>
    </div>
  `;

  return await sendTransactionalEmail({
    to: email,
    subject: 'Action Required: Verify your TechNova account',
    html
  });
};

export const sendPasswordResetEmail = async (email, name, token, clientUrl) => {
  const resetUrl = `${clientUrl || 'http://localhost:5173'}/reset-password/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-bottom: 8px;">Password Reset Request</h2>
      <p style="color: #475569; font-size: 14px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #475569; font-size: 14px; line-height: 1.6;">
        We received a request to reset your password for TechNova IT Solutions. Click the button below to set a new password:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
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
    subject: 'Password Reset Instructions - TechNova IT',
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
    subject: `[New Lead] RFQ from ${inquiry.company_name} (${inquiry.quantity})`,
    html
  });
};
