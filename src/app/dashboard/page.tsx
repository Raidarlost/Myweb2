import Shell from "@/components/Shell";
import DashboardContent from "@/components/DashboardContent";

export const metadata = {
  title: "Dashboard — Raidar Lost",
  description: "Manage your purchases, favorites, and account settings.",
};

export default function DashboardPage() {
  return (
    <Shell>
      <DashboardContent />
    </Shell>
  );
}
