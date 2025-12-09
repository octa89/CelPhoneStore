import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { dynamoDb, TABLES, logDynamoOperation } from "./dynamodb";
import type { Product, ChatConversation, ChatMessage, ProductInquiry, PopularModelRequest, ProductReservation, SessionMetadata } from "./types";

// ==================== PRODUCTS ====================

export async function getProducts(): Promise<Product[]> {
  try {
    logDynamoOperation("SCAN", TABLES.PRODUCTS);

    const command = new ScanCommand({
      TableName: TABLES.PRODUCTS,
    });

    const response = await dynamoDb.send(command);
    const products = (response.Items || []) as Product[];

    // Sort by displayOrder if it exists, otherwise by name
    return products.sort((a, b) => {
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error("Error getting products from DynamoDB:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    logDynamoOperation("GET", TABLES.PRODUCTS, { id });

    const command = new GetCommand({
      TableName: TABLES.PRODUCTS,
      Key: { id },
    });

    const response = await dynamoDb.send(command);
    return (response.Item as Product) || null;
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return null;
  }
}

export async function addProduct(product: Product): Promise<Product> {
  try {
    logDynamoOperation("PUT", TABLES.PRODUCTS, { id: product.id });

    const command = new PutCommand({
      TableName: TABLES.PRODUCTS,
      Item: product,
    });

    await dynamoDb.send(command);

    // Enhanced activity log with product details
    const entry: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: "Producto Agregado",
      details: `${product.name} - ${product.brand} - $${(product.priceCents / 100).toFixed(2)}`,
      type: "product",
      productId: product.id,
      productName: product.name,
      productBrand: product.brand,
      metadata: {
        price: product.priceCents,
        category: product.category,
        featured: product.featured,
      },
    };

    const logCommand = new PutCommand({
      TableName: TABLES.ACTIVITY_LOG,
      Item: entry,
    });
    await dynamoDb.send(logCommand);

    return product;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error("Failed to add product");
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>,
  skipLog: boolean = false
): Promise<Product | null> {
  try {
    // First get the current product
    const current = await getProductById(id);
    if (!current) return null;

    logDynamoOperation("UPDATE", TABLES.PRODUCTS, { id, updates });

    // Build update expression
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, unknown> = {};

    Object.entries(updates).forEach(([key, value]) => {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    });

    const command = new UpdateCommand({
      TableName: TABLES.PRODUCTS,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const response = await dynamoDb.send(command);
    const updated = response.Attributes as Product;

    if (!skipLog) {
      // Determine what was changed
      let action = "Producto Editado";
      let details = `${updated.name} - ${updated.brand}`;

      if (updates.priceCents !== undefined && updates.priceCents !== current.priceCents) {
        action = "Precio Actualizado";
        const oldPrice = (current.priceCents / 100).toFixed(2);
        const newPrice = (updates.priceCents / 100).toFixed(2);
        details = `${updated.name}: $${oldPrice} → $${newPrice}`;
      } else if (updates.displayOrder !== undefined) {
        action = "Orden de Producto Actualizado";
        details = `${updated.name} - Posición: ${updates.displayOrder + 1}`;
      } else if (updates.available !== undefined) {
        action = updates.available ? "Producto Disponible" : "Producto No Disponible";
        details = `${updated.name}`;
      }

      await addActivityLog(action, details, "product");
    }

    return updated;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // Get product details before deletion for logging
    const product = await getProductById(id);
    if (!product) return false;

    logDynamoOperation("DELETE", TABLES.PRODUCTS, { id });

    const command = new DeleteCommand({
      TableName: TABLES.PRODUCTS,
      Key: { id },
    });

    await dynamoDb.send(command);
    await addActivityLog("Producto Eliminado", `${product.name} - ${product.brand}`, "product");

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

// ==================== CATEGORIES ====================

interface CategoryItem {
  id: string;
  name: string;
}

export async function getCategories(): Promise<string[]> {
  try {
    logDynamoOperation("SCAN", TABLES.CATEGORIES);

    const command = new ScanCommand({
      TableName: TABLES.CATEGORIES,
    });

    const response = await dynamoDb.send(command);
    const items = (response.Items || []) as CategoryItem[];

    return items.map(item => item.name).sort();
  } catch (error) {
    console.error("Error getting categories:", error);
    return ["android", "audio", "tablet"]; // Default categories
  }
}

export async function addCategory(category: string): Promise<string[]> {
  try {
    const id = category.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("PUT", TABLES.CATEGORIES, { id, name: category });

    const command = new PutCommand({
      TableName: TABLES.CATEGORIES,
      Item: { id, name: category },
    });

    await dynamoDb.send(command);
    return await getCategories();
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error("Failed to add category");
  }
}

export async function updateCategory(oldCategory: string, newCategory: string): Promise<string[]> {
  try {
    const oldId = oldCategory.toLowerCase().replace(/\s+/g, "-");
    const newId = newCategory.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("UPDATE", TABLES.CATEGORIES, { oldId, newId });

    // Delete the old category
    const deleteCommand = new DeleteCommand({
      TableName: TABLES.CATEGORIES,
      Key: { id: oldId },
    });
    await dynamoDb.send(deleteCommand);

    // Add the new category
    const putCommand = new PutCommand({
      TableName: TABLES.CATEGORIES,
      Item: { id: newId, name: newCategory },
    });
    await dynamoDb.send(putCommand);

    await addActivityLog("Categoría Actualizada", `${oldCategory} → ${newCategory}`, "category");
    return await getCategories();
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory(category: string): Promise<string[]> {
  try {
    const id = category.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("DELETE", TABLES.CATEGORIES, { id });

    const command = new DeleteCommand({
      TableName: TABLES.CATEGORIES,
      Key: { id },
    });

    await dynamoDb.send(command);
    return await getCategories();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}

// ==================== BRANDS ====================

interface BrandItem {
  id: string;
  name: string;
}

export async function getBrands(): Promise<string[]> {
  try {
    logDynamoOperation("SCAN", TABLES.BRANDS);

    const command = new ScanCommand({
      TableName: TABLES.BRANDS,
    });

    const response = await dynamoDb.send(command);
    const items = (response.Items || []) as BrandItem[];

    return items.map(item => item.name).sort();
  } catch (error) {
    console.error("Error getting brands:", error);
    // Return unique brands from products as fallback
    const products = await getProducts();
    return [...new Set(products.map((p) => p.brand))].sort();
  }
}

export async function addBrand(brand: string): Promise<string[]> {
  try {
    const id = brand.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("PUT", TABLES.BRANDS, { id, name: brand });

    const command = new PutCommand({
      TableName: TABLES.BRANDS,
      Item: { id, name: brand },
    });

    await dynamoDb.send(command);
    await addActivityLog("Marca Agregada", brand, "category");
    return await getBrands();
  } catch (error) {
    console.error("Error adding brand:", error);
    throw new Error("Failed to add brand");
  }
}

export async function updateBrand(oldBrand: string, newBrand: string): Promise<string[]> {
  try {
    const oldId = oldBrand.toLowerCase().replace(/\s+/g, "-");
    const newId = newBrand.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("UPDATE", TABLES.BRANDS, { oldId, newId });

    // Delete the old brand
    const deleteCommand = new DeleteCommand({
      TableName: TABLES.BRANDS,
      Key: { id: oldId },
    });
    await dynamoDb.send(deleteCommand);

    // Add the new brand
    const putCommand = new PutCommand({
      TableName: TABLES.BRANDS,
      Item: { id: newId, name: newBrand },
    });
    await dynamoDb.send(putCommand);

    await addActivityLog("Marca Actualizada", `${oldBrand} → ${newBrand}`, "category");
    return await getBrands();
  } catch (error) {
    console.error("Error updating brand:", error);
    throw new Error("Failed to update brand");
  }
}

export async function deleteBrand(brand: string): Promise<string[]> {
  try {
    const id = brand.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("DELETE", TABLES.BRANDS, { id });

    const command = new DeleteCommand({
      TableName: TABLES.BRANDS,
      Key: { id },
    });

    await dynamoDb.send(command);
    await addActivityLog("Marca Eliminada", brand, "category");
    return await getBrands();
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw new Error("Failed to delete brand");
  }
}

// ==================== TAGS ====================

interface TagItem {
  id: string;
  name: string;
}

export async function getTags(): Promise<string[]> {
  try {
    logDynamoOperation("SCAN", TABLES.TAGS);

    const command = new ScanCommand({
      TableName: TABLES.TAGS,
    });

    const response = await dynamoDb.send(command);
    const items = (response.Items || []) as TagItem[];

    return items.map(item => item.name).sort();
  } catch (error) {
    console.error("Error getting tags:", error);
    return [];
  }
}

export async function addTag(tag: string): Promise<string[]> {
  try {
    const id = tag.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("PUT", TABLES.TAGS, { id, name: tag });

    const command = new PutCommand({
      TableName: TABLES.TAGS,
      Item: { id, name: tag },
    });

    await dynamoDb.send(command);
    await addActivityLog("Tag Agregado", tag, "category");
    return await getTags();
  } catch (error) {
    console.error("Error adding tag:", error);
    throw new Error("Failed to add tag");
  }
}

export async function updateTag(oldTag: string, newTag: string): Promise<string[]> {
  try {
    const oldId = oldTag.toLowerCase().replace(/\s+/g, "-");
    const newId = newTag.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("UPDATE", TABLES.TAGS, { oldId, newId });

    // Delete the old tag
    const deleteCommand = new DeleteCommand({
      TableName: TABLES.TAGS,
      Key: { id: oldId },
    });
    await dynamoDb.send(deleteCommand);

    // Add the new tag
    const putCommand = new PutCommand({
      TableName: TABLES.TAGS,
      Item: { id: newId, name: newTag },
    });
    await dynamoDb.send(putCommand);

    await addActivityLog("Tag Actualizado", `${oldTag} → ${newTag}`, "category");
    return await getTags();
  } catch (error) {
    console.error("Error updating tag:", error);
    throw new Error("Failed to update tag");
  }
}

export async function deleteTag(tag: string): Promise<string[]> {
  try {
    const id = tag.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("DELETE", TABLES.TAGS, { id });

    const command = new DeleteCommand({
      TableName: TABLES.TAGS,
      Key: { id },
    });

    await dynamoDb.send(command);
    await addActivityLog("Tag Eliminado", tag, "category");
    return await getTags();
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw new Error("Failed to delete tag");
  }
}

// ==================== CAROUSEL ====================

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  productId?: string;
  ctaText?: string;
  ctaHref?: string;
  cta?: { text: string; href: string };
  badge?: string;
  order?: number;
}

export async function getCarousel(): Promise<CarouselSlide[]> {
  try {
    logDynamoOperation("SCAN", TABLES.CAROUSEL);

    const command = new ScanCommand({
      TableName: TABLES.CAROUSEL,
    });

    const response = await dynamoDb.send(command);
    const slides = (response.Items || []) as CarouselSlide[];

    // Sort by order field, or by id if order doesn't exist
    return slides.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // Fallback to string comparison of id
      return a.id.localeCompare(b.id);
    });
  } catch (error) {
    console.error("Error getting carousel:", error);
    // Return default carousel
    return [
      {
        id: "1",
        title: "Los Mejores Smartphones",
        subtitle: "Al Mejor Precio",
        description: "Descubre nuestra selección de celulares Honor, Xiaomi, Samsung y Google",
        image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1600&auto=format&fit=crop",
        cta: { text: "Ver Catálogo", href: "#productos" },
        badge: "ENVÍO EXPRESS GRATIS ⚡",
      },
    ];
  }
}

export async function saveCarousel(slides: CarouselSlide[]): Promise<void> {
  try {
    logDynamoOperation("BATCH_WRITE", TABLES.CAROUSEL, { count: slides.length });

    // Delete all existing slides first (simple approach)
    const existing = await getCarousel();
    for (const slide of existing) {
      const deleteCommand = new DeleteCommand({
        TableName: TABLES.CAROUSEL,
        Key: { id: slide.id },
      });
      await dynamoDb.send(deleteCommand);
    }

    // Add all new slides
    for (const slide of slides) {
      const putCommand = new PutCommand({
        TableName: TABLES.CAROUSEL,
        Item: slide,
      });
      await dynamoDb.send(putCommand);
    }

    await addActivityLog("Carrusel Actualizado", `${slides.length} slides configuradas`, "carousel");
  } catch (error) {
    console.error("Error saving carousel:", error);
    throw new Error("Failed to save carousel");
  }
}

// ==================== ACTIVITY LOG ====================

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  type: "product" | "carousel" | "category" | "order";
  productId?: string;
  productName?: string;
  productBrand?: string;
  metadata?: Record<string, unknown>;
}

export async function getActivityLog(limit: number = 10): Promise<ActivityLogEntry[]> {
  try {
    logDynamoOperation("SCAN", TABLES.ACTIVITY_LOG, { limit });

    const command = new ScanCommand({
      TableName: TABLES.ACTIVITY_LOG,
      Limit: limit,
    });

    const response = await dynamoDb.send(command);
    const entries = (response.Items || []) as ActivityLogEntry[];

    // Sort by timestamp descending (most recent first)
    return entries.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, limit);
  } catch (error) {
    console.error("Error getting activity log:", error);
    return [];
  }
}

export async function addActivityLog(
  action: string,
  details: string,
  type: ActivityLogEntry["type"]
): Promise<void> {
  try {
    const entry: ActivityLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
      type,
    };

    logDynamoOperation("PUT", TABLES.ACTIVITY_LOG, entry);

    const command = new PutCommand({
      TableName: TABLES.ACTIVITY_LOG,
      Item: entry,
    });

    await dynamoDb.send(command);
  } catch (error) {
    console.error("Error adding activity log:", error);
    // Don't throw - activity log is non-critical
  }
}

// ==================== CHAT CONVERSATIONS ====================

export async function getConversation(conversationId: string): Promise<ChatConversation | null> {
  try {
    logDynamoOperation("GET", TABLES.CHAT_CONVERSATIONS, { conversationId });

    const command = new GetCommand({
      TableName: TABLES.CHAT_CONVERSATIONS,
      Key: { id: conversationId },
    });

    const response = await dynamoDb.send(command);
    return (response.Item as ChatConversation) || null;
  } catch (error) {
    console.error("Error getting conversation:", error);
    return null;
  }
}

export async function createConversation(sessionId: string, metadata?: SessionMetadata): Promise<ChatConversation> {
  try {
    const conversation: ChatConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      sessionId,
      messages: [],
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };

    logDynamoOperation("PUT", TABLES.CHAT_CONVERSATIONS, { id: conversation.id });

    const command = new PutCommand({
      TableName: TABLES.CHAT_CONVERSATIONS,
      Item: conversation,
    });

    await dynamoDb.send(command);
    return conversation;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw new Error("Failed to create conversation");
  }
}

export async function addMessageToConversation(
  conversationId: string,
  message: ChatMessage
): Promise<ChatConversation | null> {
  try {
    const conversation = await getConversation(conversationId);
    if (!conversation) return null;

    conversation.messages.push(message);
    conversation.updatedAt = new Date().toISOString();

    logDynamoOperation("UPDATE", TABLES.CHAT_CONVERSATIONS, { conversationId });

    const command = new PutCommand({
      TableName: TABLES.CHAT_CONVERSATIONS,
      Item: conversation,
    });

    await dynamoDb.send(command);
    return conversation;
  } catch (error) {
    console.error("Error adding message to conversation:", error);
    return null;
  }
}

export async function updateConversationCustomerInfo(
  conversationId: string,
  customerInfo: { name?: string; email?: string; phone?: string }
): Promise<ChatConversation | null> {
  try {
    const conversation = await getConversation(conversationId);
    if (!conversation) return null;

    conversation.customerInfo = { ...conversation.customerInfo, ...customerInfo };
    conversation.updatedAt = new Date().toISOString();

    logDynamoOperation("UPDATE", TABLES.CHAT_CONVERSATIONS, { conversationId });

    const command = new PutCommand({
      TableName: TABLES.CHAT_CONVERSATIONS,
      Item: conversation,
    });

    await dynamoDb.send(command);
    return conversation;
  } catch (error) {
    console.error("Error updating customer info:", error);
    return null;
  }
}

export async function updateConversationStatus(
  conversationId: string,
  status: 'active' | 'completed' | 'abandoned'
): Promise<ChatConversation | null> {
  try {
    const conversation = await getConversation(conversationId);
    if (!conversation) return null;

    conversation.status = status;
    conversation.updatedAt = new Date().toISOString();

    logDynamoOperation("UPDATE", TABLES.CHAT_CONVERSATIONS, { conversationId, status });

    const command = new PutCommand({
      TableName: TABLES.CHAT_CONVERSATIONS,
      Item: conversation,
    });

    await dynamoDb.send(command);
    return conversation;
  } catch (error) {
    console.error("Error updating conversation status:", error);
    return null;
  }
}

export async function getAllConversations(limit: number = 50): Promise<ChatConversation[]> {
  try {
    logDynamoOperation("SCAN", TABLES.CHAT_CONVERSATIONS, { limit });

    const command = new ScanCommand({
      TableName: TABLES.CHAT_CONVERSATIONS,
      Limit: limit,
    });

    const response = await dynamoDb.send(command);
    const conversations = (response.Items || []) as ChatConversation[];

    return conversations.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error("Error getting conversations:", error);
    return [];
  }
}

// ==================== PRODUCT INQUIRIES ====================

export async function logProductInquiry(inquiry: Omit<ProductInquiry, 'id' | 'timestamp'>): Promise<void> {
  try {
    const fullInquiry: ProductInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
    };

    logDynamoOperation("PUT", TABLES.PRODUCT_INQUIRIES, { id: fullInquiry.id });

    const command = new PutCommand({
      TableName: TABLES.PRODUCT_INQUIRIES,
      Item: fullInquiry,
    });

    await dynamoDb.send(command);
  } catch (error) {
    console.error("Error logging product inquiry:", error);
  }
}

export async function getProductInquiries(limit: number = 100): Promise<ProductInquiry[]> {
  try {
    logDynamoOperation("SCAN", TABLES.PRODUCT_INQUIRIES, { limit });

    const command = new ScanCommand({
      TableName: TABLES.PRODUCT_INQUIRIES,
      Limit: limit,
    });

    const response = await dynamoDb.send(command);
    const inquiries = (response.Items || []) as ProductInquiry[];

    return inquiries.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Error getting product inquiries:", error);
    return [];
  }
}

// ==================== POPULAR MODEL REQUESTS ====================

export async function trackModelRequest(
  modelName: string,
  brand: string | undefined,
  customerEmail: string | undefined,
  conversationId?: string
): Promise<void> {
  try {
    const modelId = modelName.toLowerCase().replace(/\s+/g, "-");

    logDynamoOperation("GET", TABLES.POPULAR_MODELS, { modelId });

    const getCommand = new GetCommand({
      TableName: TABLES.POPULAR_MODELS,
      Key: { id: modelId },
    });

    const existing = await dynamoDb.send(getCommand);
    const now = new Date().toISOString();

    let modelRequest: PopularModelRequest;

    if (existing.Item) {
      modelRequest = existing.Item as PopularModelRequest;
      modelRequest.requestCount += 1;
      modelRequest.lastRequestedAt = now;
      if (customerEmail && !modelRequest.requestedByEmails.includes(customerEmail)) {
        modelRequest.requestedByEmails.push(customerEmail);
      }
      // Track conversation relationship
      if (!modelRequest.conversationIds) modelRequest.conversationIds = [];
      if (conversationId && !modelRequest.conversationIds.includes(conversationId)) {
        modelRequest.conversationIds.push(conversationId);
      }
    } else {
      modelRequest = {
        id: modelId,
        modelName,
        brand,
        requestCount: 1,
        firstRequestedAt: now,
        lastRequestedAt: now,
        requestedByEmails: customerEmail ? [customerEmail] : [],
        conversationIds: conversationId ? [conversationId] : [],
      };
    }

    logDynamoOperation("PUT", TABLES.POPULAR_MODELS, { modelId });

    const putCommand = new PutCommand({
      TableName: TABLES.POPULAR_MODELS,
      Item: modelRequest,
    });

    await dynamoDb.send(putCommand);
  } catch (error) {
    console.error("Error tracking model request:", error);
  }
}

export async function getPopularModels(limit: number = 20): Promise<PopularModelRequest[]> {
  try {
    logDynamoOperation("SCAN", TABLES.POPULAR_MODELS, { limit });

    const command = new ScanCommand({
      TableName: TABLES.POPULAR_MODELS,
    });

    const response = await dynamoDb.send(command);
    const models = (response.Items || []) as PopularModelRequest[];

    return models
      .sort((a, b) => b.requestCount - a.requestCount)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting popular models:", error);
    return [];
  }
}

// ==================== PRODUCT RESERVATIONS ====================

export async function createReservation(reservation: Omit<ProductReservation, 'id' | 'requestedAt' | 'status'>): Promise<ProductReservation> {
  try {
    const fullReservation: ProductReservation = {
      ...reservation,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    logDynamoOperation("PUT", TABLES.RESERVATIONS, { id: fullReservation.id });

    const command = new PutCommand({
      TableName: TABLES.RESERVATIONS,
      Item: fullReservation,
    });

    await dynamoDb.send(command);
    return fullReservation;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw new Error("Failed to create reservation");
  }
}

export async function getReservations(limit: number = 100): Promise<ProductReservation[]> {
  try {
    logDynamoOperation("SCAN", TABLES.RESERVATIONS, { limit });

    const command = new ScanCommand({
      TableName: TABLES.RESERVATIONS,
      Limit: limit,
    });

    const response = await dynamoDb.send(command);
    const reservations = (response.Items || []) as ProductReservation[];

    return reservations.sort((a, b) =>
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  } catch (error) {
    console.error("Error getting reservations:", error);
    return [];
  }
}
