import { z } from "zod";

export const updateCartShippingAddressSchema = z.object({
  shippingAddressId: z.uuid(),
  cartId: z.uuid().optional(),
});

export type UpdateCartShippingAddressSchema = z.infer<
  typeof updateCartShippingAddressSchema
>;
