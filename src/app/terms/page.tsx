import Shell from "@/components/Shell";

export const metadata = {
  title: "Terms of Service — Raidar Lost",
};

export default function TermsPage() {
  return (
    <Shell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Legal</p>
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-neutral-300 leading-relaxed text-sm">
          <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          <h2 className="text-lg font-bold text-white mt-8">1. Acceptance of Terms</h2>
          <p>By accessing and using Raidar Lost, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-lg font-bold text-white mt-8">2. Licensing</h2>
          <p>All beats purchased from Raidar Lost are licensed, not sold. The specific terms of your license depend on the license type purchased (Basic, Premium, or Exclusive).</p>
          <h2 className="text-lg font-bold text-white mt-8">3. Payments</h2>
          <p>All prices are in USD. Payments are processed securely through our payment partners. All sales are final for digital products.</p>
          <h2 className="text-lg font-bold text-white mt-8">4. Intellectual Property</h2>
          <p>All beats, content, and branding on Raidar Lost are the intellectual property of Raidar Lost unless otherwise stated.</p>
          <h2 className="text-lg font-bold text-white mt-8">5. Refund Policy</h2>
          <p>Due to the digital nature of our products, refunds are handled on a case-by-case basis. Contact us within 48 hours of purchase if you experience issues.</p>
          <h2 className="text-lg font-bold text-white mt-8">6. Contact</h2>
          <p>For any questions about these terms, contact us at mandapeter242@gmail.com.</p>
        </div>
      </div>
    </Shell>
  );
}
