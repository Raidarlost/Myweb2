import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { beats } from "@/db/schema";
import { eq, ilike, and, gte, lte, desc, asc, or, sql } from "drizzle-orm";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: NextRequest) {
  try {
    // Ensure seed data exists
    await seedDatabase();

    const url = req.nextUrl;
    const search = url.searchParams.get("search") || "";
    const genre = url.searchParams.get("genre") || "";
    const mood = url.searchParams.get("mood") || "";
    const sortBy = url.searchParams.get("sort") || "newest";
    const featured = url.searchParams.get("featured");
    const trending = url.searchParams.get("trending");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const conditions = [eq(beats.isActive, true)];

    if (search) {
      conditions.push(
        or(
          ilike(beats.title, `%${search}%`),
          ilike(beats.genre, `%${search}%`),
          ilike(beats.mood, `%${search}%`),
          ilike(beats.tags, `%${search}%`)
        )!
      );
    }

    if (genre) conditions.push(eq(beats.genre, genre));
    if (mood) conditions.push(ilike(beats.mood, mood));
    if (featured === "true") conditions.push(eq(beats.featured, true));
    if (trending === "true") conditions.push(eq(beats.trending, true));
    if (minPrice) conditions.push(gte(beats.price, minPrice));
    if (maxPrice) conditions.push(lte(beats.price, maxPrice));

    let orderBy;
    switch (sortBy) {
      case "popular":
        orderBy = desc(beats.plays);
        break;
      case "price-low":
        orderBy = asc(beats.price);
        break;
      case "price-high":
        orderBy = desc(beats.price);
        break;
      case "best-selling":
        orderBy = desc(beats.purchases);
        break;
      default:
        orderBy = desc(beats.createdAt);
    }

    const results = await db
      .select()
      .from(beats)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit);

    return NextResponse.json({ beats: results });
  } catch (err) {
    console.error("Beats fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch beats" }, { status: 500 });
  }
}
