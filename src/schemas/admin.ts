import { z } from "zod";
import { FacilityKind, PriceType, BlockType } from "@prisma/client";

export const CreateFacilityUnitSchema = z.object({
  facilityTypeId: z.string().min(1, "Facility type is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  capacity: z.number().int().positive("Capacity must be positive"),
  photos: z.array(z.string().url()).optional(),
  amenities: z.array(z.string()).optional(),
});

export const UpdateFacilityUnitSchema = CreateFacilityUnitSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const CreateRatePlanSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  priceType: z.nativeEnum(PriceType),
  basePrice: z.number().positive("Price must be positive"),
  currency: z.string().default("PHP"),
  effectiveFrom: z.string().datetime(),
  effectiveTo: z.string().datetime().optional(),
  facilityTypeId: z.string().optional(),
  facilityUnitId: z.string().optional(),
});

export const UpdateRatePlanSchema = CreateRatePlanSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const CreateAvailabilityBlockSchema = z.object({
  facilityUnitId: z.string().min(1, "Facility unit is required"),
  blockType: z.nativeEnum(BlockType),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().optional(),
});

export const UpdateAvailabilityBlockSchema = CreateAvailabilityBlockSchema.partial();

export const FacilityQuerySchema = z.object({
  type: z.nativeEnum(FacilityKind).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  capacity: z.coerce.number().int().positive().optional(),
});

export type CreateFacilityUnitInput = z.infer<typeof CreateFacilityUnitSchema>;
export type UpdateFacilityUnitInput = z.infer<typeof UpdateFacilityUnitSchema>;
export type CreateRatePlanInput = z.infer<typeof CreateRatePlanSchema>;
export type UpdateRatePlanInput = z.infer<typeof UpdateRatePlanSchema>;
export type CreateAvailabilityBlockInput = z.infer<typeof CreateAvailabilityBlockSchema>;
export type UpdateAvailabilityBlockInput = z.infer<typeof UpdateAvailabilityBlockSchema>;
export type FacilityQueryInput = z.infer<typeof FacilityQuerySchema>;
