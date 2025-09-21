import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  try {
    const text = await request.text();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return NextResponse.error();
      }

      const existingOrder = await db
        .select()
        .from(orderTable)
        .where(eq(orderTable.id, orderId))
        .limit(1);

      if (existingOrder.length === 0) {
        return NextResponse.error();
      }

      await db
        .update(orderTable)
        .set({
          status: "paid",
        })
        .where(eq(orderTable.id, orderId));
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        return NextResponse.error();
      }
      await db
        .update(orderTable)
        .set({
          status: "canceled",
        })
        .where(eq(orderTable.id, orderId));
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return NextResponse.error();
      }

      await db
        .update(orderTable)
        .set({
          status: "paid",
        })
        .where(eq(orderTable.id, orderId));
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.error();
  }
};
