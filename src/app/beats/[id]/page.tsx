export default async function BeatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">Beat Details</h1>

      <p className="text-lg">
        Beat ID: <span className="text-yellow-400">{id}</span>
      </p>
    </div>
  );
}
