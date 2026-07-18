import Shell from "@/components/Shell";

export const metadata = {
  title: "Privacy Policy — Raidar Lost",
};

export default function PrivacyPage() {
  return (
    <Shell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Legal</p>
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-neutral-300 leading-relaxed text-sm">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <h2 className="text-lg font-bold text-white mt-8">1. Information We Collect</h2>
          <p>We collect information you provide directly, including name, email address, and payment information when you create an account or make a purchase.</p>
          <h2 className="text-lg font-bold text-white mt-8">2. How We Use Your Information</h2>
          <p>We use your information to process transactions, send order confirmations, provide customer support, and improve our services.</p>
          <h2 className="text-lg font-bold text-white mt-8">3. Data Security</h2>
          <p>We implement industry-standard security measures including encryption, secure sessions, and regular security audits to protect your personal information.</p>
          <h2 className="text-lg font-bold text-white mt-8">4. Cookies</h2>
          <p>We use essential cookies for authentication and session management. No third-party tracking cookies are used without your consent.</p>
          <h2 className="text-lg font-bold text-white mt-8">5. Contact</h2>
          <p>For privacy-related inquiries, contact us at mandapeter242@gmail.com.</p>
        </div>
      </div>
    </Shell>
  );
}
