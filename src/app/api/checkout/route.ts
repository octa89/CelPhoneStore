import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAllProducts } from "@/lib/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type LineItemRequest = {
  productId: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { lineItems } = body as { lineItems: LineItemRequest[] };

    // Validation: Check if lineItems exists and is an array
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart: lineItems must be a non-empty array" },
        { status: 400 }
      );
    }

    // Get all products from server-side source of truth
    const products = getAllProducts();
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Verify prices and build validated line items
    const validatedLineItems = lineItems.map((item) => {
      // Validate item structure
      if (!item.productId || typeof item.quantity !== "number") {
        throw new Error("Invalid line item structure");
      }

      // Validate quantity
      if (item.quantity <= 0 || item.quantity > 100) {
        throw new Error(
          `Invalid quantity for product ${item.productId}: ${item.quantity}`
        );
      }

      // Verify product exists
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Use server-side price (source of truth)
      return {
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.images[0]],
          },
          unit_amount: product.priceCents, // Server-side price verification
        },
      };
    });

    // Validate environment variables
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3005";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: validatedLineItems,
      success_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    console.error("Checkout error:", e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
