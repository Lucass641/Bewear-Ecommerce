"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";

import { db } from "@/db";
import { orderItemTable, orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";

export const createCheckoutSession = async (
  data: CreateCheckoutSessionSchema,
) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not set");
  }
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const { orderId } = createCheckoutSessionSchema.parse(data);
  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }
  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: { with: { product: true } },
    },
  });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const lineItems = orderItems.map((orderItem) => {
    return {
      price_data: {
        currency: "brl",
        product_data: {
          name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
          description: orderItem.productVariant.product.description,
          images: [orderItem.productVariant.imageUrl],
        },
        unit_amount: orderItem.priceInCents,
      },
      quantity: orderItem.quantity,
    };
  });

  if (order.shippingPriceInCents > 0) {
    lineItems.push({
      price_data: {
        currency: "brl",
        product_data: {
          name: "Frete",
          description: "Taxa de entrega",
          images: [],
        },
        unit_amount: order.shippingPriceInCents,
      },
      quantity: 1,
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      orderId,
    },
    line_items: lineItems,
  });

  await db
    .update(orderTable)
    .set({
      stripeSessionId: checkoutSession.id,
    })
    .where(eq(orderTable.id, orderId));

  return checkoutSession;
};
