import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { beats } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const slug = slugify(body.title) + "-" + Date.now().toString(36);

  const [beat] = await db.insert(beats).values({
    title: body.title,
    slug,
    description: body.description || "",
    genre: body.genre || "Afrobeats",
    mood: body.mood || "",
    bpm: body.bpm ? parseInt(body.bpm) : null,
    key: body.key || "",
    price: body.price || "29.99",
    duration: body.duration ? parseInt(body.duration) : 0,
    licenseType: body.licenseType || "Basic",
    featured: body.featured || false,
    trending: body.trending || false,
    coverArt: body.coverArt || "",
    audioUrl: body.audioUrl || "",
    tags: body.tags || "",
    isActive: true,
  }).returning();

  return NextResponse.json({ beat });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { id, ...data } = body;

  await db.update(beats).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(beats.id, id));

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await req.json();
  await db.delete(beats).where(eq(beats.id, id));
  return NextResponse.json({ success: true });
}
