"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ScanLine,
  Calendar,
  User,
  Home,
  CreditCard,
  Clock
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface BookingInfo {
  id: string;
  code: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  facilityUnit: string;
  facilityType: string;
  startDate: string;
  endDate: string;
  status: string;
  checkedInAt?: string;
  totalAmount: number;
  currency: string;
  canCheckIn: boolean;
  isPaid: boolean;
}

export function CashierScanner() {
  const [bookingCode, setBookingCode] = useState("");
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [checkInMode, setCheckInMode] = useState<"manual" | "qr">("manual");

  const handleVerifyBooking = async () => {
    if (!bookingCode.trim()) {
      setError("Please enter a booking code");
      return;
    }

    setLoading(true);
    setError(null);
    setBookingInfo(null);
    setCheckInSuccess(false);

    try {
      const response = await fetch(`/api/cashier/verify?code=${encodeURIComponent(bookingCode)}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to verify booking");
      }

      const data = await response.json();
      setBookingInfo(data.booking);
    } catch (err: any) {
      setError(err.message || "Failed to verify booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!bookingInfo) return;

    setLoading(true);
    setError(null);

    try {
      // Create QR data from booking info
      const qrPayload = JSON.stringify({
        bookingId: bookingInfo.id,
        bookingCode: bookingInfo.code,
        customerName: bookingInfo.customerName,
        facilityUnit: bookingInfo.facilityUnit,
        checkInDate: bookingInfo.startDate,
      });

      const response = await fetch("/api/cashier/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrData: qrPayload }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to check in");
      }

      const data = await response.json();
      setCheckInSuccess(true);
      
      // Update booking info with check-in time
      setBookingInfo({
        ...bookingInfo,
        checkedInAt: data.booking.checkedInAt,
        canCheckIn: false,
      });
    } catch (err: any) {
      setError(err.message || "Failed to check in guest");
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = async () => {
    if (!qrData.trim()) {
      setError("Please paste QR code data");
      return;
    }

    setLoading(true);
    setError(null);
    setBookingInfo(null);
    setCheckInSuccess(false);

    try {
      const response = await fetch("/api/cashier/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrData }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to process QR code");
      }

      const data = await response.json();
      setCheckInSuccess(true);
      
      // Set booking info from response
      setBookingInfo({
        id: data.booking.id,
        code: data.booking.code,
        customerName: data.booking.customerName,
        customerEmail: data.booking.customerEmail,
        customerPhone: data.booking.customerPhone,
        facilityUnit: data.booking.facilityUnit,
        facilityType: data.booking.facilityType,
        startDate: data.booking.startDate,
        endDate: data.booking.endDate,
        status: data.booking.status,
        checkedInAt: data.booking.checkedInAt,
        totalAmount: 0,
        currency: "PHP",
        canCheckIn: false,
        isPaid: true,
      });
    } catch (err: any) {
      setError(err.message || "Failed to process QR code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBookingCode("");
    setQrData("");
    setBookingInfo(null);
    setError(null);
    setCheckInSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in Method</CardTitle>
          <CardDescription>Choose how to verify the guest</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={checkInMode === "manual" ? "default" : "outline"}
              onClick={() => {
                setCheckInMode("manual");
                handleReset();
              }}
              className="flex-1"
            >
              <Search className="mr-2 h-4 w-4" />
              Manual Code Entry
            </Button>
            <Button
              variant={checkInMode === "qr" ? "default" : "outline"}
              onClick={() => {
                setCheckInMode("qr");
                handleReset();
              }}
              className="flex-1"
            >
              <ScanLine className="mr-2 h-4 w-4" />
              QR Code Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Code Entry */}
      {checkInMode === "manual" && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Booking Code</CardTitle>
            <CardDescription>
              Type the booking code to verify the guest
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookingCode">Booking Code</Label>
              <div className="flex gap-2">
                <Input
                  id="bookingCode"
                  placeholder="e.g., BK-ABC123"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyBooking()}
                  disabled={loading}
                />
                <Button
                  onClick={handleVerifyBooking}
                  disabled={loading || !bookingCode.trim()}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Code Scan */}
      {checkInMode === "qr" && (
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>
              Paste the QR code data from the scanner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qrData">QR Code Data</Label>
              <div className="flex gap-2">
                <Input
                  id="qrData"
                  placeholder="Paste QR code data here..."
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScanQR()}
                  disabled={loading}
                />
                <Button
                  onClick={handleScanQR}
                  disabled={loading || !qrData.trim()}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ScanLine className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Use a QR code scanner app to scan the customer&apos;s QR code, then paste the data here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {checkInSuccess && (
        <Alert className="border-green-500 bg-green-50 text-green-900">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Check-in Successful!</AlertTitle>
          <AlertDescription>
            Guest has been successfully checked in.
          </AlertDescription>
        </Alert>
      )}

      {/* Booking Information */}
      {bookingInfo && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Booking Information</CardTitle>
                <CardDescription>Code: {bookingInfo.code}</CardDescription>
              </div>
              <div className="flex gap-2">
                {bookingInfo.checkedInAt ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Checked In
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    {bookingInfo.status}
                  </Badge>
                )}
                {bookingInfo.isPaid && (
                  <Badge variant="outline" className="border-green-600 text-green-600">
                    <CreditCard className="mr-1 h-3 w-3" />
                    Paid
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Guest Information */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <User className="mr-2 h-4 w-4" />
                Guest Information
              </h3>
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{bookingInfo.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{bookingInfo.customerEmail}</p>
                </div>
                {bookingInfo.customerPhone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{bookingInfo.customerPhone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Facility Information */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Facility Information
              </h3>
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div>
                  <p className="text-sm text-muted-foreground">Facility</p>
                  <p className="font-medium">{bookingInfo.facilityUnit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{bookingInfo.facilityType}</p>
                </div>
              </div>
            </div>

            {/* Booking Dates */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Booking Dates
              </h3>
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">{formatDateTime(new Date(bookingInfo.startDate))}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">{formatDateTime(new Date(bookingInfo.endDate))}</p>
                </div>
              </div>
            </div>

            {/* Check-in Status */}
            {bookingInfo.checkedInAt && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Check-in Time
                </h3>
                <div className="pl-6">
                  <p className="font-medium text-green-600">
                    {formatDateTime(new Date(bookingInfo.checkedInAt))}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {bookingInfo.canCheckIn && !checkInSuccess && (
                <Button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirm Check-in
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleReset}
                variant="outline"
                className={bookingInfo.canCheckIn && !checkInSuccess ? "" : "flex-1"}
              >
                Scan Next Guest
              </Button>
            </div>

            {!bookingInfo.canCheckIn && !bookingInfo.checkedInAt && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Cannot Check In</AlertTitle>
                <AlertDescription>
                  This booking cannot be checked in. Status: {bookingInfo.status}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
