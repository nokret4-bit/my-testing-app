import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getServerSession } from "@/lib/auth";
import { CashierScanner } from "@/components/cashier-scanner";

export default async function CashierDashboard() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Only CASHIER, STAFF, and ADMIN can access
  if (
    session.user.role !== "CASHIER" &&
    session.user.role !== "STAFF" &&
    session.user.role !== "ADMIN"
  ) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Cashier Dashboard</h1>
            <p className="text-muted-foreground">
              Scan customer QR codes to verify and check-in guests
            </p>
          </div>

          <CashierScanner />
        </div>
      </main>

      <Footer />
    </div>
  );
}
