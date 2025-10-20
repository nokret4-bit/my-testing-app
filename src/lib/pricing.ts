import { prisma } from "@/lib/prisma";
import { PriceType } from "@prisma/client";
import { differenceInDays, differenceInHours } from "date-fns";

export interface PriceBreakdown {
  subtotal: number;
  taxAmount: number;
  feeAmount: number;
  totalAmount: number;
  currency: string;
  nights?: number;
  slots?: number;
}

const TAX_RATE = 0.12; // 12% VAT
const SERVICE_FEE_RATE = 0.05; // 5% service fee

export async function calculatePrice(
  facilityUnitId: string,
  startDate: Date,
  endDate: Date
): Promise<PriceBreakdown> {
  // Find applicable rate plan (prefer unit-specific, fallback to type-level)
  const unit = await prisma.facilityUnit.findUnique({
    where: { id: facilityUnitId },
    include: {
      facilityType: true,
      ratePlans: {
        where: {
          isActive: true,
          effectiveFrom: { lte: startDate },
          OR: [
            { effectiveTo: null },
            { effectiveTo: { gte: startDate } },
          ],
        },
        orderBy: { effectiveFrom: "desc" },
        take: 1,
      },
    },
  });

  if (!unit) {
    throw new Error("Facility unit not found");
  }

  let ratePlan = unit.ratePlans[0];

  // Fallback to type-level rate plan
  if (!ratePlan) {
    const typeLevelPlan = await prisma.ratePlan.findFirst({
      where: {
        facilityTypeId: unit.facilityTypeId,
        facilityUnitId: null,
        isActive: true,
        effectiveFrom: { lte: startDate },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: startDate } },
        ],
      },
      orderBy: { effectiveFrom: "desc" },
    });

    if (!typeLevelPlan) {
      throw new Error(
        `No rate plan found for facility "${unit.name}" (Type: ${unit.facilityType.name}). ` +
        `Please create a rate plan in the admin panel for this facility type.`
      );
    }

    ratePlan = typeLevelPlan;
  }

  const basePrice = Number(ratePlan.basePrice);
  let subtotal = 0;
  let nights = 0;
  let slots = 0;

  if (ratePlan.priceType === PriceType.PER_NIGHT) {
    nights = differenceInDays(endDate, startDate);
    if (nights < 1) nights = 1;
    subtotal = basePrice * nights;
  } else if (ratePlan.priceType === PriceType.PER_SLOT) {
    // For slots, calculate based on hours (e.g., 4-hour slots)
    const hours = differenceInHours(endDate, startDate);
    slots = Math.ceil(hours / 4); // Assuming 4-hour slots
    if (slots < 1) slots = 1;
    subtotal = basePrice * slots;
  }

  const taxAmount = subtotal * TAX_RATE;
  const feeAmount = subtotal * SERVICE_FEE_RATE;
  const totalAmount = subtotal + taxAmount + feeAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    feeAmount: Math.round(feeAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    currency: ratePlan.currency,
    nights: nights > 0 ? nights : undefined,
    slots: slots > 0 ? slots : undefined,
  };
}
