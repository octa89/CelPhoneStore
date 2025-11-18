import { NextResponse } from "next/server";
import { updateProduct, addActivityLog } from "@/lib/data-manager";

export async function PUT(request: Request) {
  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Invalid updates format" },
        { status: 400 }
      );
    }

    // Update each product with its display order (skip individual logs)
    for (const update of updates) {
      await updateProduct(update.id, { displayOrder: update.displayOrder }, true);
    }

    // Log a single activity for the entire reorder action
    await addActivityLog(
      "Orden de Productos Actualizado",
      `${updates.length} productos reorganizados en la página principal`,
      "product"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product order:", error);
    return NextResponse.json(
      { error: "Failed to update product order" },
      { status: 500 }
    );
  }
}
