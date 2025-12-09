import { NextResponse } from "next/server";
import {
  isEmailConfigured,
  verifyEmailConfiguration,
} from "@/lib/email-service";

/**
 * GET /api/test-email
 * Test email configuration status (for debugging)
 * Returns configuration status without sending an actual email
 */
export async function GET() {
  try {
    const configured = isEmailConfigured();
    const hasGmailUser = !!process.env.GMAIL_USER;
    const hasGmailPassword = !!process.env.GMAIL_APP_PASSWORD;
    const hasAdminEmail = !!process.env.ADMIN_NOTIFICATION_EMAIL;

    // Only verify connection if configured (avoid exposing errors publicly)
    let verificationResult = null;
    if (configured) {
      verificationResult = await verifyEmailConfiguration();
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      emailConfigured: configured,
      environment: {
        GMAIL_USER: hasGmailUser ? "✅ SET" : "❌ NOT SET",
        GMAIL_APP_PASSWORD: hasGmailPassword ? "✅ SET" : "❌ NOT SET",
        ADMIN_NOTIFICATION_EMAIL: hasAdminEmail
          ? `✅ SET (${process.env.ADMIN_NOTIFICATION_EMAIL})`
          : "❌ NOT SET (will use default)",
      },
      verification: verificationResult
        ? {
            configured: verificationResult.configured,
            verified: verificationResult.verified,
            error: verificationResult.error || null,
          }
        : null,
      message: configured
        ? verificationResult?.verified
          ? "✅ Email service is fully configured and verified!"
          : "⚠️ Email is configured but verification failed"
        : "❌ Email service is NOT configured. Set GMAIL_USER and GMAIL_APP_PASSWORD.",
    });
  } catch (error) {
    console.error("[Test Email] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to check email configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
