import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().int().positive(),
});

export type CreateCheckoutSessionSchema = z.infer<
  typeof createCheckoutSessionSchema
>;

export const updateCheckoutSessionAddressSchema = z.object({
  id: z.string(),
  shippingAddressId: z.string(),
});

export type UpdateCheckoutSessionAddressSchema = z.infer<
  typeof updateCheckoutSessionAddressSchema
>;
