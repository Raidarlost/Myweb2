"use client";

import { useState } from "react";

export default function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setSent(true); setForm({ name: "", email: "", subject: "", message: "" }); }
    setLoading(false);
  };

  const faqs = [
    { q: "How do I download my beats?", a: "After purchase, beats are instantly available in your dashboard under Downloads." },
    { q: "What licenses do you offer?", a: "We offer Basic, Premium, and Exclusive licenses. Visit our licensing page for details." },
    { q: "Can I get a custom beat?", a: "Yes! Contact us with your requirements and we'll create something unique for you." },
    { q: "Do you offer refunds?", a: "Due to the digital nature of our products, refunds are handled on a case-by-case basis." },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-14">
        <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Get In Touch</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-neutral-400 max-w-lg mx-auto">Have a question or want to work together? We&apos;d love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="glass rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">✉️</span>
              <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-neutral-400 text-sm">We&apos;ll get back to you as soon as possible.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm text-gold hover:underline">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg bg-dark-surface border border-dark-border text-white placeholder-neutral-500 text-sm resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg btn-gold text-sm disabled:opacity-50">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-2xl mb-2 block">📧</span>
              <h3 className="text-sm font-bold text-white mb-1">Email</h3>
              <a href="mailto:mandapeter242@gmail.com" className="text-xs text-gold hover:underline">mandapeter242@gmail.com</a>
            </div>
            <div className="p-5 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-2xl mb-2 block">📱</span>
              <h3 className="text-sm font-bold text-white mb-1">WhatsApp</h3>
              <a href="https://wa.me/265982828614" target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline">+265 982 828 614</a>
            </div>
            <div className="p-5 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-2xl mb-2 block">🕐</span>
              <h3 className="text-sm font-bold text-white mb-1">Business Hours</h3>
              <p className="text-xs text-neutral-400">Mon - Sat: 9AM - 6PM</p>
            </div>
            <div className="p-5 rounded-xl bg-dark-card border border-dark-border">
              <span className="text-2xl mb-2 block">🌍</span>
              <h3 className="text-sm font-bold text-white mb-1">Location</h3>
              <p className="text-xs text-neutral-400">Malawi, Africa</p>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/265982828614"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="text-sm font-bold text-green-400">Chat on WhatsApp</h3>
                <p className="text-xs text-green-400/70">Get instant replies for your inquiries</p>
              </div>
            </div>
          </a>

          {/* FAQ */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl bg-dark-card border border-dark-border overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="text-sm text-white font-medium">{faq.q}</span>
                    <span className="text-gold text-sm ml-2">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
