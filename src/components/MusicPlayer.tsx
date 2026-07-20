"use client";

import { useApp } from "./Providers";
import { useState, useEffect, useRef } from "react";

export default function MusicPlayer() {
  const { currentBeat, isPlaying, setIsPlaying } = useApp();
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
 useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = volume / 100;
  }
}, [volume]);

 useEffect(() => {
  if (!currentBeat?.audioUrl) return;

  if (!audioRef.current) {
    audioRef.current = new Audio(currentBeat.audioUrl);
  }

  const audio = audioRef.current;

  if (isPlaying) {
    audio.play();
  } else {
    audio.pause();
  }

  const updateProgress = () => {
    if (audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  audio.addEventListener("timeupdate", updateProgress);

  return () => {
    audio.removeEventListener("timeupdate", updateProgress);
  };
}, [isPlaying, currentBeat]);

  // Reset progress when changing beats
  useEffect(() => {
    setProgress(0);
  }, [currentBeat?.id]);

  if (!currentBeat) return null;

  const formatTime = (pct: number, total: number) => {
    const s = Math.floor((pct / 100) * total);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const totalDuration = currentBeat.duration || 200;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] glass border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Beat Info */}
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0 w-48 sm:w-56">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shrink-0">
            <span className="text-gold text-sm">🎵</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentBeat.title}</p>
            <p className="text-[10px] text-neutral-400">Raidar Lost</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-gold flex items-center justify-center hover:bg-gold-light transition-colors"
            >
              {isPlaying ? (
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] text-neutral-500 w-10 text-right">{formatTime(progress, totalDuration)}</span>
            <div className="flex-1 h-1 bg-dark-border rounded-full relative cursor-pointer group"
              onClick={(e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = Math.max(
    0,
    Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
  );

  setProgress(pct);

  if (audioRef.current && audioRef.current.duration) {
    audioRef.current.currentTime =
      (pct / 100) * audioRef.current.duration;
  }
}}
            >
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-[10px] text-neutral-500 w-10">
              {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Volume (desktop only) */}
        <div className="hidden sm:flex items-center gap-2 w-32">
          <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-dark-border rounded-full appearance-none cursor-pointer accent-gold"
          />
        </div>
      </div>
    </div>
  );
}
