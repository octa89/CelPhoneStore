import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Lazy initialization to avoid errors during build time
let _dynamoDb: DynamoDBDocumentClient | null = null;

function getDynamoDBClient(): DynamoDBDocumentClient {
  if (_dynamoDb) {
    return _dynamoDb;
  }

  // Validate required environment variables
  // Note: Using DYNAMODB_ prefix instead of AWS_ to avoid conflicts with AWS Amplify reserved variables
  if (!process.env.DYNAMODB_REGION) {
    throw new Error("DYNAMODB_REGION must be set in environment variables");
  }

  if (!process.env.DYNAMODB_ACCESS_KEY_ID) {
    throw new Error("DYNAMODB_ACCESS_KEY_ID must be set in environment variables");
  }

  if (!process.env.DYNAMODB_SECRET_ACCESS_KEY) {
    throw new Error("DYNAMODB_SECRET_ACCESS_KEY must be set in environment variables");
  }

  // Create DynamoDB client
  const client = new DynamoDBClient({
    region: process.env.DYNAMODB_REGION,
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
      secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
    },
  });

  // Create Document client for easier data manipulation
  _dynamoDb = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true, // Remove undefined values
      convertEmptyValues: false,    // Don't convert empty strings to null
    },
  });

  return _dynamoDb;
}

// Export getter function instead of direct client
export const dynamoDb = new Proxy({} as DynamoDBDocumentClient, {
  get(_target, prop) {
    const client = getDynamoDBClient();
    const value = client[prop as keyof DynamoDBDocumentClient];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

// Table names from environment variables
export const TABLES = {
  PRODUCTS: process.env.DYNAMODB_PRODUCTS_TABLE || "tecnoexpress-products",
  CAROUSEL: process.env.DYNAMODB_CAROUSEL_TABLE || "tecnoexpress-carousel",
  ACTIVITY_LOG: process.env.DYNAMODB_ACTIVITY_LOG_TABLE || "tecnoexpress-activity-log",
  CATEGORIES: process.env.DYNAMODB_CATEGORIES_TABLE || "tecnoexpress-categories",
  BRANDS: process.env.DYNAMODB_BRANDS_TABLE || "tecnoexpress-brands",
  TAGS: process.env.DYNAMODB_TAGS_TABLE || "tecnoexpress-tags",
  CHAT_CONVERSATIONS: process.env.DYNAMODB_CHAT_CONVERSATIONS_TABLE || "tecnoexpress-chat-conversations",
  PRODUCT_INQUIRIES: process.env.DYNAMODB_PRODUCT_INQUIRIES_TABLE || "tecnoexpress-product-inquiries",
  POPULAR_MODELS: process.env.DYNAMODB_POPULAR_MODELS_TABLE || "tecnoexpress-popular-models",
  RESERVATIONS: process.env.DYNAMODB_RESERVATIONS_TABLE || "tecnoexpress-reservations",
} as const;

// Helper to log DynamoDB operations in development
export function logDynamoOperation(operation: string, table: string, details?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[DynamoDB] ${operation} on ${table}`, details || "");
  }
}
