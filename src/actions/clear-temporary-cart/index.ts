"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { ClearTemporaryCartSchema, clearTemporaryCartSchema } from "./schema";

export const clearTemporaryCart = async (data: ClearTemporaryCartSchema) => {
  clearTemporaryCartSchema.parse(data);
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq, and }) =>
      and(
        eq(cart.id, data.cartId),
        eq(cart.userId, session.user.id),
        eq(cart.isTemporary, true),
      ),
  });

  if (!cart) {
    throw new Error("Temporary cart not found");
  }

  await db.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
  await db.delete(cartTable).where(eq(cartTable.id, cart.id));
};
