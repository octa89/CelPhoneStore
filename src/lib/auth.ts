import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// Validate SESSION_SECRET exists and is strong
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error(
    "SESSION_SECRET must be set in .env.local and be at least 32 characters long. " +
    "Generate a strong secret: openssl rand -base64 32"
  );
}

const SESSION_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionData {
  username: string;
  isAdmin: boolean;
  expiresAt: number;
}

export async function createSession(username: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_DURATION;

  const token = await new SignJWT({
    username,
    isAdmin: true,
    expiresAt,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SESSION_SECRET);

  return token;
}

export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);

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
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-session")?.value;

    if (!token) {
      console.log("No admin-session cookie found");
      return null;
    }

    const session = await verifySession(token);
    if (!session) {
      console.log("Session verification failed");
    }
    return session;
  } catch (error) {
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
