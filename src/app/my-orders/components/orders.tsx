"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderTable } from "@/db/schema";

import OrderSummary from "./order-summary";

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
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-4">
      <CardHeader className="px-1">
        <CardTitle className="text-xl font-semibold uppercase">
          Meus Pedidos
        </CardTitle>
      </CardHeader>
      {sortedOrders.map((order) => (
        <Card key={order.id}>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex items-center justify-between py-0">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-semibold">
                        Pedido #
                        {Math.abs(
                          order.id
                            .split("")
                            .reduce(
                              (a, b) => (a << 5) - a + b.charCodeAt(0),
                              0,
                            ),
                        ) % 100000}
                      </p>
                      <p className="text-muted-foreground mb-3 font-medium">
                        Pedido feito em{" "}
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                      {order.status === "shipped" && order.trackingCode && (
                        <p className="text-sm font-medium text-blue-600">
                          Código de postagem: {order.trackingCode}
                        </p>
                      )}
                    </div>
                    <div>
                      {order.status == "pending" && (
                        <Badge className="bg-yellow-100 text-yellow-600">
                          Pendente
                        </Badge>
                      )}
                      {order.status == "paid" && (
                        <Badge className="bg-blue-100 text-blue-600">
                          Pago
                        </Badge>
                      )}
                      {order.status == "processing" && (
                        <Badge className="bg-indigo-100 text-indigo-600">
                          Em separação
                        </Badge>
                      )}
                      {order.status == "shipped" && (
                        <Badge className="bg-sky-100 text-sky-600">
                          Saiu para entrega
                        </Badge>
                      )}
                      {order.status == "delivered" && (
                        <Badge className="bg-green-100 text-green-600">
                          Entregue
                        </Badge>
                      )}
                      {order.status == "canceled" && (
                        <Badge className="bg-red-100 text-red-600">
                          Cancelado
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <OrderSummary
                    subtotalInCents={order.totalPriceInCents}
                    totalInCents={order.totalPriceInCents}
                    products={order.items.map((item) => ({
                      id: item.id,
                      name: item.productName,
                      priceInCents: item.priceInCents,
                      quantity: item.quantity,
                      variantName: item.productVariantName,
                      imageUrl: item.imageUrl,
                      size: item.size,
                    }))}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
