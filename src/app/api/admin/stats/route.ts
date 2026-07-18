import { NextResponse } from "next/server";
import { db } from "@/db";
import { beats, users, orders, contactMessages } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { sql } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [beatCount] = await db.select({ count: sql<number>`count(*)::int` }).from(beats);
  const [userCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  const [orderCount] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
  const [revenue] = await db.select({ total: sql<string>`coalesce(sum(total::numeric),0)::text` }).from(orders);
  const [msgCount] = await db.select({ count: sql<number>`count(*)::int` }).from(contactMessages);

  return NextResponse.json({
    beats: beatCount.count,
    users: userCount.count,
    orders: orderCount.count,
    revenue: revenue.total,
    messages: msgCount.count,
  });
}
