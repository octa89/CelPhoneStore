import { config } from "dotenv";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";

config({ path: ".env.local" });

if (!process.env.DYNAMODB_REGION || !process.env.DYNAMODB_ACCESS_KEY_ID || !process.env.DYNAMODB_SECRET_ACCESS_KEY) {
  console.error("ERROR: Missing required environment variables.");
  console.error("Please ensure DYNAMODB_REGION, DYNAMODB_ACCESS_KEY_ID, and DYNAMODB_SECRET_ACCESS_KEY are set in .env.local");
  process.exit(1);
}

const client = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION,
  credentials: {
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
    secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
  },
});

async function createChatTables() {
  console.log("Creating DynamoDB tables for chat functionality...\n");

  const tables = [
    {
      TableName: "tecnoexpress-chat-conversations",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    },
    {
      TableName: "tecnoexpress-product-inquiries",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    },
    {
      TableName: "tecnoexpress-popular-models",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    },
    {
      TableName: "tecnoexpress-reservations",
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      BillingMode: "PAY_PER_REQUEST",
    },
  ];

  // Check existing tables
  const listCommand = new ListTablesCommand({});
  const existingTables = await client.send(listCommand);
  const existingTableNames = existingTables.TableNames || [];

  for (const table of tables) {
    if (existingTableNames.includes(table.TableName)) {
      console.log(`✓ Table ${table.TableName} already exists`);
      continue;
    }

    try {
      const command = new CreateTableCommand(table);
      await client.send(command);
      console.log(`✓ Created table: ${table.TableName}`);
    } catch (error) {
      console.error(`✗ Error creating table ${table.TableName}:`, error);
    }
  }

  console.log("\nAll chat tables created successfully!");
  console.log("\nAdd these to your .env.local:");
  console.log("DYNAMODB_CHAT_CONVERSATIONS_TABLE=tecnoexpress-chat-conversations");
  console.log("DYNAMODB_PRODUCT_INQUIRIES_TABLE=tecnoexpress-product-inquiries");
  console.log("DYNAMODB_POPULAR_MODELS_TABLE=tecnoexpress-popular-models");
  console.log("OPENAI_API_KEY=your-openai-api-key-here");
}

createChatTables().catch(console.error);
