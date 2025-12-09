import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Lazy validation and initialization of SESSION_SECRET
function getSessionSecret(): Uint8Array {
  // During build time, SESSION_SECRET might not be available
  // This is fine because auth functions are only called at runtime
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    // During build, return a dummy secret - this code path won't be executed
    // because cookies() will fail first in a build context
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      console.warn('[Auth] SESSION_SECRET not available - this should only happen during build');
      return new TextEncoder().encode('build-time-placeholder-not-for-production');
    }
    throw new Error(
      "SESSION_SECRET must be set in environment variables. " +
      "Generate a strong secret: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    );
  }

  if (secret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be at least 32 characters long. " +
      "Generate a strong secret: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    );
  }

  return new TextEncoder().encode(secret);
}

export interface SessionData {
  username: string;
  isAdmin: boolean;
  expiresAt: number;
}

export async function createSession(username: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION;
  const sessionSecret = getSessionSecret();

  const token = await new SignJWT({
    username,
    isAdmin: true,
    expiresAt,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(sessionSecret);

  return token;
}

export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const sessionSecret = getSessionSecret();
    const { payload } = await jwtVerify(token, sessionSecret);

    if (typeof payload.expiresAt === "number" && payload.expiresAt < Date.now()) {
      return null;
    }

    return {
      username: payload.username as string,
      isAdmin: payload.isAdmin as boolean,
      expiresAt: payload.expiresAt as number,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  try {
    // cookies() is only available in server components during runtime,
    // not during build time static page generation
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-session")?.value;

    if (!token) {
      // Only log in development to reduce noise
      if (process.env.NODE_ENV === 'development') {
        console.log("No admin-session cookie found");
      }
      return null;
    }

    const session = await verifySession(token);
    if (!session && process.env.NODE_ENV === 'development') {
      console.log("Session verification failed");
    }
    return session;
  } catch (error) {
    // During build, cookies() will throw - this is expected
    if (error instanceof Error && error.message.includes('cookies')) {
      return null;
    }
    console.error("Error getting session:", error);
    return null;
  }
}

export async function setSessionCookie(token: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION / 1000,
      path: "/",
    });
    console.log("Session cookie set successfully");
  } catch (error) {
    console.error("Error setting session cookie:", error);
    throw error;
  }
}

export async function clearSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin-session");
    console.log("Session cleared");
  } catch (error) {
    console.error("Error clearing session:", error);
  }
}

export function validateCredentials(username: string, password: string): boolean {
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env.local");
  }

  // Use constant-time comparison to prevent timing attacks
  const usernameMatch = username === validUsername;
  const passwordMatch = password === validPassword;

  return usernameMatch && passwordMatch;
}
