import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTags, addTag, deleteTag, updateTag } from "@/lib/dynamodb-service";

// GET all tags
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await getTags();
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST new tag
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json(
        { error: "Tag name required" },
        { status: 400 }
      );
    }

    const tags = await addTag(tag);
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error adding tag:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update tag
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldTag, newTag } = await request.json();

    if (!oldTag || !newTag) {
      return NextResponse.json(
        { error: "Old and new tag names required" },
        { status: 400 }
      );
    }

    const tags = await updateTag(oldTag, newTag);
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE tag
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json(
        { error: "Tag name required" },
        { status: 400 }
      );
    }

    const tags = await deleteTag(tag);
    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
