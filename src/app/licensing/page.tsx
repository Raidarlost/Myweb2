import Shell from "@/components/Shell";

export const metadata = {
  title: "Licensing — Raidar Lost",
  description: "Choose the right license for your project. Basic, Premium, or Exclusive options available.",
};

export default function LicensingPage() {
  return (
    <Shell>
      <LicensingContent />
    </Shell>
  );
}

function LicensingContent() {
  const licenses = [
    {
      name: "Basic",
      price: "$29.99",
      color: "border-neutral-600",
      features: [
        "MP3 File (High Quality)",
        "Use on 1 song",
        "Up to 10,000 streams",
        "Non-exclusive rights",
        "Must credit producer",
        "For personal & streaming use",
      ],
    },
    {
      name: "Premium",
      price: "$59.99",
      color: "border-gold",
      popular: true,
      features: [
        "WAV + MP3 Files",
        "Use on 2 songs",
        "Up to 100,000 streams",
        "Non-exclusive rights",
        "Producer credit appreciated",
        "Music videos allowed",
        "Radio play allowed",
      ],
    },
    {
      name: "Exclusive",
      price: "$299.99",
      color: "border-purple-500",
      features: [
        "WAV + MP3 + Stems",
        "Unlimited songs",
        "Unlimited streams",
        "Full exclusive rights",
        "No credit required",
        "Commercial use allowed",
        "Beat removed from store",
        "Full ownership transfer",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-14">
        <p className="text-xs text-gold uppercase tracking-[0.2em] mb-2">Choose Your Plan</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Beat Licensing</h1>
        <p className="text-neutral-400 max-w-lg mx-auto">Simple, transparent licensing terms. Pick the license that fits your needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {licenses.map((lic) => (
          <div
            key={lic.name}
            className={`relative rounded-2xl bg-dark-card border-2 ${lic.color} p-8 transition-transform hover:-translate-y-1 ${lic.popular ? "ring-1 ring-gold/30" : ""}`}
          >
            {lic.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-black text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-white mb-1">{lic.name}</h3>
            <p className="text-3xl font-black gold-text mb-6">{lic.price}</p>
            <ul className="space-y-3 mb-8">
              {lic.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-neutral-300">
                  <span className="text-gold mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${lic.popular ? "btn-gold" : "border border-dark-border text-white hover:border-gold/30 hover:text-gold"}`}>
              Select {lic.name}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">License FAQ</h2>
        <div className="space-y-4">
          {[
            { q: "Can I upgrade my license later?", a: "Yes! Contact us to upgrade from Basic to Premium or Exclusive. You'll only pay the difference." },
            { q: "What happens with exclusive licenses?", a: "Once purchased exclusively, the beat is removed from the store. You get full ownership and all track files including stems." },
            { q: "Can I use beats for commercial projects?", a: "Premium and Exclusive licenses allow commercial use. Basic licenses are for personal and streaming use only." },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-dark-card border border-dark-border">
              <h4 className="text-sm font-bold text-white mb-2">{item.q}</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
