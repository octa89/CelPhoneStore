import type { ChatConversation } from './types';

/**
 * Email templates for lead notifications
 * Simplified to show only essential details and metadata
 * Only includes purchase details when customer wants to buy
 */

// Common phone model patterns to extract from messages
const MODEL_PATTERNS = [
  // iPhone patterns
  /iPhone\s*\d+(\s*(Pro|Plus|Pro\s*Max|mini))?/gi,
  // Samsung Galaxy patterns
  /Galaxy\s*(S|A|Z|Note)\s*\d+(\s*(Ultra|\+|Plus|FE|Fold|Flip))?/gi,
  /Samsung\s*Galaxy\s*(S|A|Z|Note)\s*\d+(\s*(Ultra|\+|Plus|FE|Fold|Flip))?/gi,
  // Google Pixel patterns
  /Pixel\s*\d+(\s*(Pro|a|XL))?/gi,
  /Google\s*Pixel\s*\d+(\s*(Pro|a|XL))?/gi,
  // Xiaomi patterns
  /Xiaomi\s*\d+(\s*(Pro|Ultra|T))?/gi,
  /Redmi\s*(Note\s*)?\d+(\s*(Pro|Ultra|T))?/gi,
  // OnePlus patterns
  /OnePlus\s*\d+(\s*(Pro|T|R))?/gi,
  // Motorola patterns
  /Moto\s*(G|E|Edge)\s*\d*(\s*(Power|Plus|Pro))?/gi,
  // Generic model references
  /S\s*24(\s*(Ultra|\+|Plus))?/gi,
  /A\s*(54|55|34|35|14|15)(\s*5G)?/gi,
];

/**
 * Extract phone models mentioned in user messages
 * Used as fallback when interestedInModels is empty
 */
function extractModelsFromMessages(conversation: ChatConversation): string[] {
  const userMessages = conversation.messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ');

  const foundModels = new Set<string>();

  for (const pattern of MODEL_PATTERNS) {
    const matches = userMessages.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Normalize the match (capitalize properly)
        const normalized = match.trim()
          .replace(/\s+/g, ' ')
          .replace(/iphone/gi, 'iPhone')
          .replace(/galaxy/gi, 'Galaxy')
          .replace(/pixel/gi, 'Pixel')
          .replace(/samsung/gi, 'Samsung')
          .replace(/xiaomi/gi, 'Xiaomi')
          .replace(/redmi/gi, 'Redmi')
          .replace(/oneplus/gi, 'OnePlus')
          .replace(/moto/gi, 'Moto');
        foundModels.add(normalized);
      });
    }
  }

  return Array.from(foundModels);
}

/**
 * Get all models the customer asked about - from customerInfo OR from messages
 */
function getAllMentionedModels(conversation: ChatConversation): string[] {
  const modelsFromInfo = conversation.customerInfo?.interestedInModels || [];
  const modelsFromMessages = extractModelsFromMessages(conversation);

  // Combine and deduplicate
  const allModels = new Set([...modelsFromInfo, ...modelsFromMessages]);
  return Array.from(allModels);
}

// Helper to format date in Spanish
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper to check if customer wants to buy
function wantsToBuy(conversation: ChatConversation): boolean {
  const urgency = conversation.customerInfo?.urgency?.toLowerCase();
  const intent = conversation.customerInfo?.purchaseIntent?.toLowerCase();

  return (
    urgency === 'immediate' ||
    urgency === 'high' ||
    urgency === 'alta' ||
    intent === 'ready_to_buy' ||
    intent === 'listo_para_comprar'
  );
}

