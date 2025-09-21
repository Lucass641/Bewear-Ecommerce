import { useQuery } from "@tanstack/react-query";

import { getUserOrders } from "@/actions/get-user-orders";

export const getUserOrdersQueryKey = () => ["user-orders"];

export const useUserOrders = () => {
  return useQuery({
    queryKey: getUserOrdersQueryKey(),
    queryFn: getUserOrders,
  });
};
