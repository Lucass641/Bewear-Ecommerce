import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { UpdateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";

import { getUseCartQueryKey } from "../queries/use-cart";
import { getUseTemporaryCartQueryKey } from "../queries/use-temporary-cart";

export const getUpdateCartShippingAddressMutationKey = () => [
  "update-cart-shipping-address",
];

export const useUpdateCartShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getUpdateCartShippingAddressMutationKey(),
    mutationFn: (data: UpdateCartShippingAddressSchema) =>
      updateCartShippingAddress(data),
    onSuccess: (_, variables) => {
      // Invalidar carrinho principal
      queryClient.invalidateQueries({
        queryKey: getUseCartQueryKey(),
      });

      // Se foi atualizado um carrinho temporário, invalidar também
      if (variables.cartId) {
        queryClient.invalidateQueries({
          queryKey: getUseTemporaryCartQueryKey(variables.cartId),
        });
      }
    },
  });
};
