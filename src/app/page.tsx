import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookingChecker } from "@/components/booking-checker";
import { Building2, Calendar, CreditCard, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Welcome to Manuel Resort
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience luxury and comfort at our beautiful resort. Book your rooms, cottages,
              and function halls with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
              <form action="/browse" method="get" className="flex w-full gap-2">
                <Input
                  name="search"
                  placeholder="Search by name or type (e.g. room, cottage)"
                  className="flex-1"
                />
                <Button size="lg" type="submit">Search</Button>
              </form>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Browse All</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Booking Checker Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <BookingChecker />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose ClickStay?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 mb-4 text-primary" />
                  <CardTitle>Real-Time Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Check live availability and book instantly without waiting for confirmation.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CreditCard className="h-10 w-10 mb-4 text-primary" />
                  <CardTitle>Secure Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Pay securely with GCash through PayMongo integration.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Building2 className="h-10 w-10 mb-4 text-primary" />
                  <CardTitle>Multiple Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Choose from rooms, pool cottages, and function halls for any occasion.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 mb-4 text-primary" />
                  <CardTitle>Instant Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Receive booking confirmations and calendar invites via email immediately.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Browse our available facilities and secure your reservation today.
            </p>
            <Link href="/browse">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
