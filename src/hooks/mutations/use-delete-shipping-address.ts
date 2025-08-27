import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteShippingAddress } from "@/actions/delete-shipping-address";
import { getUserAddressesQueryKey } from "@/hooks/queries/use-user-addresses";

export const getDeleteShippingAddressMutationKey = (addressId: string) =>
  ["delete-shipping-address", addressId] as const;

export const useDeleteShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-shipping-address"],
    mutationFn: (addressId: string) => deleteShippingAddress({ addressId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUserAddressesQueryKey() });
    },
  });
};
