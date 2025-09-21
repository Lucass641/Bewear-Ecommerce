import { z } from "zod";

export const retryOrderPaymentSchema = z.object({
  orderId: z.string().uuid(),
});

export type RetryOrderPaymentSchema = z.infer<typeof retryOrderPaymentSchema>;
