"use client";

import { useState } from "react";
import { useApp } from "./Providers";
import { useRouter } from "next/navigation";

export default function CheckoutContent() {
  const { cart, user, setShowAuth, refreshCart } = useApp();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const router = useRouter();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl mb-4 block">🔒</span>
        <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
        <p className="text-neutral-400 mb-6">Please sign in to complete your purchase.</p>
        <button onClick={() => setShowAuth("login")} className="px-8 py-3 rounded-lg btn-gold text-sm">
          Sign In
        </button>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Payment Successful!</h2>
        <p className="text-neutral-400 mb-8">Your beats are now available in your dashboard for download.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="px-8 py-3 rounded-lg btn-gold text-sm">
            Go to Dashboard
          </button>
          <button onClick={() => router.push("/beats")} className="px-8 py-3 rounded-lg border border-dark-border text-neutral-300 text-sm hover:text-gold transition-colors">
            Browse More Beats
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const total = subtotal - discount;

  const applyCoupon = async () => {
    // Demo: WELCOME20 gives 20% off
    if (coupon.toUpperCase() === "WELCOME20") {
      setDiscount(subtotal * 0.2);
      setCouponApplied(true);
    }
  };

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod, couponCode: couponApplied ? coupon : undefined }),
      });
      if (res.ok) {
        setComplete(true);
        await refreshCart();
      }
    } catch {
      // handle error
    }
    setProcessing(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-5xl mb-4 block">🛒</span>
        <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
        <p className="text-neutral-400 mb-6">Add some beats to your cart first.</p>
        <button onClick={() => router.push("/beats")} className="px-8 py-3 rounded-lg btn-gold text-sm">
          Browse Beats
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Secure Checkout</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Complete Your Purchase</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Payment Methods */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "card", label: "Card", icon: "💳" },
                { id: "paypal", label: "PayPal", icon: "🅿️" },
                { id: "apple", label: "Apple Pay", icon: "🍎" },
                { id: "google", label: "Google Pay", icon: "🔵" },
              ].map((pm) => (
                <button
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    paymentMethod === pm.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-dark-border text-neutral-400 hover:border-gold/30"
                  }`}
                >
                  <span className="text-xl block mb-1">{pm.icon}</span>
                  <span className="text-xs">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Details (demo) */}
          {paymentMethod === "card" && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white mb-2">Card Details</h3>
              <p className="text-xs text-gold/70 mb-3 bg-gold/5 rounded-lg p-2 border border-gold/10">
                🔒 Demo mode — no real charges will be made
              </p>
              <input
                type="text"
                placeholder="Card number"
                className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
                />
              </div>
            </div>
          )}

          {/* Coupon */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-3">Promo Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                disabled={couponApplied}
                className="flex-1 px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm disabled:opacity-50"
              />
              <button
                onClick={applyCoupon}
                disabled={couponApplied || !coupon}
                className="px-4 py-2.5 rounded-lg border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-colors disabled:opacity-50"
              >
                {couponApplied ? "Applied ✓" : "Apply"}
              </button>
            </div>
            {couponApplied && <p className="text-xs text-green-400 mt-2">Coupon WELCOME20 applied — 20% off!</p>}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-6 sticky top-20">
            <h3 className="text-sm font-bold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-gold text-xs">♪</span>
                    <span className="text-neutral-300 truncate">{item.title}</span>
                  </div>
                  <span className="text-white font-medium shrink-0">${Number(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dark-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Discount</span>
                  <span className="text-green-400">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm pt-2 border-t border-dark-border">
                <span className="text-white font-bold">Total</span>
                <span className="text-xl font-bold gold-text">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing}
              className="w-full mt-6 py-3.5 rounded-lg btn-gold text-sm disabled:opacity-50"
            >
              {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>

            <p className="text-[10px] text-neutral-500 mt-3 text-center">
              🔒 Your payment is secured with SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
