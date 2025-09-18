import { useMutation, useQueryClient } from "@tanstack/react-query";

import { increaseCartItemQuantity } from "@/actions/increase-cart-item-quantity";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getIncreaseCartItemMutationKey = (cartItemId: string) =>
  ["increase-cart-item-quantity", cartItemId] as const;

export const useIncreaseCartItem = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getIncreaseCartItemMutationKey(cartItemId),
    mutationFn: () =>
      increaseCartItemQuantity({
        cartItemId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
