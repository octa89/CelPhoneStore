import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProducts, addProduct } from "@/lib/dynamodb-service";
import type { Product } from "@/lib/types";
import { generateSlug } from "@/lib/utils";

// GET all products
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getProducts();

    // Support search query
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let filtered = products;

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    return NextResponse.json({ products: filtered });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new product
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.brand || !body.priceCents) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate ID and slug if not provided
    const id = body.id || `product-${Date.now()}`;
    const slug = body.slug || generateSlug(body.name);

    const product: Product = {
      id,
      slug,
      name: body.name,
      brand: body.brand,
      priceCents: Number(body.priceCents),
      images: body.images || [],
      tags: body.tags || [],
      specs: body.specs || {},
      category: body.category || "android",
      description: body.description || "",
      featured: body.featured || false,
    };

    const created = await addProduct(product);

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
