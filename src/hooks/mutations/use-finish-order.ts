import { useMutation, useQueryClient } from "@tanstack/react-query";

import { finishOrder } from "@/actions/finish-order";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getUseFinishOrderMutationKey = () => ["finish-order"];

export const useFinishOrder = (params?: { checkoutSessionId?: string }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getUseFinishOrderMutationKey(),
    mutationFn: async () => {
      await finishOrder({ checkoutSessionId: params?.checkoutSessionId });
    },
    onSuccess: () => {
      try {
        sessionStorage.removeItem("ephemeralCartItemId");
      } catch {}
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
