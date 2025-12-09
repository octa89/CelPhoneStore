import { NextResponse } from "next/server";
import {
  getConversation,
  updateConversationStatus,
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
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, reason } = body;

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

    console.log(`[Chat] Conversation ${conversationId} ended - reason: ${reason}, status: ${newStatus}`);

    // Send email notification if configured
    // ALWAYS send email when there's at least one user message (real interaction)
    if (isEmailConfigured()) {
      // Check if there's at least one user message (real interaction, not just bot welcome)
      const hasUserMessage = conversation.messages.some(msg => msg.role === 'user');

      if (hasUserMessage) {
        // Get fresh conversation with updated status
        const updatedConversation = await getConversation(conversationId);
        if (updatedConversation) {
          console.log(`[Chat] Sending end-of-conversation email for ${conversationId}`);
          sendConversationEndedNotification(updatedConversation).catch((err) => {
            console.error("[Email] Failed to send conversation ended notification:", err);
          });
        }
      } else {
        console.log(`[Chat] Skipping email - no user messages (only welcome message)`);
      }
    } else {
      console.log(`[Chat] Email not configured - skipping notification`);
    }

    return NextResponse.json({
      success: true,
      message: "Conversation ended successfully",
      status: newStatus,
    });
  } catch (error) {
    console.error("[Chat] Error ending conversation:", error);
    return NextResponse.json(
      { error: "Failed to end conversation" },
      { status: 500 }
    );
  }
}
