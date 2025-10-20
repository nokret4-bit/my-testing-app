import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Building2, User } from "lucide-react";

export async function Navbar() {
  const session = await getServerSession();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Building2 className="h-6 w-6" />
          <span>ClickStay</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/browse">
            <Button variant="ghost">Browse Facilities</Button>
          </Link>

          {session?.user ? (
            <>
              {/* Only show My Bookings for regular guests, not admin/staff */}
              {session.user.role === "GUEST" && (
                <Link href="/bookings">
                  <Button variant="ghost">My Bookings</Button>
                </Link>
              )}
              {(session.user.role === "STAFF" || session.user.role === "ADMIN") && (
                <Link href="/cashier">
                  <Button variant="outline">Cashier Dashboard</Button>
                </Link>
              )}
              {(session.user.role === "ADMIN" || session.user.role === "STAFF") && (
                <Link href="/admin">
                  <Button variant="outline">Admin Dashboard</Button>
                </Link>
              )}
              <Link href="/api/auth/signout">
                <Button variant="ghost">
                  <User className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
