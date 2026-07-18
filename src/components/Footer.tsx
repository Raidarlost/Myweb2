"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span className="text-black font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold gold-text tracking-wider">RAIDAR LOST</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Premium Afrobeats instrumentals crafted with passion. Your next hit starts here.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-neutral-400 hover:text-gold hover:border-gold/30 transition-colors text-xs">IG</a>
              <a href="#" className="w-8 h-8 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-neutral-400 hover:text-gold hover:border-gold/30 transition-colors text-xs">YT</a>
              <a href="#" className="w-8 h-8 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-neutral-400 hover:text-gold hover:border-gold/30 transition-colors text-xs">TW</a>
              <a href="#" className="w-8 h-8 rounded-full bg-dark-card border border-dark-border flex items-center justify-center text-neutral-400 hover:text-gold hover:border-gold/30 transition-colors text-xs">SC</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2.5">
              <Link href="/beats" className="block text-sm text-neutral-400 hover:text-gold transition-colors">Browse Beats</Link>
              <Link href="/licensing" className="block text-sm text-neutral-400 hover:text-gold transition-colors">Licensing</Link>
              <Link href="/contact" className="block text-sm text-neutral-400 hover:text-gold transition-colors">Contact Us</Link>
              <Link href="/privacy" className="block text-sm text-neutral-400 hover:text-gold transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="block text-sm text-neutral-400 hover:text-gold transition-colors">Terms of Service</Link>
            </div>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Genres</h4>
            <div className="space-y-2.5">
              <span className="block text-sm text-neutral-400">Afrobeats</span>
              <span className="block text-sm text-neutral-400">Afro-Pop</span>
              <span className="block text-sm text-neutral-400">Afro-Fusion</span>
              <span className="block text-sm text-neutral-400">Amapiano</span>
              <span className="block text-sm text-neutral-400">Dancehall</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact</h4>
            <div className="space-y-2.5">
              <a href="mailto:mandapeter242@gmail.com" className="block text-sm text-neutral-400 hover:text-gold transition-colors">
                mandapeter242@gmail.com
              </a>
              <a href="https://wa.me/265982828614" target="_blank" rel="noopener noreferrer" className="block text-sm text-neutral-400 hover:text-gold transition-colors">
                +265 982 828 614
              </a>
              <p className="text-sm text-neutral-400">Mon - Sat: 9AM - 6PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">© {new Date().getFullYear()} Raidar Lost. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-600">Visa</span>
            <span className="text-xs text-neutral-600">Mastercard</span>
            <span className="text-xs text-neutral-600">PayPal</span>
            <span className="text-xs text-neutral-600">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
