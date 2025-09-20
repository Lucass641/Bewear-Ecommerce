import { useMutation, useQueryClient } from "@tanstack/react-query";

import { finishOrder } from "@/actions/finish-order";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseFinishOrderMutationKey = () => ["finish-order"];

export const useFinishOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseFinishOrderMutationKey(),
    mutationFn: async ({
      clearCartAfterOrder = true,
      cartId,
      shippingPriceInCents = 0,
    }: {
      clearCartAfterOrder?: boolean;
      cartId?: string;
      shippingPriceInCents?: number;
    } = {}) => {
      return await finishOrder(
        clearCartAfterOrder,
        cartId,
        shippingPriceInCents,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
