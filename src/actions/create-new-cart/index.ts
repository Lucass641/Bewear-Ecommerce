"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { headers } from "next/headers";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import {
  CreateNewCartSchema,
  createNewCartSchema,
} from "./schema";

type NewCartValue = {
  userId: string;
  productVariantId: string;
  quantity: number;
  createdAt: number;
  shippingAddressId?: string;
};

const CART_SESSION_COOKIE = "cart_session";

export const createNewCart = async (
  data: CreateNewCartSchema,
) => {
  createNewCartSchema.parse(data);

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const productVariant = await db.query.productVariantTable.findFirst({
    where: (pv, { eq }) => eq(pv.id, data.productVariantId),
  });

  if (!productVariant) {
    throw new Error("Product variant not found");
  }

  const sessionId = randomUUID();
  const NewCartValue: NewCartValue = {
    userId: session.user.id,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
    createdAt: Date.now(),
  };

  const cookieStore = await cookies();
  cookieStore.set(
    `${CART_SESSION_COOKIE}:${sessionId}`,
    JSON.stringify(NewCartValue),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    },
  );

  return { id: sessionId };
};

export const getNewCart = async (id: string) => {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(`${CART_SESSION_COOKIE}:${id}`)?.value;
  if (!rawValue) {
    return null;
  }
  try {
    return JSON.parse(rawValue) as NewCartValue;
  } catch {
    return null;
  }
};

export const clearNewCart = async (id: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(`${CART_SESSION_COOKIE}:${id}`);
};

export const updateNewCartAddress = async (
  id: string,
  shippingAddressId: string,
) => {
  const cookieStore = await cookies();
  const cookieKey = `${CART_SESSION_COOKIE}:${id}`;
  const rawValue = cookieStore.get(cookieKey)?.value;
  if (!rawValue) {
    throw new Error("Checkout session not found");
  }
  let value: NewCartValue;
  try {
    value = JSON.parse(rawValue) as NewCartValue;
  } catch {
    throw new Error("Invalid checkout session");
  }
  value.shippingAddressId = shippingAddressId;
  cookieStore.set(cookieKey, JSON.stringify(value), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  });
  return { success: true } as const;
};
