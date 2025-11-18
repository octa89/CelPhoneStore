import { NextResponse } from "next/server";
import { updateProduct } from "@/lib/data-manager";

export async function PUT(request: Request) {
  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid updates format" },
        { status: 400 }
      );
    }

    // Update each product with its display order
    for (const update of updates) {
      await updateProduct(update.id, { displayOrder: update.displayOrder });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product order:", error);
    return NextResponse.json(
      { error: "Failed to update product order" },
      { status: 500 }
    );
  }
}
