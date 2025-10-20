import { z } from "zod";

export const BookingQuoteSchema = z.object({
  unitId: z.string().min(1, "Unit ID is required"),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
});

export const CreateBookingSchema = z.object({
  unitId: z.string().min(1, "Unit ID is required"),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().optional(),
  specialRequests: z.string().optional(),
  holdId: z.string().optional(),
});

export const CancelBookingSchema = z.object({
  reason: z.string().optional(),
});

export type BookingQuoteInput = z.infer<typeof BookingQuoteSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type CancelBookingInput = z.infer<typeof CancelBookingSchema>;
