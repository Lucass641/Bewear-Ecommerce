"use client";

import { Loader2 } from "lucide-react";

import { useUserOrders } from "@/hooks/queries/use-user-orders";

import AutoRefreshOrders from "./auto-refresh-orders";
import EmptyOrdersState from "./empty-orders-state";
import Orders from "./orders";

const OrdersWrapper = () => {
  const { data: orders, isLoading, error } = useUserOrders();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Erro ao carregar pedidos</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-lg font-semibold md:text-xl">Meus pedidos</h1>
        </div>
        <EmptyOrdersState />
      </div>
    );
  }

  return (
    <>
      <AutoRefreshOrders />
      <Orders orders={orders} />
    </>
  );
};

export default OrdersWrapper;
