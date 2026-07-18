"use client";

import { useState } from "react";
import { useApp } from "./Providers";

export default function AuthModal() {
  const { showAuth, setShowAuth, setUser } = useApp();
  const [mode, setMode] = useState<"login" | "register">(showAuth || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!showAuth) return null;

  const currentMode = showAuth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = currentMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = currentMode === "login"
        ? { email, password }
        : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setUser(data.user);
      setShowAuth(null);
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowAuth(null)}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md glass rounded-2xl p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setShowAuth(null)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mb-3">
            <span className="text-black font-bold text-lg">R</span>
          </div>
          <h2 className="text-xl font-bold gold-text">
            {currentMode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            {currentMode === "login" ? "Sign in to your account" : "Join the Raidar Lost community"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentMode === "register" && (
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-neutral-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg btn-gold text-sm disabled:opacity-50"
          >
            {loading ? "Please wait..." : currentMode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-400 mt-4">
          {currentMode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setShowAuth(currentMode === "login" ? "register" : "login")}
            className="text-gold hover:underline"
          >
            {currentMode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
