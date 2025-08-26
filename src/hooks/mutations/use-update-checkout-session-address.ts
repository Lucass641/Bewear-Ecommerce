import { useMutation } from "@tanstack/react-query";

import { updateNewCartAddress } from "@/actions/create-new-cart";

export const getUseUpdateNewCartAddressMutationKey = (
  checkoutSessionId: string,
) => ["update-new-cart-address", checkoutSessionId] as const;

export const useUpdateNewCartAddress = (params: {
  checkoutSessionId: string;
}) => {
  return useMutation({
    mutationKey: getUseUpdateNewCartAddressMutationKey(
      params.checkoutSessionId,
    ),
    mutationFn: async (shippingAddressId: string) => {
      return updateNewCartAddress(params.checkoutSessionId, shippingAddressId);
    },
  });
};
