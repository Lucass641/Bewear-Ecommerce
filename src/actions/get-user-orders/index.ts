"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getUserOrders = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    totalPriceInCents: order.totalPriceInCents,
    shippingPriceInCents: order.shippingPriceInCents,
    status: order.status,
    trackingCode: order.trackingCode,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      imageUrl: item.productVariant.imageUrl,
      productName: item.productVariant.product.name,
      productVariantName: item.productVariant.name,
      priceInCents: item.priceInCents,
      quantity: item.quantity,
      size: item.size,
    })),
  }));
};
