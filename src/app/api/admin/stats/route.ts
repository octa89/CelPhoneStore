import { NextResponse } from "next/server";
import { getProducts, getActivityLog } from "@/lib/data-manager";

export async function GET() {
  try {
    const products = await getProducts();
    const activityLog = await getActivityLog(10);

    const stats = {
      totalProducts: products.length,
      availableProducts: products.filter((p) => p.available !== false).length,
      totalOrders: 0,
      pendingOrders: 0,
      revenue: 0,
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
