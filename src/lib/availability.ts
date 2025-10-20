import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { eachDayOfInterval, differenceInDays } from "date-fns";

export async function checkAvailability(
  facilityId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  // Validate date range (max 1 year)
  const daysDiff = differenceInDays(endDate, startDate);
  if (daysDiff > 365 || daysDiff < 0) {
    return false;
  }

  // Check for overlapping bookings
  const overlappingBookings = await prisma.booking.findMany({
    where: {
      facilityId,
      status: {
        in: [BookingStatus.CONFIRMED],
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

  return overlappingBookings.length === 0;
}

export async function getAvailabilityCalendar(
  facilityId: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ date: Date; available: boolean }>> {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const availability = [];

  for (const day of days) {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const isAvailable = await checkAvailability(facilityId, day, nextDay);
    availability.push({
      date: day,
      available: isAvailable,
    });
  }

  return availability;
}
