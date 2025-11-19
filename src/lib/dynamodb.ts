import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Validate required environment variables
if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION must be set in environment variables");
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("AWS_ACCESS_KEY_ID must be set in environment variables");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS_SECRET_ACCESS_KEY must be set in environment variables");
}

// Create DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Create Document client for easier data manipulation
export const dynamoDb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true, // Remove undefined values
    convertEmptyValues: false,    // Don't convert empty strings to null
  },
});

// Table names from environment variables
export const TABLES = {
  PRODUCTS: process.env.DYNAMODB_PRODUCTS_TABLE || "tecnoexpress-products",
  CAROUSEL: process.env.DYNAMODB_CAROUSEL_TABLE || "tecnoexpress-carousel",
  ACTIVITY_LOG: process.env.DYNAMODB_ACTIVITY_LOG_TABLE || "tecnoexpress-activity-log",
  CATEGORIES: process.env.DYNAMODB_CATEGORIES_TABLE || "tecnoexpress-categories",
  BRANDS: process.env.DYNAMODB_BRANDS_TABLE || "tecnoexpress-brands",
  TAGS: process.env.DYNAMODB_TAGS_TABLE || "tecnoexpress-tags",
} as const;

// Helper to log DynamoDB operations in development
export function logDynamoOperation(operation: string, table: string, details?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[DynamoDB] ${operation} on ${table}`, details || "");
  }
}
