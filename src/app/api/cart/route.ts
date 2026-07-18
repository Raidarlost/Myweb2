import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems, beats } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ items: [] });

  const items = await db
    .select({
      id: cartItems.id,
      beatId: cartItems.beatId,
      licenseType: cartItems.licenseType,
      title: beats.title,
      price: beats.price,
      coverArt: beats.coverArt,
      genre: beats.genre,
      bpm: beats.bpm,
      key: beats.key,
    })
    .from(cartItems)
    .innerJoin(beats, eq(cartItems.beatId, beats.id))
    .where(eq(cartItems.userId, session.userId));

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { beatId, licenseType } = await req.json();

  // Check if already in cart
  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, session.userId), eq(cartItems.beatId, beatId)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: "Already in cart" }, { status: 409 });
  }

  await db.insert(cartItems).values({
    userId: session.userId,
    beatId,
    licenseType: licenseType || "Basic",
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { itemId } = await req.json();
  await db.delete(cartItems).where(
    and(eq(cartItems.id, itemId), eq(cartItems.userId, session.userId))
  );

  return NextResponse.json({ success: true });
}
