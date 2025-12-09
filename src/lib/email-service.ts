import nodemailer from 'nodemailer';
import type { ChatConversation } from './types';
import {
  generateNewLeadEmailHtml,
  generateConversationEndedEmailHtml,
  generateManualNotificationEmailHtml,
} from './email-templates';

/**
 * Email notification service for lead alerts
 * Uses Gmail SMTP with App Password authentication
 */

/**
 * Check if a customer is ready to buy (urgent lead)
 */
function isUrgentLead(conversation: ChatConversation): boolean {
  const urgency = conversation.customerInfo?.urgency?.toLowerCase();
  const purchaseIntent = conversation.customerInfo?.purchaseIntent?.toLowerCase();

  // Check for high urgency or ready to buy intent
  return (
    urgency === 'high' ||
    urgency === 'alta' ||
    urgency === 'immediate' ||
    urgency === 'inmediata' ||
    purchaseIntent === 'ready_to_buy' ||
    purchaseIntent === 'listo_para_comprar' ||
    purchaseIntent === 'comprar_ahora'
  );
}

/**
 * Generate a descriptive email subject line
 */
function generateEmailSubject(
  conversation: ChatConversation,
  type: 'new_lead' | 'conversation_ended' | 'manual'
): string {
  const customerInfo = conversation.customerInfo;
  const name = customerInfo?.name || 'Cliente';
  const isUrgent = isUrgentLead(conversation);

  // Get primary model of interest
  const model = customerInfo?.interestedInModels?.[0] || '';

  // Get contact info for quick reference
  const phone = customerInfo?.phone;
  const hasContact = phone ? ` (Tel: ${phone})` : '';

  // Urgent prefix
  const urgentPrefix = isUrgent ? '🚨 URGENTE - LLAMAR: ' : '';

  switch (type) {
    case 'new_lead':
      if (isUrgent) {
        return `${urgentPrefix}${name} quiere ${model || 'comprar'}${hasContact}`;
      }
      return `🔔 Nuevo Lead: ${name}${model ? ` - Interesado en ${model}` : ''}${hasContact}`;

    case 'conversation_ended':
      if (isUrgent) {
        return `${urgentPrefix}${name} - Chat finalizado${model ? ` (${model})` : ''}${hasContact}`;
      }
      return `✅ Chat Completado: ${name}${model ? ` - ${model}` : ''}`;

    case 'manual':
      if (isUrgent) {
        return `${urgentPrefix}Resumen: ${name}${model ? ` - ${model}` : ''}${hasContact}`;
      }
      return `📋 Resumen: ${name}${model ? ` - Interesado en ${model}` : ''}`;

    default:
      return `Notificación - ${name}`;
  }
}

// Lazy initialization to avoid build-time errors when env vars are not set
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      throw new Error(
        'Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.'
      );
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }
  return transporter;
}

// Get the notification email from environment
function getNotificationEmail(): string {
  return process.env.ADMIN_NOTIFICATION_EMAIL || 'info@geolink.dev';
}

// Get the sender email from environment
function getSenderEmail(): string {
  return process.env.GMAIL_USER || 'geolinkitengineering@gmail.com';
}

/**
 * Send email with retry logic for transient failures
 * Retries up to maxRetries times with exponential backoff
 */
