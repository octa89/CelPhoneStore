import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CAROUSEL_FILE = path.join(process.cwd(), "src/data/carousel-settings.json");

// Public API - no authentication required
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
