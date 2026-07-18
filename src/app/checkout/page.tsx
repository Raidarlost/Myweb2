import Shell from "@/components/Shell";
import CheckoutContent from "@/components/CheckoutContent";

export const metadata = {
  title: "Checkout — Raidar Lost",
  description: "Complete your purchase of premium Afrobeats instrumentals.",
};

export default function CheckoutPage() {
  return (
    <Shell>
      <CheckoutContent />
    </Shell>
  );
}
