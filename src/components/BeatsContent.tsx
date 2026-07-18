"use client";

import { useEffect, useState, useCallback } from "react";
import BeatCard from "./BeatCard";

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

export default function BeatsContent() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchBeats = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre) params.set("genre", genre);
    if (mood) params.set("mood", mood);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/beats?${params.toString()}`);
    const data = await res.json();
    setBeats(data.beats || []);
    setLoading(false);
  }, [search, genre, mood, sort]);

  useEffect(() => {
    const timeout = setTimeout(fetchBeats, 300);
    return () => clearTimeout(timeout);
  }, [fetchBeats]);

  const moods = ["Vibrant", "Uplifting", "Chill", "Energetic", "Romantic", "Dark", "Dreamy", "Groovy", "Bouncy", "Wavy", "Powerful", "Mellow"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Beat Store</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Browse Beats</h1>
        <p className="text-neutral-400 max-w-lg mx-auto">Discover premium Afrobeats instrumentals. Use filters to find your perfect sound.</p>
      </div>

      {/* Search & Filters */}
      <div className="glass rounded-2xl p-6 mb-10 space-y-4">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search beats by name, genre, mood..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-neutral-300 text-sm"
          >
            <option value="">All Moods</option>
            {moods.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-neutral-300 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="best-selling">Best Selling</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <button
            onClick={() => { setSearch(""); setGenre(""); setMood(""); setSort("newest"); }}
            className="px-4 py-2.5 rounded-lg border border-dark-border text-neutral-400 text-sm hover:text-gold hover:border-gold/30 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-neutral-400">{beats.length} beats found</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-dark-card border border-dark-border animate-pulse">
              <div className="aspect-square bg-dark-surface rounded-t-2xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-dark-surface rounded w-3/4" />
                <div className="h-3 bg-dark-surface rounded w-1/2" />
                <div className="h-3 bg-dark-surface rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : beats.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">🎵</span>
          <h3 className="text-xl font-bold text-white mb-2">No beats found</h3>
          <p className="text-neutral-400 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      )}
    </div>
  );
}
