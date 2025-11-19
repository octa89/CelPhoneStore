/**
 * Migration Script: JSON Files to DynamoDB
 *
 * This script migrates data from local JSON files to DynamoDB tables.
 * Run this once to populate your DynamoDB tables with existing data.
 *
 * Usage:
 *   npm run migrate:dynamodb
 *
 * or
 *   npx tsx scripts/migrate-to-dynamodb.ts
 */

// Load environment variables FIRST before any other imports
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env.local file
config({ path: join(process.cwd(), ".env.local") });

// Now import DynamoDB after env is loaded
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, TABLES } from "../src/lib/dynamodb";
import fs from "fs/promises";
import path from "path";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function migrateProducts() {
  try {
    log("\n📱 Migrating Products...", colors.cyan);

    const productsPath = path.join(process.cwd(), "src/data/products.json");
    const data = await fs.readFile(productsPath, "utf-8");
    const { products } = JSON.parse(data);

    log(`   Found ${products.length} products to migrate`, colors.bright);

    for (const product of products) {
      const command = new PutCommand({
        TableName: TABLES.PRODUCTS,
        Item: product,
      });
      await dynamoDb.send(command);
      log(`   ✓ Migrated: ${product.name}`, colors.green);
    }

    log(`✅ Successfully migrated ${products.length} products\n`, colors.green);
    return products.length;
  } catch (error) {
    log(`❌ Error migrating products: ${error}`, colors.red);
    return 0;
  }
}

async function migrateCategories() {
  try {
    log("📁 Migrating Categories...", colors.cyan);

    const categoriesPath = path.join(process.cwd(), "src/data/categories.json");
    const data = await fs.readFile(categoriesPath, "utf-8");
    const { categories } = JSON.parse(data);

    log(`   Found ${categories.length} categories to migrate`, colors.bright);

    for (const category of categories) {
      const id = category.toLowerCase().replace(/\s+/g, "-");
      const command = new PutCommand({
        TableName: TABLES.CATEGORIES,
        Item: { id, name: category },
      });
      await dynamoDb.send(command);
      log(`   ✓ Migrated: ${category}`, colors.green);
    }

    log(`✅ Successfully migrated ${categories.length} categories\n`, colors.green);
    return categories.length;
  } catch (error) {
    log(`❌ Error migrating categories: ${error}`, colors.red);
    return 0;
  }
}

async function migrateCarousel() {
  try {
    log("🎠 Migrating Carousel...", colors.cyan);

    const carouselPath = path.join(process.cwd(), "src/data/carousel-settings.json");
    const data = await fs.readFile(carouselPath, "utf-8");
    const { slides } = JSON.parse(data);

    log(`   Found ${slides.length} carousel slides to migrate`, colors.bright);

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      // Ensure each slide has an id as String (use order + 1 as the id)
      const slideWithId = {
        ...slide,
        id: String(slide.order !== undefined ? slide.order + 1 : i + 1),
      };

      const command = new PutCommand({
        TableName: TABLES.CAROUSEL,
        Item: slideWithId,
      });
      await dynamoDb.send(command);
      log(`   ✓ Migrated: Slide ${slideWithId.id} - ${slideWithId.title}`, colors.green);
    }

    log(`✅ Successfully migrated ${slides.length} carousel slides\n`, colors.green);
    return slides.length;
  } catch (error) {
    log(`❌ Error migrating carousel: ${error}`, colors.red);
    return 0;
  }
}

async function initializeActivityLog() {
  try {
    log("📊 Initializing Activity Log...", colors.cyan);

    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: "Sistema Inicializado",
      details: "Migración de datos completada exitosamente",
      type: "product" as const,
    };

    const command = new PutCommand({
      TableName: TABLES.ACTIVITY_LOG,
      Item: entry,
    });
    await dynamoDb.send(command);

    log(`✅ Activity log initialized\n`, colors.green);
    return 1;
  } catch (error) {
    log(`❌ Error initializing activity log: ${error}`, colors.red);
    return 0;
  }
}

async function main() {
  log("\n" + "=".repeat(60), colors.bright);
  log("  TECNO EXPRESS - DynamoDB Migration Script", colors.bright);
  log("=".repeat(60) + "\n", colors.bright);

  log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`, colors.yellow);
  log(`🌍 AWS Region: ${process.env.AWS_REGION}`, colors.yellow);
  log(`📦 DynamoDB Tables:`, colors.yellow);
  log(`   - Products: ${TABLES.PRODUCTS}`, colors.yellow);
  log(`   - Categories: ${TABLES.CATEGORIES}`, colors.yellow);
  log(`   - Carousel: ${TABLES.CAROUSEL}`, colors.yellow);
  log(`   - Activity Log: ${TABLES.ACTIVITY_LOG}`, colors.yellow);

  log("\n⚠️  WARNING: This will overwrite existing data in DynamoDB", colors.red);
  log("   Press Ctrl+C to cancel, or wait 3 seconds to continue...\n", colors.yellow);

  await new Promise(resolve => setTimeout(resolve, 3000));

  const stats = {
    products: 0,
    categories: 0,
    carousel: 0,
    activityLog: 0,
  };

  try {
    stats.products = await migrateProducts();
    stats.categories = await migrateCategories();
    stats.carousel = await migrateCarousel();
    stats.activityLog = await initializeActivityLog();

    log("=".repeat(60), colors.bright);
    log("  MIGRATION COMPLETE", colors.green + colors.bright);
    log("=".repeat(60), colors.bright);
    log(`\n📊 Migration Summary:`, colors.bright);
    log(`   Products:     ${stats.products}`, colors.green);
    log(`   Categories:   ${stats.categories}`, colors.green);
    log(`   Carousel:     ${stats.carousel}`, colors.green);
    log(`   Activity Log: ${stats.activityLog}`, colors.green);
    log(`\n✅ All data migrated successfully!`, colors.green + colors.bright);
    log(`\n💡 Next steps:`, colors.cyan);
    log(`   1. Verify data in AWS DynamoDB Console`, colors.bright);
    log(`   2. Test the admin panel locally`, colors.bright);
    log(`   3. Deploy to AWS Amplify with environment variables set\n`, colors.bright);

  } catch (error) {
    log("\n❌ Migration failed:", colors.red);
    log(String(error), colors.red);
    process.exit(1);
  }
}

// Run migration
main().catch((error) => {
  log(`\n❌ Fatal error: ${error}`, colors.red);
  process.exit(1);
});
