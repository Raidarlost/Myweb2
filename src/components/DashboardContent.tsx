"use client";

import { useEffect, useState } from "react";
import { useApp } from "./Providers";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  beatId: string;
  price: string;
  licenseType: string;
  title: string;
  coverArt: string | null;
}

interface Order {
  id: string;
  total: string;
  status: string;
  paymentMethod: string | null;
  couponCode: string | null;
  discount: string | null;
  createdAt: string;
  items: OrderItem[];
}

interface Favorite {
  id: string;
  beatId: string;
  title: string;
  price: string;
  genre: string;
  mood: string | null;
}

export default function DashboardContent() {
  const { user, setUser, setShowAuth } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "orders" | "favorites" | "settings">("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders").then(r => r.json()).then(d => { setOrders(d.orders || []); setLoadingOrders(false); });
    fetch("/api/favorites").then(r => r.json()).then(d => setFavorites(d.favorites || []));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
        <p className="text-neutral-400 mb-6">Please sign in to access your dashboard.</p>
        <button onClick={() => setShowAuth("login")} className="px-8 py-3 rounded-lg btn-gold text-sm">Sign In</button>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0);
  const totalBeats = orders.reduce((s, o) => s + o.items.length, 0);

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "📊" },
    { id: "orders" as const, label: "Orders", icon: "📦" },
    { id: "favorites" as const, label: "Favorites", icon: "❤️" },
    { id: "settings" as const, label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
            <span className="text-black font-bold text-xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-sm text-neutral-400">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-dark-border text-neutral-400 text-sm hover:text-red-400 hover:border-red-400/30 transition-colors">
          Logout
        </button>
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

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Total Purchases</p>
              <p className="text-3xl font-bold gold-text">{totalBeats}</p>
            </div>
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Total Spent</p>
              <p className="text-3xl font-bold gold-text">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Favorites</p>
              <p className="text-3xl font-bold gold-text">{favorites.length}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Recent Orders</h3>
            {orders.length === 0 ? (
              <div className="text-center py-10 rounded-2xl bg-dark-card border border-dark-border">
                <p className="text-neutral-400">No orders yet. Start browsing beats!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 rounded-xl bg-dark-card border border-dark-border flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">{order.items.map(i => i.title).join(", ")}</p>
                      <p className="text-xs text-neutral-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gold">${Number(order.total).toFixed(2)}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-6">Order History</h3>
          {loadingOrders ? (
            <p className="text-neutral-400">Loading...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-dark-card border border-dark-border">
              <span className="text-4xl mb-4 block">📦</span>
              <p className="text-neutral-400">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden">
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-dark-border">
                    <div>
                      <p className="text-xs text-neutral-500">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-white mt-1">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{order.status}</span>
                      <span className="text-sm font-bold text-gold">${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                            <span className="text-gold text-sm">♪</span>
                          </div>
                          <div>
                            <p className="text-sm text-white">{item.title}</p>
                            <p className="text-[10px] text-neutral-400">{item.licenseType} License</p>
                          </div>
                        </div>
                        <button className="text-xs text-gold hover:underline">Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "favorites" && (
        <div className="animate-fade-in">
          <h3 className="text-lg font-bold text-white mb-6">Your Favorites</h3>
          {favorites.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-dark-card border border-dark-border">
              <span className="text-4xl mb-4 block">❤️</span>
              <p className="text-neutral-400">No favorites yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <div key={fav.id} className="p-4 rounded-xl bg-dark-card border border-dark-border flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <span className="text-gold">♪</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{fav.title}</p>
                    <p className="text-xs text-neutral-400">{fav.genre} • {fav.mood}</p>
                  </div>
                  <p className="text-sm font-bold text-gold shrink-0">${Number(fav.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "settings" && (
        <div className="animate-fade-in max-w-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Account Settings</h3>
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white">Profile Information</h4>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-neutral-500 text-sm"
                />
              </div>
              <button className="px-6 py-2 rounded-lg btn-gold text-sm">Save Changes</button>
            </div>

            <div className="glass rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white">Change Password</h4>
              <input
                type="password"
                placeholder="Current password"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
              />
              <button className="px-6 py-2 rounded-lg btn-gold text-sm">Update Password</button>
            </div>

            <div className="glass rounded-2xl p-6">
              <h4 className="text-sm font-bold text-red-400 mb-3">Danger Zone</h4>
              <p className="text-xs text-neutral-400 mb-3">Once deleted, your account cannot be recovered.</p>
              <button className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
