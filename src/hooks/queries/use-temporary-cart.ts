import { useQuery } from "@tanstack/react-query";

import { getTemporaryCart } from "@/actions/get-temporary-cart";

export const getUseTemporaryCartQueryKey = (cartId: string) =>
  ["temporary-cart", cartId] as const;

export const useTemporaryCart = (cartId: string) => {
  return useQuery({
    queryKey: getUseTemporaryCartQueryKey(cartId),
    queryFn: () => getTemporaryCart(cartId),
    enabled: !!cartId,
  });
};