async function sendMailWithRetry(
  mailOptions: nodemailer.SendMailOptions,
  maxRetries: number = 2
): Promise<nodemailer.SentMessageInfo> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const info = await getTransporter().sendMail(mailOptions);
      return info;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[Email] Attempt ${attempt}/${maxRetries} failed:`, lastError.message);

      // Don't retry on the last attempt
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s...
        const delay = 1000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If we get here, all retries failed
  throw lastError;
}

/**
 * Send email notification when a new lead is captured
 * Triggered when save_customer_info is called
 */
export async function sendNewLeadNotification(
  conversation: ChatConversation
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = generateNewLeadEmailHtml(conversation);
    const subject = generateEmailSubject(conversation, 'new_lead');

    const info = await getTransporter().sendMail({
      from: `"Tecno Express" <${getSenderEmail()}>`,
      to: getNotificationEmail(),
      subject,
      html,
    });

    console.log('[Email] New lead notification sent:', info.messageId, '- Subject:', subject);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Failed to send new lead notification:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send email notification when a conversation ends
 * Triggered when conversation status changes to 'completed' or 'abandoned'
 * Uses retry logic to handle transient failures
 */
export async function sendConversationEndedNotification(
  conversation: ChatConversation
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = generateConversationEndedEmailHtml(conversation);
    const subject = generateEmailSubject(conversation, 'conversation_ended');

    const info = await sendMailWithRetry({
      from: `"Tecno Express" <${getSenderEmail()}>`,
      to: getNotificationEmail(),
      subject,
      html,
    });

    console.log('[Email] Conversation ended notification sent:', info.messageId, '- Subject:', subject);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Failed to send conversation ended notification after retries:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send email notification manually triggered by admin
 * Called from the admin panel
 */
export async function sendManualNotification(
  conversation: ChatConversation
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = generateManualNotificationEmailHtml(conversation);
    const subject = generateEmailSubject(conversation, 'manual');

    const info = await getTransporter().sendMail({
      from: `"Tecno Express" <${getSenderEmail()}>`,
      to: getNotificationEmail(),
      subject,
      html,
    });

    console.log('[Email] Manual notification sent:', info.messageId, '- Subject:', subject);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Failed to send manual notification:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Send email notification from contact form submission
 * Uses the same Gmail credentials as chat notifications
 */
export async function sendContactFormEmail(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { name, email, phone, message } = data;
    const timestamp = new Date().toLocaleString('es-NI', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Mensaje de Contacto</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
          📧 Nuevo Mensaje de Contacto
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
          Formulario de contacto - Tecno Express
        </p>
      </td>
    </tr>

    <!-- Contact Info -->
    <tr>
      <td style="padding: 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; padding: 20px;">
          <tr>
            <td style="padding: 15px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                👤 Información del Contacto
              </h2>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 100px;">Nombre:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Teléfono:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">
                    <a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Fecha:</td>
                  <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${timestamp}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Message -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-top: 20px;">
          <tr>
            <td style="padding: 15px;">
              <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                💬 Mensaje
              </h2>
              <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </td>
          </tr>
        </table>

        <!-- Quick Actions -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 25px;">
          <tr>
            <td align="center">
              <a href="mailto:${email}?subject=Re: Tu consulta en Tecno Express"
                 style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                📧 Responder por Email
              </a>
              ${phone ? `
              <a href="tel:${phone}"
                 style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; margin-left: 10px;">
                📞 Llamar
              </a>
              ` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; color: #64748b; font-size: 12px;">
          Este mensaje fue enviado desde el formulario de contacto de Tecno Express
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const subject = phone
      ? `📧 Contacto: ${name} (Tel: ${phone})`
      : `📧 Contacto: ${name}`;

    const info = await sendMailWithRetry({
      from: `"Tecno Express" <${getSenderEmail()}>`,
      to: getNotificationEmail(),
      replyTo: email,
      subject,
      html,
    });

    console.log('[Email] Contact form notification sent:', info.messageId, '- Subject:', subject);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Failed to send contact form notification:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Check if email service is properly configured
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

/**
 * Verify email configuration by attempting a connection
 */
export async function verifyEmailConfiguration(): Promise<{
  configured: boolean;
  verified: boolean;
  error?: string;
}> {
  if (!isEmailConfigured()) {
    return {
      configured: false,
      verified: false,
      error: 'Gmail credentials not configured',
    };
  }

  try {
    await getTransporter().verify();
    return { configured: true, verified: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { configured: true, verified: false, error: errorMessage };
  }
}
