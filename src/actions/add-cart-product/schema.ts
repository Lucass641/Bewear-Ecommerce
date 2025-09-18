import { z } from "zod";

export const addProductToCartSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().min(1),
  size: z.enum(["P", "M", "G", "GG", "ÚNICO", "37", "38", "39", "40", "41"]),
  clearCart: z.boolean().optional().default(false),
  createTemporaryCart: z.boolean().optional().default(false),
});

export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>;
