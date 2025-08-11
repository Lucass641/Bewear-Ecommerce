import z from "zod";

export const removeProductFromCartSchema = z.object({
  CartItemId: z.uuid(),
});
