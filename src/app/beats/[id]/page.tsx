import { db } from "@/db";
import { beats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function BeatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [beat] = await db
    .select()
    .from(beats)
    .where(eq(beats.id, id))
    .limit(1);

  if (!beat) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-bold mb-6">{beat.title}</h1>

      {beat.coverArt && (
        <img
          src={beat.coverArt}
          alt={beat.title}
          className="w-full max-w-md rounded-xl mb-6"
        />
      )}

      {beat.audioUrl && (
        <audio controls className="w-full mb-6">
          <source src={beat.audioUrl} type="audio/mpeg" />
        </audio>
      )}

      <div className="space-y-2">
        <p><strong>Genre:</strong> {beat.genre}</p>
        <p><strong>Mood:</strong> {beat.mood}</p>
        <p><strong>BPM:</strong> {beat.bpm}</p>
        <p><strong>Key:</strong> {beat.key}</p>
        <p><strong>Price:</strong> ${beat.price}</p>
        <p><strong>Description:</strong> {beat.description}</p>
      </div>
    </div>
  );
}
