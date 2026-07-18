"use client";

import { useState } from "react";
import { useApp } from "./Providers";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
  const { showCart, setShowCart, cart, removeFromCart } = useApp();
  const router = useRouter();

  if (!showCart) return null;

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <div className="fixed inset-0 z-[90]" onClick={() => setShowCart(false)}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-md glass border-l border-dark-border animate-fade-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <h2 className="text-lg font-bold gold-text">Shopping Cart</h2>
          <button onClick={() => setShowCart(false)} className="text-neutral-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p className="text-neutral-400">Your cart is empty</p>
              <button
                onClick={() => { setShowCart(false); router.push("/beats"); }}
                className="mt-4 text-sm text-gold hover:underline"
              >
                Browse Beats →
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-dark-surface border border-dark-border">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center shrink-0">
                  <span className="text-gold text-lg">♪</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.title}</p>
                  <p className="text-xs text-neutral-400">{item.licenseType} License</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gold">${Number(item.price).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-dark-border space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Subtotal</span>
              <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { setShowCart(false); router.push("/checkout"); }}
              className="w-full py-3 rounded-lg btn-gold text-sm"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
