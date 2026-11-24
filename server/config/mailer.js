import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendTransactionalEmail = async ({ to, subject, html, text, fromName }) => {
  try {
    const sender = process.env.SMTP_FROM || `"${fromName || 'Demo Infotech'}" <${process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      text: text || '',
      html,
      headers: {
        'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        'X-Mailer': 'DemoInfotech-Mailer'
      }
    });
    console.log(`[Email Sent] Message ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

export default transporter;
