import { db } from "@/db";
import { beats, users, coupons } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

const DEMO_BEATS = [
  { title: "Lagos Nights", genre: "Afrobeats", mood: "Vibrant", bpm: 108, key: "C Minor", price: "29.99", duration: 198, featured: true, trending: true },
  { title: "Accra Sunrise", genre: "Afrobeats", mood: "Uplifting", bpm: 112, key: "G Major", price: "34.99", duration: 210, featured: true, trending: false },
  { title: "Nairobi Flow", genre: "Afrobeats", mood: "Chill", bpm: 95, key: "D Minor", price: "24.99", duration: 185, featured: false, trending: true },
  { title: "Kampala Drums", genre: "Afrobeats", mood: "Energetic", bpm: 120, key: "A Minor", price: "39.99", duration: 220, featured: true, trending: true },
  { title: "Dakar Vibes", genre: "Afrobeats", mood: "Romantic", bpm: 100, key: "F Major", price: "29.99", duration: 195, featured: false, trending: false },
  { title: "Johannesburg Heat", genre: "Afrobeats", mood: "Dark", bpm: 115, key: "E Minor", price: "44.99", duration: 230, featured: true, trending: false },
  { title: "Abuja Dreams", genre: "Afrobeats", mood: "Dreamy", bpm: 98, key: "B Minor", price: "34.99", duration: 200, featured: false, trending: true },
  { title: "Kigali Groove", genre: "Afrobeats", mood: "Groovy", bpm: 105, key: "G Minor", price: "29.99", duration: 190, featured: false, trending: false },
  { title: "Lilongwe Bounce", genre: "Afrobeats", mood: "Bouncy", bpm: 118, key: "C Major", price: "24.99", duration: 175, featured: true, trending: true },
  { title: "Dar es Salaam Wave", genre: "Afrobeats", mood: "Wavy", bpm: 102, key: "A Major", price: "39.99", duration: 215, featured: false, trending: false },
  { title: "Lusaka Thunder", genre: "Afrobeats", mood: "Powerful", bpm: 125, key: "D Major", price: "49.99", duration: 240, featured: true, trending: true },
  { title: "Maputo Sunset", genre: "Afrobeats", mood: "Mellow", bpm: 92, key: "F Minor", price: "29.99", duration: 188, featured: false, trending: false },
];

export async function seedDatabase() {
  // Check if already seeded
  const existingBeats = await db.select().from(beats).limit(1);
  if (existingBeats.length > 0) return;

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  await db.insert(users).values({
    email: "mandapeter242@gmail.com",
    password: adminPassword,
    name: "Raidar Lost",
    role: "admin",
    emailVerified: true,
  }).onConflictDoNothing();

  // Seed beats
  const colors = [
    "from-amber-600 to-yellow-800",
    "from-purple-600 to-indigo-800",
    "from-rose-600 to-pink-800",
    "from-emerald-600 to-teal-800",
    "from-blue-600 to-cyan-800",
    "from-orange-600 to-red-800",
  ];

  for (let i = 0; i < DEMO_BEATS.length; i++) {
    const b = DEMO_BEATS[i];
    const slug = b.title.toLowerCase().replace(/\s+/g, "-");
    await db.insert(beats).values({
      title: b.title,
      slug,
      description: `Premium ${b.mood} ${b.genre} instrumental produced by Raidar Lost. Perfect for artists looking for that authentic African sound.`,
      genre: b.genre,
      mood: b.mood,
      bpm: b.bpm,
      key: b.key,
      price: b.price,
      duration: b.duration,
      featured: b.featured,
      trending: b.trending,
      licenseType: "Basic",
      plays: Math.floor(Math.random() * 5000) + 500,
      likes: Math.floor(Math.random() * 500) + 50,
      purchases: Math.floor(Math.random() * 100) + 10,
      tags: `${b.genre},${b.mood},instrumental`,
      isActive: true,
    }).onConflictDoNothing();
  }

  // Seed coupon
  await db.insert(coupons).values({
    code: "WELCOME20",
    discountPercent: 20,
    maxUses: 1000,
    isActive: true,
  }).onConflictDoNothing();
}
