import { useMutation, useQueryClient } from "@tanstack/react-query";

import { retryOrderPayment } from "@/actions/retry-order-payment";

import { getUserOrdersQueryKey } from "../queries/use-user-orders";

export const getRetryOrderPaymentMutationKey = () => ["retry-order-payment"];

export const useRetryOrderPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getRetryOrderPaymentMutationKey(),
    mutationFn: retryOrderPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUserOrdersQueryKey() });
    },
  });
};
