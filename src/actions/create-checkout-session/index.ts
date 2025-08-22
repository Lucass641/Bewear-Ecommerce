"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { headers } from "next/headers";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import {
  CreateCheckoutSessionSchema,
  createCheckoutSessionSchema,
} from "./schema";

type CheckoutSessionValue = {
  userId: string;
  productVariantId: string;
  quantity: number;
  createdAt: number;
  shippingAddressId?: string;
};

const CHECKOUT_SESSION_COOKIE = "checkout_session";

export const createCheckoutSession = async (
  data: CreateCheckoutSessionSchema,
) => {
  createCheckoutSessionSchema.parse(data);

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
  const checkoutSessionValue: CheckoutSessionValue = {
    userId: session.user.id,
    productVariantId: data.productVariantId,
    quantity: data.quantity,
    createdAt: Date.now(),
  };

  const cookieStore = await cookies();
  cookieStore.set(
    `${CHECKOUT_SESSION_COOKIE}:${sessionId}`,
    JSON.stringify(checkoutSessionValue),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    },
  );

  return { id: sessionId };
};

export const getCheckoutSession = async (id: string) => {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(`${CHECKOUT_SESSION_COOKIE}:${id}`)?.value;
  if (!rawValue) {
    return null;
  }
  try {
    return JSON.parse(rawValue) as CheckoutSessionValue;
  } catch {
    return null;
  }
};

export const clearCheckoutSession = async (id: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(`${CHECKOUT_SESSION_COOKIE}:${id}`);
};

export const updateCheckoutSessionAddress = async (
  id: string,
  shippingAddressId: string,
) => {
  const cookieStore = await cookies();
  const cookieKey = `${CHECKOUT_SESSION_COOKIE}:${id}`;
  const rawValue = cookieStore.get(cookieKey)?.value;
  if (!rawValue) {
    throw new Error("Checkout session not found");
  }
  let value: CheckoutSessionValue;
  try {
    value = JSON.parse(rawValue) as CheckoutSessionValue;
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
