import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raidar Lost — Premium Afrobeats Instrumentals",
  description: "Premium Afrobeats instrumentals crafted by Raidar Lost. Browse, preview, and purchase exclusive beats for your next hit.",
  keywords: "afrobeats, beats, instrumentals, music producer, buy beats, Raidar Lost",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