// Common email styles
const styles = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .info-row { display: flex; margin-bottom: 8px; }
    .info-label { font-weight: 600; color: #374151; min-width: 140px; }
    .info-value { color: #6b7280; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .models-list { list-style: none; padding: 0; margin: 0; }
    .models-list li { background: #f3f4f6; padding: 8px 12px; margin-bottom: 5px; border-radius: 6px; font-size: 14px; }
    .chat-message { padding: 10px 15px; margin-bottom: 8px; border-radius: 10px; max-width: 85%; }
    .chat-user { background: #3b82f6; color: white; margin-left: auto; }
    .chat-assistant { background: #f3f4f6; color: #333; }
    .chat-role { font-size: 11px; font-weight: 600; margin-bottom: 4px; opacity: 0.7; }
    .footer { background: #f9fafb; padding: 20px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; text-align: center; }
    .footer a { color: #667eea; text-decoration: none; font-weight: 600; }
    .metadata { font-size: 12px; color: #9ca3af; }
    .metadata-item { margin-bottom: 4px; }
  </style>
`;

/**
 * Generate HTML email for new lead notification
 * Shows: modelo, metadata, resumen en bullets
 * (This is now rarely used since emails are sent when chat ends)
 */
export function generateNewLeadEmailHtml(conversation: ChatConversation): string {
  // Use the same format as conversation ended
  return generateConversationEndedEmailHtml(conversation);
}

/**
 * Generate HTML email for conversation ended notification
 * Shows: modelo, metadata, resumen en bullets
 * Purchase details highlighted if customer wants to buy
 */
export function generateConversationEndedEmailHtml(conversation: ChatConversation): string {
  const { customerInfo, metadata, messages, createdAt, updatedAt, status } = conversation;
  const name = customerInfo?.name || 'Cliente';
  const showPurchaseDetails = wantsToBuy(conversation);

  // Calculate session duration
  const durationMins = Math.round((new Date(updatedAt).getTime() - new Date(createdAt).getTime()) / 60000);
  const userMessages = (messages || []).filter(m => m.role === 'user').length;

  // Get ALL models mentioned - from customerInfo AND from message extraction
  const allModels = getAllMentionedModels(conversation);
  const models = allModels.length > 0 ? allModels.join(', ') : 'No especificado';

  // Build location string
  const location = [metadata?.city, metadata?.country].filter(Boolean).join(', ');

  // Build summary bullets
  const summaryBullets: string[] = [];
  if (customerInfo?.name) summaryBullets.push(`👤 ${customerInfo.name}`);
  if (customerInfo?.phone) summaryBullets.push(`📱 Tel: ${customerInfo.phone}`);
  if (customerInfo?.email) summaryBullets.push(`📧 ${customerInfo.email}`);
  // Always show models if any were mentioned (from customerInfo OR extracted from messages)
  if (allModels.length > 0) summaryBullets.push(`📦 Modelo: ${models}`);
  if (customerInfo?.budget) summaryBullets.push(`💰 Presupuesto: $${customerInfo.budget}`);
  if (customerInfo?.urgency) summaryBullets.push(`⏰ Urgencia: ${customerInfo.urgency}`);
  if (customerInfo?.primaryUse) summaryBullets.push(`🎯 Uso: ${customerInfo.primaryUse}`);
  // Always show location if available
  if (location) summaryBullets.push(`📍 Ubicación: ${location}`);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${styles}
</head>
<body>
  <div class="container">
    <div class="header" ${showPurchaseDetails ? 'style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);"' : 'style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);"'}>
      <h1>${showPurchaseDetails ? '🚨 LLAMAR - Quiere Comprar' : 'Chat Finalizado'}</h1>
      <p>${name}${location ? ` · ${location}` : ''}${models !== 'No especificado' ? ` · ${models}` : ''}</p>
    </div>

    <div class="content">
      <!-- Quick Summary in Bullets -->
      <div class="section">
        <div class="section-title">📋 Resumen</div>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${summaryBullets.map(b => `<li style="padding: 4px 0; font-size: 14px;">${b}</li>`).join('')}
          <li style="padding: 4px 0; font-size: 14px; color: #6b7280;">💬 ${userMessages} mensajes · ${durationMins} min · ${status === 'abandoned' ? 'Abandonado' : 'Completado'}</li>
        </ul>
      </div>

      <!-- Purchase Alert - Only if wants to buy -->
      ${showPurchaseDetails ? `
      <div class="section" style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
        <p style="margin: 0; color: #dc2626; font-weight: 600;">⚡ Cliente listo para comprar - Llamar ASAP</p>
      </div>
      ` : ''}

      <!-- Metadata -->
      <div class="section">
        <div class="section-title">🔍 Metadata</div>
        <div class="metadata">
          <div class="metadata-item">📅 ${formatDate(createdAt)}</div>
          <div class="metadata-item">💻 ${metadata?.deviceType || '-'} · ${metadata?.browser || '-'} · ${metadata?.os || '-'}</div>
          ${(metadata?.city || metadata?.country) ? `<div class="metadata-item">📍 ${[metadata.city, metadata.country].filter(Boolean).join(', ')}</div>` : ''}
          ${metadata?.pageUrl ? `<div class="metadata-item">🔗 ${metadata.pageUrl}</div>` : ''}
        </div>
      </div>
    </div>

    <div class="footer">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://tecno-express.vercel.app'}/admin/chat-analytics">Ver Chat Completo</a>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Generate HTML email for manual admin notification
 * Shows: modelo, metadata, resumen en bullets
 */
export function generateManualNotificationEmailHtml(conversation: ChatConversation): string {
  const { customerInfo, metadata, messages, createdAt, updatedAt } = conversation;
  const name = customerInfo?.name || 'Cliente';
  const showPurchaseDetails = wantsToBuy(conversation);

  // Calculate session duration
  const durationMins = Math.round((new Date(updatedAt).getTime() - new Date(createdAt).getTime()) / 60000);
  const userMessages = (messages || []).filter(m => m.role === 'user').length;

  // Get ALL models mentioned - from customerInfo AND from message extraction
  const allModels = getAllMentionedModels(conversation);
  const models = allModels.length > 0 ? allModels.join(', ') : 'No especificado';

  // Build location string
  const location = [metadata?.city, metadata?.country].filter(Boolean).join(', ');

  // Build summary bullets
  const summaryBullets: string[] = [];
  if (customerInfo?.name) summaryBullets.push(`👤 ${customerInfo.name}`);
  if (customerInfo?.phone) summaryBullets.push(`📱 Tel: ${customerInfo.phone}`);
  if (customerInfo?.email) summaryBullets.push(`📧 ${customerInfo.email}`);
  // Always show models if any were mentioned (from customerInfo OR extracted from messages)
  if (allModels.length > 0) summaryBullets.push(`📦 Modelo: ${models}`);
  if (customerInfo?.budget) summaryBullets.push(`💰 Presupuesto: $${customerInfo.budget}`);
  if (customerInfo?.urgency) summaryBullets.push(`⏰ Urgencia: ${customerInfo.urgency}`);
  // Always show location if available
  if (location) summaryBullets.push(`📍 Ubicación: ${location}`);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${styles}
</head>
<body>
  <div class="container">
    <div class="header" ${showPurchaseDetails ? 'style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);"' : 'style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);"'}>
      <h1>${showPurchaseDetails ? '🚨 LLAMAR - Quiere Comprar' : 'Resumen de Chat'}</h1>
      <p>${name}${location ? ` · ${location}` : ''}${models !== 'No especificado' ? ` · ${models}` : ''}</p>
    </div>

    <div class="content">
      <!-- Quick Summary in Bullets -->
      <div class="section">
        <div class="section-title">📋 Resumen</div>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${summaryBullets.map(b => `<li style="padding: 4px 0; font-size: 14px;">${b}</li>`).join('')}
          <li style="padding: 4px 0; font-size: 14px; color: #6b7280;">💬 ${userMessages} mensajes · ${durationMins} min</li>
        </ul>
      </div>

      <!-- Purchase Alert - Only if wants to buy -->
      ${showPurchaseDetails ? `
      <div class="section" style="background: #fef2f2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626;">
        <p style="margin: 0; color: #dc2626; font-weight: 600;">⚡ Cliente listo para comprar - Llamar ASAP</p>
      </div>
      ` : ''}

      <!-- Metadata -->
      <div class="section">
        <div class="section-title">🔍 Metadata</div>
        <div class="metadata">
          <div class="metadata-item">📅 ${formatDate(createdAt)}</div>
          <div class="metadata-item">💻 ${metadata?.deviceType || '-'} · ${metadata?.browser || '-'} · ${metadata?.os || '-'}</div>
          ${(metadata?.city || metadata?.country) ? `<div class="metadata-item">📍 ${[metadata.city, metadata.country].filter(Boolean).join(', ')}</div>` : ''}
        </div>
      </div>
    </div>

    <div class="footer">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://tecno-express.vercel.app'}/admin/chat-analytics">Ver Chat</a>
    </div>
  </div>
</body>
</html>
`;
}
