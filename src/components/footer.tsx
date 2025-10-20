import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ClickStay</h3>
            <p className="text-sm text-muted-foreground">
              Manuel Resort Online Booking System. Book your perfect getaway with ease.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="text-muted-foreground hover:text-foreground">
                  Browse Facilities
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-muted-foreground hover:text-foreground">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Manuel Resort, Philippines</li>
              <li>support@clickstay.local</li>
              <li>+63 123 456 7890</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ClickStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
