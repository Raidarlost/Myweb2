import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-dark">
      <div className="text-center">
        <div className="text-8xl font-black gold-text mb-4">404</div>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-neutral-400 mb-8 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="px-8 py-3 rounded-full btn-gold text-sm uppercase tracking-wider inline-block">
          Go Home
        </Link>
      </div>
    </div>
  );
}
