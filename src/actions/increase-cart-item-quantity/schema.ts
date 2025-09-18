import { z } from "zod";

export const increaseCartItemQuantitySchema = z.object({
  cartItemId: z.string(),
});

export type IncreaseCartItemQuantitySchema = z.infer<
  typeof increaseCartItemQuantitySchema
>;
