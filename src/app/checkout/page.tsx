"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NavbarClient } from "@/components/navbar-client";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const unitId = searchParams.get("unitId");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [quote, setQuote] = useState<{ totalAmount: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const handleGetQuote = async () => {
    console.log("[DEBUG] handleGetQuote called", { unitId, startDate, endDate });
    if (!unitId || !startDate || !endDate) {
      console.log("[DEBUG] Missing required fields");
      toast({
        title: "Missing information",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    setQuoteLoading(true);
    try {
      console.log("[DEBUG] Fetching quote...");
      const response = await fetch("/api/bookings/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        }),
      });

      console.log("[DEBUG] Quote response status:", response.status);
      if (!response.ok) {
        const error = await response.json();
        console.error("[DEBUG] Quote error:", error);
        throw new Error(error.error || "Failed to get quote");
      }

      const data = await response.json();
      console.log("[DEBUG] Quote received:", data);
      setQuote(data);
    } catch (error) {
      console.error("[DEBUG] Quote fetch failed:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get quote",
        variant: "destructive",
      });
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[DEBUG] handleSubmit called", { quote, customerName, customerEmail });
    if (!quote) {
      console.log("[DEBUG] No quote available, button should be disabled");
      toast({
        title: "Get a quote first",
        description: "Please check availability and pricing before booking",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create booking
      console.log("[DEBUG] Creating booking...");
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          customerName,
          customerEmail,
          customerPhone,
          specialRequests,
        }),
      });

      console.log("[DEBUG] Booking response status:", bookingResponse.status);
      if (!bookingResponse.ok) {
        const error = await bookingResponse.json();
        console.error("[DEBUG] Booking error:", error);
        throw new Error(error.error || "Failed to create booking");
      }

      const booking = await bookingResponse.json();
      console.log("[DEBUG] Booking created:", booking);

      // Create payment
      console.log("[DEBUG] Creating payment...");
      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          returnUrl: `${window.location.origin}/booking/${booking.code}`,
        }),
      });

      console.log("[DEBUG] Payment response status:", paymentResponse.status);
      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        console.error("[DEBUG] Payment error:", error);
        throw new Error(error.message || "Failed to create payment");
      }

      const payment = await paymentResponse.json();
      console.log("[DEBUG] Payment created:", payment);

      // Redirect to payment
      if (payment.checkoutUrl) {
        console.log("[DEBUG] Redirecting to:", payment.checkoutUrl);
        window.location.href = payment.checkoutUrl;
      } else {
        console.log("[DEBUG] No checkout URL, redirecting to booking page");
        router.push(`/booking/${booking.code}`);
      }
    } catch (error) {
      console.error("[DEBUG] Submit failed:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("[DEBUG] useEffect triggered", { startDate, endDate });
    if (startDate && endDate) {
      handleGetQuote();
    }
  }, [startDate, endDate]);

  if (!unitId) {
    return (
      <div className="flex min-h-screen flex-col">
        <NavbarClient />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Invalid Request</CardTitle>
              <CardDescription>No facility selected for booking</CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavbarClient />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Complete Your Booking</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Check-in Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Check-out Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                {quote && (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(quote.totalAmount, quote.currency)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number (Optional)</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Input
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full" 
              disabled={loading || !quote}
              onClick={() => console.log("[DEBUG] Button clicked", { loading, quote, disabled: loading || !quote })}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
