"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { getUserOrdersQueryKey } from "@/hooks/queries/use-user-orders";

const AutoRefreshOrders = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromPayment = searchParams.get("from");
    if (fromPayment === "payment-success") {
      queryClient.invalidateQueries({ queryKey: getUserOrdersQueryKey() });
    }
  }, [searchParams, queryClient]);

  return null;
};

export default AutoRefreshOrders;
