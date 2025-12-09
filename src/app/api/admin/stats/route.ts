import { NextResponse } from "next/server";
import { getProducts, getActivityLog, getAllConversations, getReservations } from "@/lib/dynamodb-service";

export async function GET() {
  try {
    const [products, activityLog, conversations, reservations] = await Promise.all([
      getProducts(),
      getActivityLog(10),
      getAllConversations(100),
      getReservations(50),
    ]);

    // Calculate chat metrics
    const totalConversations = conversations.length;
    const activeConversations = conversations.filter((c) => c.status === "active").length;
    const conversationsWithLeads = conversations.filter(
      (c) => c.customerInfo?.email || c.customerInfo?.phone
    ).length;
    const urgentLeads = conversations.filter(
      (c) => c.customerInfo?.urgency === "immediate"
    ).length;
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;

    const stats = {
      totalProducts: products.length,
      availableProducts: products.filter((p) => p.available !== false).length,
      totalOrders: 0,
      pendingOrders: 0,
      revenue: 0,
      // Chat stats
      totalConversations,
      activeConversations,
      conversationsWithLeads,
      urgentLeads,
      pendingReservations,
    };

    return NextResponse.json({
      stats,
      activityLog,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
