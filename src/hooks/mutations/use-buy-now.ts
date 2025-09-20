import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addProductToCart } from "@/actions/add-cart-product";
import { Size } from "@/components/ui/size-selector";

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
        createTemporaryCart: true,
      });
      return result;
    },
    onSuccess: () => {},
  });
};
