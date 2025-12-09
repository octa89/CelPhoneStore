import { NextResponse } from "next/server";
import {
  getConversation,
  updateConversationStatus,
  updateConversationEmailStatus,
} from "@/lib/dynamodb-service";
import {
  sendConversationEndedNotification,
  isEmailConfigured,
} from "@/lib/email-service";

/**
 * POST /api/chat/end
 * End a conversation and send email notification
 * Called when:
 * - User closes the chat widget
 * - Inactivity timeout occurs
 * - Page unload (via sendBeacon - sends as text/plain)
 */
export async function POST(request: Request) {
  console.log(`[Chat End] ========== REQUEST RECEIVED ==========`);

  try {
    // Handle both JSON and text/plain content types
    // sendBeacon sends as text/plain, but regular fetch sends as application/json
    let body: { conversationId?: string; reason?: string };
    const contentType = request.headers.get('content-type') || '';
    console.log(`[Chat End] Content-Type: ${contentType}`);

    if (contentType.includes('application/json')) {
      body = await request.json();
      console.log(`[Chat End] Parsed as JSON`);
    } else {
      // sendBeacon sends as text/plain, parse it as JSON
      const text = await request.text();
      console.log(`[Chat End] Raw text body: ${text}`);
      try {
        body = JSON.parse(text);
        console.log(`[Chat End] Parsed text as JSON`);
      } catch {
        console.error("[Chat End] Failed to parse request body as JSON");
        return NextResponse.json(
          { error: "Invalid request body" },
          { status: 400 }
        );
      }
    }

    const { conversationId, reason } = body;
    console.log(`[Chat End] conversationId: ${conversationId}, reason: ${reason}`);

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    // Get the conversation
    const conversation = await getConversation(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Only process if conversation is still active
    if (conversation.status !== "active") {
      return NextResponse.json({
        success: true,
        message: "Conversation already ended",
        alreadyEnded: true,
      });
    }

    // Update conversation status
    const newStatus = reason === "timeout" ? "abandoned" : "completed";
    await updateConversationStatus(conversationId, newStatus);

    // Update local object to avoid re-fetching
    conversation.status = newStatus;
    conversation.updatedAt = new Date().toISOString();

    console.log(`[Chat] Conversation ${conversationId} ended - reason: ${reason}, status: ${newStatus}`);

    // ======== CHECKLIST DE CAMPOS CAPTURADOS ========
    // Este log ayuda a verificar qué información se recopiló antes de enviar el email
    const customerInfo = conversation.customerInfo;
    const metadata = conversation.metadata;
    const capturedFields = {
      // Información de contacto
      name: !!customerInfo?.name,
      phone: !!customerInfo?.phone,
      email: !!customerInfo?.email,
      // Interés en productos
      interestedInBrand: !!customerInfo?.interestedInBrand,
      interestedInModels: (customerInfo?.interestedInModels?.length || 0) > 0,
      // Intención de compra (CRÍTICO)
      purchaseIntent: customerInfo?.purchaseIntent || 'NOT_SET',
      urgency: customerInfo?.urgency || 'NOT_SET',
      // Presupuesto
      budget: !!customerInfo?.budget,
      priceRange: !!customerInfo?.priceRange,
      // Información adicional
      primaryUse: !!customerInfo?.primaryUse,
      currentPhone: !!customerInfo?.currentPhone,
      preferredFeatures: (customerInfo?.preferredFeatures?.length || 0) > 0,
      // Metadata de sesión
      deviceType: metadata?.deviceType || 'unknown',
      browser: metadata?.browser || 'unknown',
      os: metadata?.os || 'unknown',
      country: metadata?.country || 'unknown',
      city: metadata?.city || 'unknown',
    };
    console.log(`[Chat] ======== CHECKLIST DE CAMPOS CAPTURADOS ========`);
    console.log(`[Chat] Conversation ID: ${conversationId}`);
    console.log(`[Chat] Campos:`, JSON.stringify(capturedFields, null, 2));
    console.log(`[Chat] ================================================`);

    // Track email sending result
    let emailSent = false;
    let emailError: string | undefined;

    // Send email notification if configured
    // ALWAYS send email when there's at least one user message (real interaction)
    if (isEmailConfigured()) {
      // Check if there's at least one user message (real interaction, not just bot welcome)
      const hasUserMessage = conversation.messages.some(msg => msg.role === 'user');

      if (hasUserMessage) {
        console.log(`[Chat] Sending end-of-conversation email for ${conversationId}`);

        // Await email sending instead of fire-and-forget
        const result = await sendConversationEndedNotification(conversation);
        emailSent = result.success;
        emailError = result.error;

        if (emailSent) {
          console.log(`[Chat] Email sent successfully for ${conversationId}`);
        } else {
          console.error(`[Chat] Email failed for ${conversationId}:`, emailError);
        }
      } else {
        console.log(`[Chat] Skipping email - no user messages (only welcome message)`);
        // No email needed, but not an error
        emailSent = false;
        emailError = undefined;
      }
    } else {
      console.log(`[Chat] Email not configured - skipping notification`);
      emailError = "Email not configured";
    }

    // Update conversation with email status (only if there was a user message)
    const hasUserMessage = conversation.messages.some(msg => msg.role === 'user');
    if (hasUserMessage) {
      await updateConversationEmailStatus(conversationId, emailSent, emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Conversation ended successfully",
      status: newStatus,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error("[Chat] Error ending conversation:", error);
    return NextResponse.json(
      { error: "Failed to end conversation" },
      { status: 500 }
    );
  }
}
