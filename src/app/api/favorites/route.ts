import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { favorites, beats } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ favorites: [] });

  const items = await db
    .select({
      id: favorites.id,
      beatId: favorites.beatId,
      title: beats.title,
      price: beats.price,
      coverArt: beats.coverArt,
      genre: beats.genre,
      bpm: beats.bpm,
      key: beats.key,
      mood: beats.mood,
    })
    .from(favorites)
    .innerJoin(beats, eq(favorites.beatId, beats.id))
    .where(eq(favorites.userId, session.userId));

  return NextResponse.json({ favorites: items });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { beatId } = await req.json();

  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, session.userId), eq(favorites.beatId, beatId)))
    .limit(1);

  if (existing.length > 0) {
    // Remove favorite (toggle)
    await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    return NextResponse.json({ favorited: false });
  }

  await db.insert(favorites).values({ userId: session.userId, beatId });
  return NextResponse.json({ favorited: true });
}
