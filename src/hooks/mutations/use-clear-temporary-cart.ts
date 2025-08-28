import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clearTemporaryCart } from "@/actions/clear-temporary-cart";

import { getUseCartQueryKey } from "../queries/use-cart";

export const getClearTemporaryCartMutationKey = (cartId: string) =>
  ["clear-temporary-cart", cartId] as const;

export const useClearTemporaryCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getClearTemporaryCartMutationKey(""),
    mutationFn: async (cartId: string) => {
      return await clearTemporaryCart({ cartId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
