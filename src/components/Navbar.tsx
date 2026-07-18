"use client";

import Link from "next/link";
import { useState } from "react";
import { useApp } from "./Providers";

export default function Navbar() {
  const { user, cart, setShowAuth, setShowCart } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <span className="text-black font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold gold-text tracking-wider">RAIDAR LOST</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-neutral-300 hover:text-gold transition-colors">Home</Link>
            <Link href="/beats" className="text-sm text-neutral-300 hover:text-gold transition-colors">Beats</Link>
            <Link href="/licensing" className="text-sm text-neutral-300 hover:text-gold transition-colors">Licensing</Link>
            <Link href="/contact" className="text-sm text-neutral-300 hover:text-gold transition-colors">Contact</Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 text-neutral-300 hover:text-gold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 text-sm text-gold hover:bg-gold/10 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs font-bold text-gold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <button
                onClick={() => setShowAuth("login")}
                className="px-4 py-1.5 rounded-full btn-gold text-sm"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-neutral-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-neutral-300 hover:text-gold transition-colors">Home</Link>
              <Link href="/beats" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-neutral-300 hover:text-gold transition-colors">Beats</Link>
              <Link href="/licensing" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-neutral-300 hover:text-gold transition-colors">Licensing</Link>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-neutral-300 hover:text-gold transition-colors">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
