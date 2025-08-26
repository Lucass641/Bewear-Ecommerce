"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { clearNewCart, getNewCart } from "@/actions/create-new-cart";
import { db } from "@/db";
import {
  cartItemTable,
  cartTable,
  orderItemTable,
  orderTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

export const finishOrder = async (params?: { checkoutSessionId?: string }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const hasCheckoutSession = !!params?.checkoutSessionId;
  const checkoutSession = params?.checkoutSessionId
    ? await getNewCart(params.checkoutSessionId)
    : null;
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: { with: { productVariant: true } },
    },
  });
  const items =
    hasCheckoutSession && checkoutSession
      ? [
          {
            productVariant: await db.query.productVariantTable.findFirst({
              where: (pv, { eq }) =>
                eq(pv.id, checkoutSession.productVariantId),
            }),
            quantity: checkoutSession.quantity,
          },
        ].filter((i) => i.productVariant)
      : cart?.items || [];
  const shippingAddress =
    hasCheckoutSession && checkoutSession?.shippingAddressId
      ? await db.query.shippingAddressTable.findFirst({
          where: (sa, { eq, and }) =>
            and(
              eq(sa.id, checkoutSession.shippingAddressId!),
              eq(sa.userId, session.user.id),
            ),
        })
      : cart?.shippingAddress;
  if (!shippingAddress) {
    throw new Error("Shipping address not found");
  }
  if (!items.length) {
    throw new Error("Cart is empty");
  }
  const totalPriceInCents = items.reduce(
    (acc, item) => acc + item.productVariant!.priceInCents * item.quantity,
    0,
  );

  let orderId: string | undefined;
  await db.transaction(async (tx) => {
    if (!shippingAddress) {
      throw new Error("Shipping address not found");
    }
    const [order] = await tx
      .insert(orderTable)
      .values({
        email: shippingAddress.email,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone,
        cpf: shippingAddress.cpf,
        city: shippingAddress.city,
        complement: shippingAddress.complement,
        neighborhood: shippingAddress.neighborhood,
        number: shippingAddress.number,
        recipientName: shippingAddress.recipientName,
        state: shippingAddress.state,
        street: shippingAddress.street,
        userId: session.user.id,
        totalPriceInCents,
        shippingAddressId: shippingAddress.id,
      })
      .returning();
    if (!order) {
      throw new Error("Failed to create order");
    }
    orderId = order.id;
    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> =
      items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariant!.id,
        quantity: item.quantity,
        priceInCents: item.productVariant!.priceInCents,
      }));
    await tx.insert(orderItemTable).values(orderItemsPayload);
    if (!hasCheckoutSession) {
      await tx.delete(cartTable).where(eq(cartTable.id, cart!.id));
      await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart!.id));
    }
  });
  if (hasCheckoutSession && params?.checkoutSessionId) {
    await clearNewCart(params.checkoutSessionId);
  }
  if (!orderId) {
    throw new Error("Failed to create order");
  }
  return { orderId };
};
