import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getBuyNowMutationKey = (productVariantId: string) =>
  ["buy-now", productVariantId] as const;

export const useBuyNow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getBuyNowMutationKey(""),
    mutationFn: async ({
      productVariantId,
      quantity,
    }: {
      productVariantId: string;
      quantity: number;
    }) => {
      const result = await addProductToCart({
        productVariantId,
        quantity,
        clearCart: false,
        createTemporaryCart: true,
      });
      return result;
    },
    onSuccess: () => {
      // Não invalidar o carrinho principal quando criar carrinho temporário
    },
  });
};
