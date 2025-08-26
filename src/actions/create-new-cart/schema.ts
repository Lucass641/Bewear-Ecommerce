import { z } from "zod";

export const createNewCartSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().int().positive(),
});

export type CreateNewCartSchema = z.infer<
  typeof createNewCartSchema
>;

export const updateNewCartAddressSchema = z.object({
  id: z.string(),
  shippingAddressId: z.string(),
});

export type UpdateNewCartAddressSchema = z.infer<
  typeof updateNewCartAddressSchema
>;
