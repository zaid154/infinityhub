import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  connectionTimeout: 6000,
  greetingTimeout: 4000,
  socketTimeout: 6000,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendTransactionalEmail = async ({ to, subject, html, text, fromName }) => {
  const senderEmail = process.env.SMTP_USER || 'trendykart.app@gmail.com';
  const senderName = fromName || 'Demo Infotech';

  // 1. Try Brevo HTTPS API if key is set (Works 100% on cloud platforms like Render/Vercel)
  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
          'accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: text || ''
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[Brevo API Email Sent] Message ID: ${data.messageId} to ${to}`);
        return { success: true, messageId: data.messageId };
      } else {
        console.error(`[Brevo API Response Error]:`, data);
      }
    } catch (err) {
      console.error(`[Brevo API Fetch Error]:`, err.message);
    }
  }

  // 2. Try Resend HTTPS API if key is set (Works 100% on Render/Vercel)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${senderName} <onboarding@resend.dev>`,
          to: [to],
          subject,
          html,
          text: text || ''
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[Resend Email Sent] ID: ${data.id} to ${to}`);
        return { success: true, messageId: data.id };
      } else {
        console.error(`[Resend API Error]:`, data);
      }
    } catch (err) {
      console.error(`[Resend Fetch Error]:`, err.message);
    }
  }

  // 3. Fallback to Nodemailer SMTP
  try {
    const sender = process.env.SMTP_FROM || `"${senderName}" <${senderEmail}>`;
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
    console.log(`[SMTP Email Sent] Message ID: ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP Email Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

export default transporter;
