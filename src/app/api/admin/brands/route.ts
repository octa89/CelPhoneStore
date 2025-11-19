import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBrands, addBrand, deleteBrand, updateBrand } from "@/lib/dynamodb-service";

// GET all brands
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brands = await getBrands();
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new brand
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brand } = await request.json();

    if (!brand) {
      return NextResponse.json(
        { error: "Brand name required" },
        { status: 400 }
      );
    }

    const brands = await addBrand(brand);
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error adding brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update brand
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldBrand, newBrand } = await request.json();

    if (!oldBrand || !newBrand) {
      return NextResponse.json(
        { error: "Old and new brand names required" },
        { status: 400 }
      );
    }

    const brands = await updateBrand(oldBrand, newBrand);
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE brand
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brand } = await request.json();

    if (!brand) {
      return NextResponse.json(
        { error: "Brand name required" },
        { status: 400 }
      );
    }

    const brands = await deleteBrand(brand);
    return NextResponse.json({ brands });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
