"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orderTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

interface OrdersProps {
  orders: Array<{
    id: string;
    totalPriceInCents: number;
    status: (typeof orderTable.$inferSelect)["status"];
    trackingCode: string | null;
    createdAt: Date;
    items: Array<{
      id: string;
      imageUrl: string;
      productName: string;
      productVariantName: string;
      priceInCents: number;
      quantity: number;
      size: string;
    }>;
  }>;
}

const Orders = ({ orders }: OrdersProps) => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getOrderNumber = (orderId: string) => {
    return (
      Math.abs(
        orderId.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0),
      ) % 100000
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: {
        label: "Pendente",
        className: "bg-yellow-100 text-yellow-600",
      },
      paid: { label: "Pago", className: "bg-green-100 text-green-600" },
      processing: {
        label: "Em separação",
        className: "bg-indigo-100 text-indigo-600",
      },
      shipped: {
        label: "Saiu para entrega",
        className: "bg-sky-100 text-sky-600",
      },
      delivered: {
        label: "Entregue",
        className: "bg-green-100 text-green-600",
      },
      canceled: { label: "Cancelado", className: "bg-red-100 text-red-600" },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-lg font-semibold md:text-xl">Meus pedidos</h1>
      </div>

      {sortedOrders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);

        return (
          <Card key={order.id} className="overflow-hidden">
            {/* Desktop Header */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-4 gap-4 px-6">
                <div>
                  <p className="mb-1 text-sm font-semibold">Número do Pedido</p>
                  <p className="text-muted-foreground">
                    #{getOrderNumber(order.id).toString().padStart(3, "0")}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Status</p>
                  {getStatusBadge(order.status)}
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Data</p>
                  <p className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-sm font-semibold">Pagamento</p>
                    <p className="text-muted-foreground">Cartão</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleOrder(order.id)}
                    className="text-primary"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="mr-1 h-4 w-4" />
                        Detalhes do Pedido
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-1 h-4 w-4" />
                        Detalhes do Pedido
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="px-4 lg:hidden lg:px-4">
              <div className="space-y-3">
                {/* Data e Pagamento */}
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold">Data</p>
                    <p className="text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Pagamento</p>
                    <p className="text-muted-foreground">Cartão</p>
                  </div>
                </div>

                {/* Pedido e Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-semibold">
                      Pedido{" "}
                      <p className="text-muted-foreground text-sm font-normal md:text-base">
                        #{getOrderNumber(order.id).toString().padStart(3, "0")}
                      </p>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrder(order.id)}
                      className="text-primary h-auto p-1"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <CardContent className="p-3 lg:p-6">
                <div className="space-y-4 lg:space-y-6">
                  {/* Products */}
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={item.id}>
                        {index === 0 && <Separator className="mb-4" />}
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.imageUrl}
                            alt={item.productName}
                            width={60}
                            height={60}
                            className="rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {item.productName}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {item.productVariantName}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Tamanho: {item.size} | Qtd: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold md:text-base">
                              {formatCentsToBRL(item.priceInCents)}
                            </p>
                          </div>
                        </div>
                        {index < order.items.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCentsToBRL(order.totalPriceInCents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Transporte e Manuseio</span>
                      <span>Grátis</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa Estimada</span>
                      <span>—</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-sm md:text-base">
                        {formatCentsToBRL(order.totalPriceInCents)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default Orders;
