import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { startOfDay, endOfDay, eachDayOfInterval, differenceInDays } from "date-fns";

export interface AvailabilityCheck {
  available: boolean;
  reason?: string;
}

export async function checkAvailability(
  facilityUnitId: string,
  startDate: Date,
  endDate: Date
): Promise<AvailabilityCheck> {
  // Validate date range (max 1 year)
  const daysDiff = differenceInDays(endDate, startDate);
  if (daysDiff > 365) {
    return {
      available: false,
      reason: "Booking period cannot exceed 365 days",
    };
  }
  if (daysDiff < 0) {
    return {
      available: false,
      reason: "Check-out date must be after check-in date",
    };
  }
  // Check for availability blocks (maintenance/blackout)
  const blocks = await prisma.availabilityBlock.findMany({
    where: {
      facilityUnitId,
      OR: [
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gte: startDate } },
          ],
        },
        {
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: endDate } },
          ],
        },
        {
          AND: [
            { startDate: { gte: startDate } },
            { endDate: { lte: endDate } },
          ],
        },
      ],
    },
  });

  if (blocks.length > 0) {
    return {
      available: false,
      reason: `Facility is blocked: ${blocks[0]?.reason || blocks[0]?.blockType}`,
    };
  }

  // Check for overlapping bookings
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      facilityUnitId,
      status: {
        in: [BookingStatus.AWAITING_PAYMENT, BookingStatus.PAID, BookingStatus.CONFIRMED],
      },
      OR: [
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gt: startDate } },
          ],
        },
        {
          AND: [
            { startDate: { lt: endDate } },
            { endDate: { gte: endDate } },
          ],
        },
        {
          AND: [
            { startDate: { gte: startDate } },
            { endDate: { lte: endDate } },
          ],
        },
      ],
    },
  });

  if (overlappingBookings.length > 0) {
    return {
      available: false,
      reason: "Facility is already booked for the selected dates",
    };
  }

  // Check inventory calendar
  // Use date range query instead of 'in' to avoid bind variable limit
  const inventoryChecks = await prisma.inventoryCalendar.findMany({
    where: {
      facilityUnitId,
      date: {
        gte: startOfDay(startDate),
        lte: startOfDay(endDate),
      },
    },
  });

  const unavailableDates = inventoryChecks.filter((inv) => inv.available <= 0);
  if (unavailableDates.length > 0) {
    return {
      available: false,
      reason: "No inventory available for selected dates",
    };
  }

  return { available: true };
}

export async function getAvailabilityForRange(
  facilityUnitId: string,
  startDate: Date,
  endDate: Date
): Promise<Map<string, boolean>> {
  const dates = eachDayOfInterval({ start: startDate, end: endDate });
  const availabilityMap = new Map<string, boolean>();

  for (const date of dates) {
    const check = await checkAvailability(
      facilityUnitId,
      startOfDay(date),
      endOfDay(date)
    );
    availabilityMap.set(date.toISOString().split("T")[0] || "", check.available);
  }

  return availabilityMap;
}
