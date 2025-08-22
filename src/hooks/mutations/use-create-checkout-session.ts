import { useMutation } from "@tanstack/react-query";

import { createCheckoutSession } from "@/actions/create-checkout-session";

export const getUseCreateCheckoutSessionMutationKey = (
  productVariantId: string,
  quantity: number,
) => ["create-checkout-session", productVariantId, quantity] as const;

export const useCreateCheckoutSession = (params: {
  productVariantId: string;
  quantity: number;
}) => {
  return useMutation({
    mutationKey: getUseCreateCheckoutSessionMutationKey(
      params.productVariantId,
      params.quantity,
    ),
    mutationFn: async () => {
      const session = await createCheckoutSession({
        productVariantId: params.productVariantId,
        quantity: params.quantity,
      });
      return session;
    },
  });
};
