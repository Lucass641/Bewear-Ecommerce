"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { AddProductToCartSchema, addProductToCartSchema } from "./schema";

export const addProductToCart = async (data: AddProductToCartSchema) => {
  addProductToCartSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  const productVariant = await db.query.productVariantTable.findFirst({
    where: (productVariant, { eq }) =>
      eq(productVariant.id, data.productVariantId),
  });
  if (!productVariant) {
    throw new Error("Product variant not found");
  }
  let cartId: string;

  if (data.createTemporaryCart) {
    const [newCart] = await db
      .insert(cartTable)
      .values({
        userId: session.user.id,
        isTemporary: true,
      })
      .returning();
    cartId = newCart.id;
  } else {
    const cart = await db.query.cartTable.findFirst({
      where: (cart, { eq, and }) =>
        and(eq(cart.userId, session.user.id), eq(cart.isTemporary, false)),
    });
    if (!cart) {
      const [newCart] = await db
        .insert(cartTable)
        .values({
          userId: session.user.id,
          isTemporary: false,
        })
        .returning();
      cartId = newCart.id;
    } else {
      cartId = cart.id;
    }

    if (data.clearCart && cartId) {
      await db.delete(cartItemTable).where(eq(cartItemTable.cartId, cartId));
    }
  }

  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq, and }) =>
      and(
        eq(cartItem.cartId, cartId),
        eq(cartItem.productVariantId, data.productVariantId),
      ),
  });
  if (cartItem) {
    await db
      .update(cartItemTable)
      .set({
        quantity: cartItem.quantity + data.quantity,
      })
      .where(eq(cartItemTable.id, cartItem.id));
    return { cartId };
  }
  await db.insert(cartItemTable).values({
    cartId,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
  });

  return { cartId };
};
