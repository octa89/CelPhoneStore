import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getConversation } from "@/lib/dynamodb-service";
import {
  sendManualNotification,
  isEmailConfigured,
  verifyEmailConfiguration,
} from "@/lib/email-service";

/**
 * POST /api/admin/send-email
 * Send email notification for a conversation (admin only)
 */
export async function POST(request: Request) {
  // Validate admin session
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD." },
        { status: 503 }
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

    // Send the email
    const result = await sendManualNotification(conversation);

    if (result.success) {
      console.log(`[Admin] Email sent for conversation ${conversationId}`);
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
      });
    } else {
      console.error(`[Admin] Failed to send email for conversation ${conversationId}:`, result.error);
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Admin] Error sending email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/send-email
 * Check email configuration status (admin only)
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await verifyEmailConfiguration();
    return NextResponse.json(status);
  } catch (error) {
    console.error("[Admin] Error checking email configuration:", error);
    return NextResponse.json(
      { configured: false, verified: false, error: "Failed to check configuration" },
      { status: 500 }
    );
  }
}
