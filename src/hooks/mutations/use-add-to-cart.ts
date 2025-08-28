import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getAddToCartMutationKey = (productVariantId: string) =>
  ["add-to-cart", productVariantId] as const;

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getAddToCartMutationKey(""),
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
        createTemporaryCart: false,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
