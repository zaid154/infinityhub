import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EmailLog from '../models/EmailLog.js';

dotenv.config();

let cachedTransporter = null;
let lastConfigHash = '';
let cachedBrevoSender = null; // { apiKey, email, expiresAt }

const DEFAULT_BREVO_SENDER = 'zaidm1323@gmail.com';

/**
 * Dynamically resolves a validated active sender in the Brevo account.
 * Using an unverified address causes Brevo to accept HTTP 201 and then reject delivery.
 */
export async function resolveBrevoSender(apiKey) {
  if (process.env.BREVO_SENDER_EMAIL) {
    return process.env.BREVO_SENDER_EMAIL.trim();
  }

  const now = Date.now();
  if (
    cachedBrevoSender &&
    cachedBrevoSender.apiKey === apiKey &&
    cachedBrevoSender.expiresAt > now
  ) {
    return cachedBrevoSender.email;
  }

  if (apiKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/senders', {
        headers: {
          accept: 'application/json',
          'api-key': apiKey
        },
        signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const activeSenders = (data?.senders || []).filter((s) => s.active && s.email);
        const preferred =
          activeSenders.find((s) => !s.email.toLowerCase().endsWith('@gmail.com')) ||
          activeSenders[0];

        if (preferred?.email) {
          const resolved = preferred.email.trim();
          cachedBrevoSender = {
            apiKey,
            email: resolved,
            expiresAt: now + 30 * 60 * 1000 // Cache for 30 minutes
          };
          return resolved;
        }
      }
    } catch (err) {
      console.warn('[Mailer] Could not query Brevo /v3/senders:', err.message);
    }
  }

  return (process.env.ADMIN_EMAIL || DEFAULT_BREVO_SENDER).trim();
}

/**
 * Creates/caches Nodemailer transport
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const hash = `${host}:${port}:${user}:${pass}`;

  if (cachedTransporter && lastConfigHash === hash) {
    return cachedTransporter;
  }

  if (!user || !pass) return null;

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    connectionTimeout: 6000,
    greetingTimeout: 4000,
    socketTimeout: 6000,
    auth: { user, pass }
  });

  lastConfigHash = hash;
  return cachedTransporter;
}

/**
 * Asynchronously logs dispatch telemetry to MongoDB EmailLog collection
 */
async function recordTelemetry({ recipient, templateType, channel, status, latencyMs, errorMessage, messageId }) {
  try {
    if (mongoose.connection?.readyState !== 1) return;
    const log = new EmailLog({
      recipient: (recipient || '').toLowerCase().trim(),
      templateType: templateType || 'register_otp',
      channel: channel || 'unknown',
      status: status || 'delivered',
      latencyMs: latencyMs || 0,
      errorMessage: errorMessage || null,
      messageId: messageId || null
    });
    await log.save();
  } catch (err) {
    console.warn('[Mailer Telemetry Warning] Failed to save log:', err.message);
  }
}

/**
 * Core Dual-Channel Email Engine with Smart Environment Priority:
 * - On Cloud (Render/Vercel): Outbound SMTP (ports 587/465) is blocked, so Brevo REST API (HTTPS port 443) is tried FIRST.
 * - On Local Dev: Gmail SMTP is tried first for immediate local inbox delivery.
 */
export const sendTransactionalEmail = async ({
  to,
  subject,
  html,
  text,
  fromName = 'Demo Infotech',
  templateType = 'register_otp'
}) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const start = Date.now();
  const errors = [];

  const isCloudHosted = !!(
    process.env.RENDER ||
    process.env.RENDER_SERVICE_ID ||
    process.env.VERCEL ||
    process.env.HEROKU ||
    process.env.FLY_APP_NAME
  );

  // Cloud: Brevo HTTPS First -> SMTP fallback
  // Local: SMTP First -> Brevo HTTPS fallback
  const channels = isCloudHosted ? ['brevo', 'smtp'] : ['smtp', 'brevo'];

  for (const channel of channels) {
    // 1. Brevo HTTPS API Channel (Port 443)
    if (channel === 'brevo' && brevoApiKey) {
      try {
        const senderEmail = await resolveBrevoSender(brevoApiKey);
        const emailPayload = {
          sender: { name: fromName, email: senderEmail },
          to: [{ email: to.trim() }],
          subject,
          htmlContent: html
        };
        if (text && text.trim().length > 0) {
          emailPayload.textContent = text.trim();
        }

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'content-type': 'application/json',
            accept: 'application/json'
          },
          body: JSON.stringify(emailPayload),
          signal: AbortSignal.timeout(10000)
        });

        const data = await res.json();
        const latencyMs = Date.now() - start;

        if (res.ok) {
          console.log(`[Brevo API Email Delivered] (${latencyMs}ms) ID: ${data.messageId} to ${to}`);
          recordTelemetry({
            recipient: to,
            templateType,
            channel: 'brevo_api',
            status: 'delivered',
            latencyMs,
            messageId: data.messageId
          });
          return { success: true, provider: 'brevo_api', messageId: data.messageId, latencyMs };
        } else {
          console.error('[Brevo API Response Error]:', data);
          errors.push(`Brevo API (${data.message || res.status})`);
        }
      } catch (err) {
        console.error('[Brevo API Network Error]:', err.message);
        errors.push(`Brevo Network (${err.message})`);
      }
    }

    // 2. Nodemailer SMTP Channel
    if (channel === 'smtp') {
      const tx = getTransporter();
      if (tx) {
        try {
          const senderUser = process.env.SMTP_USER;
          const from = process.env.SMTP_FROM || `"${fromName}" <${senderUser}>`;
          const info = await tx.sendMail({
            from,
            to: to.trim(),
            subject,
            text: text || '',
            html,
            headers: {
              'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
              'X-Mailer': 'DemoInfotech-Engine'
            }
          });
          const latencyMs = Date.now() - start;
          console.log(`[SMTP Email Delivered] (${latencyMs}ms) ID: ${info.messageId} to ${to}`);
          recordTelemetry({
            recipient: to,
            templateType,
            channel: 'gmail_smtp',
            status: 'delivered',
            latencyMs,
            messageId: info.messageId
          });
          return { success: true, provider: 'gmail_smtp', messageId: info.messageId, latencyMs };
        } catch (err) {
          console.error(`[SMTP Email Error] to ${to}:`, err.message);
          errors.push(`SMTP (${err.message})`);
        }
      }
    }
  }

  // 3. Resend HTTPS API Optional Fallback
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${fromName} <onboarding@resend.dev>`,
          to: [to.trim()],
          subject,
          html,
          text: text || ''
        }),
        signal: AbortSignal.timeout(8000)
      });
      const data = await res.json();
      const latencyMs = Date.now() - start;
      if (res.ok) {
        recordTelemetry({
          recipient: to,
          templateType,
          channel: 'resend_api',
          status: 'delivered',
          latencyMs,
          messageId: data.id
        });
        return { success: true, provider: 'resend_api', messageId: data.id, latencyMs };
      }
    } catch (err) {
      errors.push(`Resend (${err.message})`);
    }
  }

  const latencyMs = Date.now() - start;
  recordTelemetry({
    recipient: to,
    templateType,
    channel: 'unknown',
    status: 'failed',
    latencyMs,
    errorMessage: errors.join(' | ')
  });

  return { success: false, errors, latencyMs };
};

export default getTransporter;
