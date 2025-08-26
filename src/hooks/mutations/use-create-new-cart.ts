import { useMutation } from "@tanstack/react-query";

import { createNewCart } from "@/actions/create-new-cart";

export const getUseCreateNewCartMutationKey = (
  productVariantId: string,
  quantity: number,
) => ["create-new-cart", productVariantId, quantity] as const;

export const useCreateNewCart = (params: {
  productVariantId: string;
  quantity: number;
}) => {
  return useMutation({
    mutationKey: getUseCreateNewCartMutationKey(
      params.productVariantId,
      params.quantity,
    ),
    mutationFn: async () => {
      const session = await createNewCart({
        productVariantId: params.productVariantId,
        quantity: params.quantity,
      });
      return session;
    },
  });
};
