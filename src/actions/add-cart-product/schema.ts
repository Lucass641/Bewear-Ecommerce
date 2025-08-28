import { z } from "zod";

export const addProductToCartSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().min(1),
  clearCart: z.boolean().optional().default(false),
  createTemporaryCart: z.boolean().optional().default(false),
});

export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>;
