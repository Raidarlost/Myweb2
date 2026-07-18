import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { beats } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [beat] = await db.select().from(beats).where(eq(beats.id, id)).limit(1);
    if (!beat) {
      return NextResponse.json({ error: "Beat not found" }, { status: 404 });
    }
    return NextResponse.json({ beat });
  } catch (err) {
    console.error("Beat fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch beat" }, { status: 500 });
  }
}
