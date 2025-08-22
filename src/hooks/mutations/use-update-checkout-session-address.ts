import { useMutation } from "@tanstack/react-query";

import { updateCheckoutSessionAddress } from "@/actions/create-checkout-session";

export const getUseUpdateCheckoutSessionAddressMutationKey = (
  checkoutSessionId: string,
) => ["update-checkout-session-address", checkoutSessionId] as const;

export const useUpdateCheckoutSessionAddress = (params: {
  checkoutSessionId: string;
}) => {
  return useMutation({
    mutationKey: getUseUpdateCheckoutSessionAddressMutationKey(
      params.checkoutSessionId,
    ),
    mutationFn: async (shippingAddressId: string) => {
      return updateCheckoutSessionAddress(
        params.checkoutSessionId,
        shippingAddressId,
      );
    },
  });
};
