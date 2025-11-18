import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCategories, addCategory, deleteCategory } from "@/lib/data-manager";

// GET all categories
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new category
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category } = await request.json();

    if (!category) {
      return NextResponse.json(
        { error: "Category name required" },
        { status: 400 }
      );
    }

    const categories = await addCategory(category.toLowerCase());
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category } = await request.json();

    if (!category) {
      return NextResponse.json(
        { error: "Category name required" },
        { status: 400 }
      );
    }

    const categories = await deleteCategory(category);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
