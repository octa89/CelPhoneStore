import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
    ],
  },
  // Explicitly expose environment variables for AWS Amplify
  // AWS Amplify doesn't automatically inject env vars into Next.js runtime
  env: {
    SESSION_SECRET: process.env.SESSION_SECRET,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    DYNAMODB_REGION: process.env.DYNAMODB_REGION,
    DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID,
    DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY,
    DYNAMODB_PRODUCTS_TABLE: process.env.DYNAMODB_PRODUCTS_TABLE,
    DYNAMODB_CAROUSEL_TABLE: process.env.DYNAMODB_CAROUSEL_TABLE,
    DYNAMODB_ACTIVITY_LOG_TABLE: process.env.DYNAMODB_ACTIVITY_LOG_TABLE,
    DYNAMODB_CATEGORIES_TABLE: process.env.DYNAMODB_CATEGORIES_TABLE,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default nextConfig;
