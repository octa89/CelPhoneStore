import { NextResponse } from "next/server";
import { getProducts } from "@/lib/dynamodb-service";

export async function GET() {
  try {
    const products = await getProducts();

    // Only return available products for public API
    const availableProducts = products.filter((p) => p.available !== false);

    return NextResponse.json({
      products: availableProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
