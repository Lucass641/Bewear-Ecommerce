import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";
import { Size } from "@/components/ui/size-selector";

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
      size,
    }: {
      productVariantId: string;
      quantity: number;
      size: Size;
    }) => {
      if (!size) {
        throw new Error("Tamanho é obrigatório");
      }

      const result = await addProductToCart({
        productVariantId,
        quantity,
        size,
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
