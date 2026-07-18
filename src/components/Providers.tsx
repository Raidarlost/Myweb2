"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

// ── Types ──
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

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

interface CartItem {
  id: string;
  beatId: string;
  licenseType: string;
  title: string;
  price: string;
  coverArt: string | null;
  genre: string;
  bpm: number | null;
  key: string | null;
}

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  cart: CartItem[];
  refreshCart: () => Promise<void>;
  addToCart: (beatId: string) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<void>;
  currentBeat: Beat | null;
  setCurrentBeat: (b: Beat | null) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  showAuth: "login" | "register" | null;
  setShowAuth: (v: "login" | "register" | null) => void;
  showCart: boolean;
  setShowCart: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  const refreshCart = useCallback(async () => {
    try {
      const r = await fetch("/api/cart");
      const d = await r.json();
      setCart(d.items || []);
    } catch {}
  }, []);

  useEffect(() => {
    if (user) refreshCart();
    else setCart([]);
  }, [user, refreshCart]);

  const addToCart = async (beatId: string): Promise<boolean> => {
    if (!user) { setShowAuth("login"); return false; }
    const r = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ beatId }),
    });
    if (r.ok) { await refreshCart(); return true; }
    return false;
  };

  const removeFromCart = async (itemId: string) => {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    await refreshCart();
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser,
        cart, refreshCart, addToCart, removeFromCart,
        currentBeat, setCurrentBeat,
        isPlaying, setIsPlaying,
        showAuth, setShowAuth,
        showCart, setShowCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
