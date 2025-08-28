import { z } from "zod";

export const clearTemporaryCartSchema = z.object({
  cartId: z.string(),
});

export type ClearTemporaryCartSchema = z.infer<typeof clearTemporaryCartSchema>;
