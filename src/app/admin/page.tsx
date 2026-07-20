import Shell from "@/components/Shell";
import AdminContent from "@/components/AdminContent";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Dashboard — Raidar Lost",
  description: "Manage your beat store, users, and orders.",
};

export default function AdminPage() {
  return (
    <Shell>
      <AdminContent />
    </Shell>
  );
}
