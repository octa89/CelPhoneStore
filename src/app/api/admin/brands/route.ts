import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProducts } from "@/lib/data-manager";

// GET all unique brands
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getProducts();
    const brands = [...new Set(products.map((p) => p.brand))].sort();

    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
