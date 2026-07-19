"use client";

import { useApp } from "./Providers";

interface Beat {
  id: string;
  title: string;
  genre: string;
  mood: string | null;
  bpm: number | null;
  key: string | null;
  price: string;
  duration: number | null;
  coverArt: string | null;
  audioUrl: string | null;

  plays: number;
  likes: number;
  featured: boolean;
  trending: boolean;
}

export default function BeatCard({ beat }: { beat: Beat }) {
  const { setCurrentBeat, setIsPlaying, currentBeat, isPlaying, addToCart, user, setShowAuth } = useApp();

  const isCurrentlyPlaying = currentBeat?.id === beat.id && isPlaying;

  const handlePlay = () => {
    if (currentBeat?.id === beat.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentBeat(beat as any);
      setIsPlaying(true);
    }
  };

  const handleAddToCart = async () => {
    if (!user) { setShowAuth("login"); return; }
    await addToCart(beat.id);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Generate a deterministic gradient based on beat title
  const gradients = [
    "from-amber-900/40 to-yellow-900/20",
    "from-purple-900/40 to-indigo-900/20",
    "from-rose-900/40 to-pink-900/20",
    "from-emerald-900/40 to-teal-900/20",
    "from-blue-900/40 to-cyan-900/20",
    "from-orange-900/40 to-red-900/20",
  ];
  const gradientIdx = beat.title.length % gradients.length;

  return (
    <div className="group relative rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all duration-300 overflow-hidden">
      {/* Cover Art */}
      <div className={`relative aspect-square bg-gradient-to-br ${gradients[gradientIdx]} flex items-center justify-center`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 w-16 h-16 border border-gold/20 rounded-full" />
          <div className="absolute bottom-4 right-4 w-24 h-24 border border-gold/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-gold/15 rounded-full" />
        </div>

        <div className="text-center z-10">
          <span className="text-4xl">🎵</span>
          <p className="text-xs text-gold/60 mt-2 font-medium tracking-widest uppercase">Raidar Lost</p>
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="w-14 h-14 rounded-full bg-gold flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform"
          >
            {isCurrentlyPlaying ? (
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {beat.featured && (
            <span className="px-2 py-0.5 rounded-full bg-gold/90 text-black text-[10px] font-bold uppercase tracking-wider">Featured</span>
          )}
          {beat.trending && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500/90 text-white text-[10px] font-bold uppercase tracking-wider">Trending</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white text-sm group-hover:text-gold transition-colors truncate">{beat.title}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Raidar Lost</p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 text-[10px] text-neutral-500">
          <span className="px-1.5 py-0.5 rounded bg-dark-surface border border-dark-border">{beat.genre}</span>
          {beat.bpm && <span className="px-1.5 py-0.5 rounded bg-dark-surface border border-dark-border">{beat.bpm} BPM</span>}
          {beat.key && <span className="px-1.5 py-0.5 rounded bg-dark-surface border border-dark-border">{beat.key}</span>}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1">▶ {beat.plays.toLocaleString()}</span>
          <span className="flex items-center gap-1">♡ {beat.likes.toLocaleString()}</span>
          {beat.duration && <span>{formatDuration(beat.duration)}</span>}
        </div>

        {/* Price & Buy */}
        <div className="flex items-center justify-between pt-2 border-t border-dark-border">
          <span className="text-lg font-bold text-gold">${Number(beat.price).toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="px-4 py-1.5 rounded-lg btn-gold text-xs"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
