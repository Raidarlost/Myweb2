import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, cartItems, beats, coupons } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.userId))
    .orderBy(orders.createdAt);

  const result = [];
  for (const order of userOrders) {
    const items = await db
      .select({
        id: orderItems.id,
        beatId: orderItems.beatId,
        price: orderItems.price,
        licenseType: orderItems.licenseType,
        title: beats.title,
        coverArt: beats.coverArt,
      })
      .from(orderItems)
      .innerJoin(beats, eq(orderItems.beatId, beats.id))
      .where(eq(orderItems.orderId, order.id));

    result.push({ ...order, items });
  }

  return NextResponse.json({ orders: result });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { paymentMethod, couponCode } = await req.json();

  // Get cart items
  const items = await db
    .select({
      id: cartItems.id,
      beatId: cartItems.beatId,
      licenseType: cartItems.licenseType,
      price: beats.price,
    })
    .from(cartItems)
    .innerJoin(beats, eq(cartItems.beatId, beats.id))
    .where(eq(cartItems.userId, session.userId));

  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  let subtotal = items.reduce((sum, item) => sum + Number(item.price), 0);
  let discount = 0;

  // Apply coupon
  if (couponCode) {
    const [coupon] = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, couponCode.toUpperCase()), eq(coupons.isActive, true)))
      .limit(1);

    if (coupon && coupon.usedCount < (coupon.maxUses || 99999)) {
      discount = (subtotal * coupon.discountPercent) / 100;
      await db.update(coupons).set({ usedCount: coupon.usedCount + 1 }).where(eq(coupons.id, coupon.id));
    }
  }

  const total = subtotal - discount;

  // Create order
  const [order] = await db.insert(orders).values({
    userId: session.userId,
    total: total.toFixed(2),
    status: "completed",
    paymentMethod: paymentMethod || "demo",
    couponCode: couponCode || null,
    discount: discount.toFixed(2),
  }).returning();

  // Create order items and update beat purchase counts
  for (const item of items) {
    await db.insert(orderItems).values({
      orderId: order.id,
      beatId: item.beatId,
      price: item.price,
      licenseType: item.licenseType,
    });
  }

  // Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, session.userId));

  return NextResponse.json({ order });
}
