import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  decimal,
  uuid,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";

// ── Users ──
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  avatar: text("avatar"),
  role: varchar("role", { length: 20 }).notNull().default("user"),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Beats ──
export const beats = pgTable("beats", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  genre: varchar("genre", { length: 100 }).notNull().default("Afrobeats"),
  mood: varchar("mood", { length: 100 }),
  bpm: integer("bpm"),
  key: varchar("key", { length: 20 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("29.99"),
  coverArt: text("cover_art"),
  audioUrl: text("audio_url"),
  duration: integer("duration").default(0),
  licenseType: varchar("license_type", { length: 50 }).notNull().default("Basic"),
  featured: boolean("featured").notNull().default(false),
  trending: boolean("trending").notNull().default(false),
  plays: integer("plays").notNull().default(0),
  likes: integer("likes").notNull().default(0),
  purchases: integer("purchases").notNull().default(0),
  tags: text("tags"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Favorites ──
export const favorites = pgTable("favorites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  beatId: uuid("beat_id").notNull().references(() => beats.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Cart Items ──
export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  beatId: uuid("beat_id").notNull().references(() => beats.id),
  licenseType: varchar("license_type", { length: 50 }).notNull().default("Basic"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Orders ──
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("completed"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentId: varchar("payment_id", { length: 255 }),
  couponCode: varchar("coupon_code", { length: 50 }),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Order Items ──
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  beatId: uuid("beat_id").notNull().references(() => beats.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  licenseType: varchar("license_type", { length: 50 }).notNull(),
});

// ── Contact Messages ──
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Coupons ──
export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountPercent: integer("discount_percent").notNull().default(10),
  maxUses: integer("max_uses").default(100),
  usedCount: integer("used_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Newsletter ──
export const newsletter = pgTable("newsletter", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
