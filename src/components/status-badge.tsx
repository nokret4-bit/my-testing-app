import { BookingStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: BookingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<
    BookingStatus,
    { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
  > = {
    AWAITING_PAYMENT: { variant: "outline", label: "Awaiting Payment" },
    PAID: { variant: "default", label: "Paid" },
    CONFIRMED: { variant: "default", label: "Confirmed" },
    CANCELLED: { variant: "destructive", label: "Cancelled" },
    COMPLETED: { variant: "secondary", label: "Completed" },
  };

  const config = variants[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
