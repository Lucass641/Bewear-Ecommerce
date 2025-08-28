"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  UpdateCartShippingAddressSchema,
  updateCartShippingAddressSchema,
} from "./schema";

export const updateCartShippingAddress = async (
  data: UpdateCartShippingAddressSchema,
) => {
  updateCartShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (shippingAddress, { eq, and }) =>
      and(
        eq(shippingAddress.id, data.shippingAddressId),
        eq(shippingAddress.userId, session.user.id),
      ),
  });

  if (!shippingAddress) {
    throw new Error("Shipping address not found or unauthorized");
  }

  let cart;
  if (data.cartId) {
    // Se um cartId foi fornecido, buscar esse carrinho específico
    cart = await db.query.cartTable.findFirst({
      where: (cart, { eq, and }) =>
        and(eq(cart.id, data.cartId!), eq(cart.userId, session.user.id)),
    });
  } else {
    // Caso contrário, buscar o primeiro carrinho do usuário
    cart = await db.query.cartTable.findFirst({
      where: (cart, { eq }) => eq(cart.userId, session.user.id),
    });
  }

  if (!cart) {
    throw new Error("Cart not found");
  }

  await db
    .update(cartTable)
    .set({
      shippingAddressId: data.shippingAddressId,
    })
    .where(eq(cartTable.id, cart.id));

  return { success: true };
};
