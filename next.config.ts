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
    // Admin Auth
    SESSION_SECRET: process.env.SESSION_SECRET,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

    // DynamoDB
    DYNAMODB_REGION: process.env.DYNAMODB_REGION,
    DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID,
    DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY,
    DYNAMODB_PRODUCTS_TABLE: process.env.DYNAMODB_PRODUCTS_TABLE,
    DYNAMODB_CAROUSEL_TABLE: process.env.DYNAMODB_CAROUSEL_TABLE,
    DYNAMODB_ACTIVITY_LOG_TABLE: process.env.DYNAMODB_ACTIVITY_LOG_TABLE,
    DYNAMODB_CATEGORIES_TABLE: process.env.DYNAMODB_CATEGORIES_TABLE,
    DYNAMODB_CHAT_CONVERSATIONS_TABLE: process.env.DYNAMODB_CHAT_CONVERSATIONS_TABLE,
    DYNAMODB_PRODUCT_INQUIRIES_TABLE: process.env.DYNAMODB_PRODUCT_INQUIRIES_TABLE,
    DYNAMODB_POPULAR_MODELS_TABLE: process.env.DYNAMODB_POPULAR_MODELS_TABLE,
    DYNAMODB_RESERVATIONS_TABLE: process.env.DYNAMODB_RESERVATIONS_TABLE,

    // OpenAI Chatbot
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    // Email Notifications (Gmail)
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,

    // Public URLs
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default nextConfig;
