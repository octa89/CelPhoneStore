import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, createSession, setSessionCookie } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Get IP address for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
                request.headers.get("x-real-ip") ||
                "unknown";

    const rateLimitKey = `login:${ip}`;

    // Check rate limit (5 attempts per 15 minutes)
    const rateLimit = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      const resetInMinutes = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${resetInMinutes} minutes.`,
          resetAt: rateLimit.resetAt
        },
        { status: 429 }
      );
    }

    // Validate credentials
    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
          attemptsRemaining: rateLimit.remaining
        },
        { status: 401 }
      );
    }

    // Successful login - reset rate limit
    resetRateLimit(rateLimitKey);

    const token = await createSession(username);
    await setSessionCookie(token);

    return NextResponse.json({ success: true, username });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
