import { NextResponse } from "next/server";
import { getCarousel, saveCarousel } from "@/lib/dynamodb-service";

export async function GET() {
  try {
    const slides = await getCarousel();
    return NextResponse.json({ slides });
  } catch (error) {
    console.error("Error reading carousel:", error);
    return NextResponse.json({ slides: [] }, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await saveCarousel(body.slides);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating carousel:", error);
    return NextResponse.json(
      { error: "Failed to update carousel" },
      { status: 500 }
    );
  }
}
