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
    console.error("STRIPE_SECRET_KEY não está configurada");
    throw new Error("Stripe secret key is not set");
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error("NEXT_PUBLIC_APP_URL não está configurada");
    throw new Error("App URL is not set");
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
  if (order.userId != session.user.id) {
    throw new Error("Unauthorized");
  }
  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: { with: { product: true } },
    },
  });

  if (orderItems.length === 0) {
    throw new Error("No order items found");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      metadata: {
        orderId,
      },
      line_items: orderItems.map((orderItem) => {
        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
              description: orderItem.productVariant.product.description,
              images: [orderItem.productVariant.imageUrl],
            },
            unit_amount: orderItem.productVariant.priceInCents,
          },
          quantity: orderItem.quantity,
        };
      }),
    });

    console.log("Checkout session created successfully:", checkoutSession.id);
    return checkoutSession;
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
};
