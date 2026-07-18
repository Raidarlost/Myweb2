"use client";

import { useEffect, useState } from "react";
import BeatCard from "./BeatCard";
import { useApp } from "./Providers";
import Link from "next/link";

interface Beat {
  id: string;
  title: string;
  slug: string;
  genre: string;
  mood: string | null;
  bpm: number | null;
  key: string | null;
  price: string;
  coverArt: string | null;
  audioUrl: string | null;
  duration: number | null;
  licenseType: string;
  featured: boolean;
  trending: boolean;
  plays: number;
  likes: number;
  purchases: number;
  tags: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function HomeContent() {
  const [featuredBeats, setFeaturedBeats] = useState<Beat[]>([]);
  const [trendingBeats, setTrendingBeats] = useState<Beat[]>([]);
  const [allBeats, setAllBeats] = useState<Beat[]>([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { setShowAuth, user } = useApp();

  useEffect(() => {
    fetch("/api/beats?featured=true&limit=4").then(r => r.json()).then(d => setFeaturedBeats(d.beats || []));
    fetch("/api/beats?trending=true&limit=4").then(r => r.json()).then(d => setTrendingBeats(d.beats || []));
    fetch("/api/beats?sort=newest&limit=8").then(r => r.json()).then(d => setAllBeats(d.beats || []));
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) { setSubscribed(true); setEmail(""); }
  };

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-dark to-dark">
          {/* Animated circles */}
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold/3 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/8" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-gold/10" />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(212,168,71,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,71,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="animate-slide-up">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4 font-medium">Premium Afrobeats Instrumentals</p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-6">
              RAIDAR<br />
              <span className="gold-text">LOST</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Discover exclusive Afrobeats instrumentals crafted with premium quality. Your next hit starts here.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/beats" className="px-8 py-3.5 rounded-full btn-gold text-sm uppercase tracking-wider">
                Browse Beats
              </Link>
              <button
                onClick={() => !user && setShowAuth("register")}
                className="px-8 py-3.5 rounded-full border border-gold/30 text-gold text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors"
              >
                {user ? "Dashboard" : "Join Free"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div>
              <p className="text-2xl sm:text-3xl font-black gold-text">500+</p>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Beats</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black gold-text">10K+</p>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Artists</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black gold-text">50K+</p>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider">Downloads</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gold/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-gold" />
          </div>
        </div>
      </section>

      {/* ── Featured Beats ── */}
      {featuredBeats.length > 0 && (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Handpicked</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Beats</h2>
            </div>
            <Link href="/beats" className="text-sm text-gold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBeats.map((beat) => (
              <BeatCard key={beat.id} beat={beat} />
            ))}
          </div>
        </section>
      )}

      {/* ── Trending ── */}
      {trendingBeats.length > 0 && (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Hot Right Now</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Trending Beats</h2>
            </div>
            <Link href="/beats?sort=popular" className="text-sm text-gold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingBeats.map((beat) => (
              <BeatCard key={beat.id} beat={beat} />
            ))}
          </div>
        </section>
      )}

      {/* ── Why Choose Us ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">The Raidar Lost Difference</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Why Choose Raidar Lost?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎵", title: "Premium Quality", desc: "Every beat is crafted with industry-standard quality and attention to detail." },
              { icon: "⚡", title: "Instant Download", desc: "Get your beats immediately after purchase. No waiting, no hassle." },
              { icon: "📜", title: "Clear Licensing", desc: "Simple, transparent licensing terms. Know exactly what you're getting." },
              { icon: "🎧", title: "Exclusive Sound", desc: "Authentic Afrobeats instrumentals you won't find anywhere else." },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/20 transition-colors text-center group">
                <span className="text-3xl block mb-4">{item.icon}</span>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-gold transition-colors">{item.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Latest Beats ── */}
      {allBeats.length > 0 && (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Latest Releases</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Newest Beats</h2>
            </div>
            <Link href="/beats" className="text-sm text-gold hover:underline">Browse All →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allBeats.map((beat) => (
              <BeatCard key={beat.id} beat={beat} />
            ))}
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section className="py-20 px-4 sm:px-6 bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Trusted by Artists</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">What Artists Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "DJ Flame", text: "The quality of Raidar Lost beats is unmatched. Every track is fire!", rating: 5 },
              { name: "MC Rhythm", text: "Found my perfect sound here. The Afrobeats collection is incredible.", rating: 5 },
              { name: "Vocal Queen", text: "Easy to use, great customer service, and amazing beats. Highly recommend!", rating: 5 },
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl glass">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-neutral-300 mb-4 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <p className="text-xs font-bold text-gold">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Stay Updated</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Join the Community</h2>
          <p className="text-sm text-neutral-400 mb-8">Get exclusive discounts, early access to new beats, and producer tips.</p>
          {subscribed ? (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              ✓ Thanks for subscribing! Check your inbox for a welcome gift.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-dark-card border border-dark-border text-white placeholder-neutral-500 text-sm"
              />
              <button type="submit" className="px-6 py-3 rounded-lg btn-gold text-sm whitespace-nowrap">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 p-12 sm:p-16 relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Create Your Next Hit?</h2>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto">Browse our collection of premium Afrobeats instrumentals and find the perfect sound for your project.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/beats" className="px-8 py-3.5 rounded-full btn-gold text-sm uppercase tracking-wider">
                Explore Beats
              </Link>
              <Link href="/contact" className="px-8 py-3.5 rounded-full border border-gold/30 text-gold text-sm uppercase tracking-wider hover:bg-gold/10 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
