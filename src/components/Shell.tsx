"use client";

import { ReactNode } from "react";
import Providers from "./Providers";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "./AuthModal";
import CartSidebar from "./CartSidebar";
import MusicPlayer from "./MusicPlayer";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <Navbar />
      <AuthModal />
      <CartSidebar />
      <main className="pt-16 pb-20 min-h-screen">{children}</main>
      <MusicPlayer />
      <Footer />
    </Providers>
  );
}
