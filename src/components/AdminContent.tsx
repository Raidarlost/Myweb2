"use client";

import { useEffect, useState } from "react";
import { useApp } from "./Providers";
import { supabase } from "@/lib/supabase";
interface Stats {
  beats: number;
  users: number;
  orders: number;
  revenue: string;
  messages: number;
}

interface Beat {
  id: string;
  title: string;
  genre: string;
  mood: string | null;
  bpm: number | null;
  key: string | null;
  price: string;
  featured: boolean;
  trending: boolean;
  plays: number;
  purchases: number;
  isActive: boolean;
}

export default function AdminContent() {
  const { user, setShowAuth } = useApp();
  const [tab, setTab] = useState<"overview" | "beats" | "addbeat">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [beats, setBeats] = useState<Beat[]>([]);

  // New beat form
  const [newBeat, setNewBeat] = useState({
    title: "", genre: "Afrobeats", mood: "", bpm: "", key: "", price: "29.99",
    duration: "", licenseType: "Basic", description: "", featured: false, trending: false, tags: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetch("/api/admin/stats").then(r => r.json()).then(d => setStats(d));
    fetch("/api/beats?limit=100").then(r => r.json()).then(d => setBeats(d.beats || []));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
        <button onClick={() => setShowAuth("login")} className="px-8 py-3 rounded-lg btn-gold text-sm">Sign In</button>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl mb-4 block">⛔</span>
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-neutral-400">You don&apos;t have admin privileges.</p>
      </div>
    );
  }

  const handleAddBeat = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!coverFile || !audioFile) {
    alert("Please select a cover image and an MP3 file.");
    return;
  }

  setSaving(true);

  try {
    const coverPath = `covers/${Date.now()}-${coverFile.name}`;
    const audioPath = `audio/${Date.now()}-${audioFile.name}`;

    const { error: coverError } = await supabase.storage
      .from("Beats")
      .upload(coverPath, coverFile);

    if (coverError) throw coverError;

    const { error: audioError } = await supabase.storage
      .from("Beats")
      .upload(audioPath, audioFile);

    if (audioError) throw audioError;

    const coverArt = supabase.storage
      .from("Beats")
      .getPublicUrl(coverPath).data.publicUrl;

    const audioUrl = supabase.storage
      .from("Beats")
      .getPublicUrl(audioPath).data.publicUrl;

    const res = await fetch("/api/admin/beats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newBeat,
        coverArt,
        audioUrl,
      }),
    });

    if (!res.ok) throw new Error("Failed to save beat");

    setSaved(true);

    setNewBeat({
      title: "",
      genre: "Afrobeats",
      mood: "",
      bpm: "",
      key: "",
      price: "29.99",
      duration: "",
      licenseType: "Basic",
      description: "",
      featured: false,
      trending: false,
      tags: "",
    });

    setCoverFile(null);
    setAudioFile(null);

    fetch("/api/beats?limit=100")
      .then(r => r.json())
      .then(d => setBeats(d.beats || []));

    setTimeout(() => setSaved(false), 3000);

  } catch (err) {
    console.error(err);
    alert("Upload failed.");
  } finally {
    setSaving(false);
  }
};
 const handleDeleteBeat = async (id: string) => {
    if (!confirm("Delete this beat?")) return;
    await fetch("/api/admin/beats", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBeats(beats.filter(b => b.id !== id));
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "📊" },
    { id: "beats" as const, label: "Manage Beats", icon: "🎵" },
    { id: "addbeat" as const, label: "Add Beat", icon: "➕" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Admin Panel</p>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              tab === t.id ? "bg-gold/10 text-gold border border-gold/30" : "text-neutral-400 hover:text-white border border-transparent"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && stats && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Total Beats</p>
              <p className="text-3xl font-bold gold-text">{stats.beats}</p>
            </div>
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Users</p>
              <p className="text-3xl font-bold gold-text">{stats.users}</p>
            </div>
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Orders</p>
              <p className="text-3xl font-bold gold-text">{stats.orders}</p>
            </div>
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Revenue</p>
              <p className="text-3xl font-bold gold-text">${Number(stats.revenue).toFixed(2)}</p>
            </div>
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Messages</p>
              <p className="text-3xl font-bold gold-text">{stats.messages}</p>
            </div>
          </div>

          {/* Recent beats list */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Recent Beats</h3>
            <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Title</th>
                      <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">BPM</th>
                      <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Price</th>
                      <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Plays</th>
                      <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beats.slice(0, 10).map((beat) => (
                      <tr key={beat.id} className="border-b border-dark-border/50 hover:bg-dark-hover">
                        <td className="p-4 text-white font-medium">{beat.title}</td>
                        <td className="p-4 text-neutral-400">{beat.bpm || "-"}</td>
                        <td className="p-4 text-gold">${Number(beat.price).toFixed(2)}</td>
                        <td className="p-4 text-neutral-400">{beat.plays}</td>
                        <td className="p-4 text-neutral-400">{beat.purchases}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Beats */}
      {tab === "beats" && (
        <div className="animate-fade-in">
          <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Title</th>
                    <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Genre</th>
                    <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Price</th>
                    <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs text-neutral-400 font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {beats.map((beat) => (
                    <tr key={beat.id} className="border-b border-dark-border/50 hover:bg-dark-hover">
                      <td className="p-4 text-white font-medium">{beat.title}</td>
                      <td className="p-4 text-neutral-400">{beat.genre}</td>
                      <td className="p-4 text-gold">${Number(beat.price).toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {beat.featured && <span className="px-1.5 py-0.5 rounded text-[10px] bg-gold/10 text-gold">Featured</span>}
                          {beat.trending && <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400">Trending</span>}
                          {!beat.featured && !beat.trending && <span className="text-neutral-500 text-xs">—</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteBeat(beat.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Beat */}
      {tab === "addbeat" && (
        <div className="animate-fade-in max-w-2xl">
          {saved && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              ✓ Beat added successfully!
            </div>
          )}

          <form onSubmit={handleAddBeat} className="glass rounded-2xl p-8 space-y-5">
            <h3 className="text-lg font-bold text-white mb-2">Add New Beat</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Title *</label>
                <input type="text" required value={newBeat.title} onChange={(e) => setNewBeat({ ...newBeat, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm" placeholder="Beat title" />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Genre</label>
                <select value={newBeat.genre} onChange={(e) => setNewBeat({ ...newBeat, genre: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm">
                  <option>Afrobeats</option>
                  <option>Afro-Pop</option>
                  <option>Amapiano</option>
                  <option>Afro-Fusion</option>
                  <option>Dancehall</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Mood</label>
                <input type="text" value={newBeat.mood} onChange={(e) => setNewBeat({ ...newBeat, mood: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm" placeholder="e.g., Vibrant" />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">BPM</label>
                <input type="number" value={newBeat.bpm} onChange={(e) => setNewBeat({ ...newBeat, bpm: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm" placeholder="e.g., 110" />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Key</label>
                <input type="text" value={newBeat.key} onChange={(e) => setNewBeat({ ...newBeat, key: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm" placeholder="e.g., C Minor" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Price ($)</label>
                <input type="text" value={newBeat.price} onChange={(e) => setNewBeat({ ...newBeat, price: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Duration (seconds)</label>
                <input type="number" value={newBeat.duration} onChange={(e) => setNewBeat({ ...newBeat, duration: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm" placeholder="e.g., 200" />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">License Type</label>
                <select value={newBeat.licenseType} onChange={(e) => setNewBeat({ ...newBeat, licenseType: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm">
                  <option>Basic</option>
                  <option>Premium</option>
                  <option>Exclusive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Description</label>
              <textarea value={newBeat.description} onChange={(e) => setNewBeat({ ...newBeat, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm resize-none" placeholder="Describe this beat..." />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Tags (comma separated)</label>
              <input type="text" value={newBeat.tags} onChange={(e) => setNewBeat({ ...newBeat, tags: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm" placeholder="afrobeats, chill, summer" />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input type="checkbox" checked={newBeat.featured} onChange={(e) => setNewBeat({ ...newBeat, featured: e.target.checked })} className="accent-gold" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input type="checkbox" checked={newBeat.trending} onChange={(e) => setNewBeat({ ...newBeat, trending: e.target.checked })} className="accent-gold" />
                Trending
              </label>
            </div>
<div>
  <label className="block text-xs text-neutral-400 mb-1.5">
    Cover Art
  </label>
  <input
  type="file"
  accept="image/*"
  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
  className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm"
/>
</div>

<div>
  <label className="block text-xs text-neutral-400 mb-1.5">
    Audio File
  </label>
  <input
  type="file"
  accept=".mp3,audio/*"
  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
  className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm"
/>
</div>
            <button type="submit" disabled={saving} className="w-full py-3 rounded-lg btn-gold text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Add Beat"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
