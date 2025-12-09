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
 */
export async function sendConversationEndedNotification(
  conversation: ChatConversation
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = generateConversationEndedEmailHtml(conversation);
    const subject = generateEmailSubject(conversation, 'conversation_ended');

    const info = await getTransporter().sendMail({
      from: `"Tecno Express" <${getSenderEmail()}>`,
      to: getNotificationEmail(),
      subject,
      html,
    });

    console.log('[Email] Conversation ended notification sent:', info.messageId, '- Subject:', subject);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Email] Failed to send conversation ended notification:', errorMessage);
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
