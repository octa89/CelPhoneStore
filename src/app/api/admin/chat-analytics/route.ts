import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getAllConversations,
  getProductInquiries,
  getPopularModels,
  getReservations,
  getProducts,
} from "@/lib/dynamodb-service";
import type { ProductInquiry, PopularModelRequest, ProductReservation } from "@/lib/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [conversations, inquiries, popularModels, reservations, products] = await Promise.all([
      getAllConversations(100),
      getProductInquiries(200),
      getPopularModels(20),
      getReservations(50),
      getProducts(),
    ]);

    // Helper function to extract ALL models from messages
    const extractAllModelsFromMessages = (messages: Array<{ role: string; content: string }>): string[] => {
      const foundModels = new Set<string>();

      for (const msg of messages) {
        if (msg.role === 'user') {
          const content = msg.content.toLowerCase();

          // Check against all products
          for (const product of products) {
            if (content.includes(product.name.toLowerCase())) {
              foundModels.add(product.name);
            }
          }

          // Also check for common model patterns not in our catalog
          const modelPatterns = [
            /iphone\s*(\d+\s*(pro|plus|pro\s*max)?)/gi,
            /galaxy\s*(s\d+|a\d+|z\s*(flip|fold)\s*\d*)/gi,
            /pixel\s*(\d+\s*(pro|a)?)/gi,
            /xiaomi\s*(\d+\s*(pro|ultra)?)/gi,
            /honor\s*(\d+|magic\s*\d*)/gi,
          ];

          for (const pattern of modelPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              matches.forEach(m => foundModels.add(m.trim()));
            }
          }
        }
      }

      return Array.from(foundModels);
    };

    // Helper function to check product availability
    const checkProductAvailability = (modelName: string): 'available' | 'out_of_stock' | 'not_found' => {
      if (!modelName) return 'not_found';
      const lowerModel = modelName.toLowerCase();

      // Check if it matches any available product
      for (const product of products) {
        if (product.name.toLowerCase().includes(lowerModel) ||
            lowerModel.includes(product.name.toLowerCase())) {
          return product.disponible !== false ? 'available' : 'out_of_stock';
        }
      }

      // Check if it's in the popular models (requested but not in stock)
      const isPopularModel = popularModels.some(m =>
        m.modelName.toLowerCase().includes(lowerModel) ||
        lowerModel.includes(m.modelName.toLowerCase())
      );

      return isPopularModel ? 'out_of_stock' : 'not_found';
    };

    // Index inquiries by conversationId for O(1) lookup
    const inquiriesByConversation = inquiries.reduce((acc, inq) => {
      if (!acc[inq.conversationId]) acc[inq.conversationId] = [];
      acc[inq.conversationId].push(inq);
      return acc;
    }, {} as Record<string, ProductInquiry[]>);

    // Index reservations by conversationId
    const reservationsByConversation = reservations.reduce((acc, res) => {
      if (!acc[res.conversationId]) acc[res.conversationId] = [];
      acc[res.conversationId].push(res);
      return acc;
    }, {} as Record<string, ProductReservation[]>);

    // Index popular models by conversationId
    const popularModelsByConversation = popularModels.reduce((acc, pm) => {
      (pm.conversationIds || []).forEach(convId => {
        if (!acc[convId]) acc[convId] = [];
        acc[convId].push(pm);
      });
      return acc;
    }, {} as Record<string, PopularModelRequest[]>);

    // Calculate stats
    const totalConversations = conversations.length;
    const activeConversations = conversations.filter(
      (c) => c.status === "active"
    ).length;
    const conversationsWithCustomerInfo = conversations.filter(
      (c) => c.customerInfo?.email || c.customerInfo?.phone
    ).length;

    // Calculate insights from customer data
    const readyToBuy = conversations.filter(
      (c) => c.customerInfo?.purchaseIntent === "ready_to_buy"
    ).length;
    const urgentLeads = conversations.filter(
      (c) => c.customerInfo?.urgency === "immediate"
    ).length;

    // Popular brands customers are interested in
    const brandInterests = conversations.reduce((acc, c) => {
      const brand = c.customerInfo?.interestedInBrand;
      if (brand) {
        acc[brand] = (acc[brand] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topBrandsRequested = Object.entries(brandInterests)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Group inquiries by type
    const inquiriesByType = inquiries.reduce((acc, inq) => {
      acc[inq.inquiryType] = (acc[inq.inquiryType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get top inquired products
    const productInquiryCounts = inquiries.reduce((acc, inq) => {
      const key = inq.productName;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topInquiredProducts = Object.entries(productInquiryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Flat data for BI table - all conversations with customer info
    const leadsTableData = conversations
      .filter(
        (c) =>
          c.customerInfo?.email ||
          c.customerInfo?.phone ||
          c.customerInfo?.name
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map((c) => {
        // Aggregate ALL models from ALL sources for this conversation
        const modelsFromInquiries = (inquiriesByConversation[c.id] || []).map(i => i.productName);
        const modelsFromPopular = (popularModelsByConversation[c.id] || []).map(pm => pm.modelName);
        const modelsFromCustomerInfo = c.customerInfo?.interestedInModels ||
          (c.customerInfo?.interestedInModel ? [c.customerInfo.interestedInModel] : []);
        const modelsFromMessages = extractAllModelsFromMessages(c.messages);

        // Deduplicate and filter empty
        const allModels = [...new Set([
          ...modelsFromCustomerInfo,
          ...modelsFromInquiries,
          ...modelsFromPopular,
          ...modelsFromMessages,
        ])].filter(Boolean);

        // Get reservations for this conversation
        const convReservations = reservationsByConversation[c.id] || [];

        // Check availability for each model
        const modelsWithAvailability = allModels.map(modelName => ({
          name: modelName,
          available: checkProductAvailability(modelName),
        }));

        return {
          // Identifiers
          id: c.id,

          // Customer contact info
          name: c.customerInfo?.name || '',
          email: c.customerInfo?.email || '',
          phone: c.customerInfo?.phone || '',

          // Customer interests - NOW AN ARRAY
          interestedInModels: allModels,
          modelsWithAvailability,
          interestedInBrand: c.customerInfo?.interestedInBrand || '',
          budget: c.customerInfo?.budget || null,
          priceRange: c.customerInfo?.priceRange || '',
          urgency: c.customerInfo?.urgency || '',
          purchaseIntent: c.customerInfo?.purchaseIntent || '',
          primaryUse: c.customerInfo?.primaryUse || '',
          currentPhone: c.customerInfo?.currentPhone || '',
          preferredFeatures: c.customerInfo?.preferredFeatures || [],

          // Related data stats
          inquiryCount: (inquiriesByConversation[c.id] || []).length,
          reservationCount: convReservations.length,
          hasReservation: convReservations.length > 0,
          reservationStatus: convReservations[0]?.status || null,

          // Session metadata
          deviceType: c.metadata?.deviceType || '',
          browser: c.metadata?.browser || '',
          os: c.metadata?.os || '',
          language: c.metadata?.language || '',
          country: c.metadata?.country || '',
          city: c.metadata?.city || '',
          pageUrl: c.metadata?.pageUrl || '',
          pageTitle: c.metadata?.pageTitle || '',
          referrer: c.metadata?.referrer || '',

          // Conversation stats
          messageCount: c.messages.length,
          status: c.status,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,

          // Keep messages for detail modal (but don't include in table rendering)
          messages: c.messages.map((m) => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
        };
      });

    return NextResponse.json({
      stats: {
        totalConversations,
        activeConversations,
        conversationsWithCustomerInfo,
        totalInquiries: inquiries.length,
        readyToBuy,
        urgentLeads,
        totalReservations: reservations.length,
        pendingReservations: reservations.filter(r => r.status === 'pending').length,
      },
      inquiriesByType,
      topInquiredProducts,
      popularModels,
      topBrandsRequested,
      reservations,
      leadsTableData,
    });
  } catch (error) {
    console.error("Error fetching chat analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
