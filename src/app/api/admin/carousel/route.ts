import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CAROUSEL_FILE = path.join(process.cwd(), "src/data/carousel-settings.json");

export async function GET() {
  try {
    const data = await fs.readFile(CAROUSEL_FILE, "utf-8");
    const carouselSettings = JSON.parse(data);
    return NextResponse.json(carouselSettings);
  } catch (error) {
    console.error("Error reading carousel settings:", error);
    return NextResponse.json({ slides: [] }, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(CAROUSEL_FILE, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating carousel settings:", error);
    return NextResponse.json(
      { error: "Failed to update carousel settings" },
      { status: 500 }
    );
  }
}
