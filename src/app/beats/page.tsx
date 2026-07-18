import Shell from "@/components/Shell";
import BeatsContent from "@/components/BeatsContent";

export const metadata = {
  title: "Browse Beats — Raidar Lost",
  description: "Browse premium Afrobeats instrumentals. Filter by genre, mood, BPM, and key.",
};

export default function BeatsPage() {
  return (
    <Shell>
      <BeatsContent />
    </Shell>
  );
}
