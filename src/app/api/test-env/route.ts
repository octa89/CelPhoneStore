import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasSessionSecret: !!process.env.SESSION_SECRET,
    sessionSecretLength: process.env.SESSION_SECRET?.length || 0,
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasDynamoRegion: !!process.env.DYNAMODB_REGION,
    hasDynamoKey: !!process.env.DYNAMODB_ACCESS_KEY_ID,
    hasDynamoSecret: !!process.env.DYNAMODB_SECRET_ACCESS_KEY,
    nodeEnv: process.env.NODE_ENV,
  });
}
