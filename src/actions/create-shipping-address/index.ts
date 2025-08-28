"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "./schema";

export const createShippingAddress = async (
  data: CreateShippingAddressSchema,
) => {
  try {
    createShippingAddressSchema.parse(data);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const [shippingAddress] = await db
      .insert(shippingAddressTable)
      .values({
        userId: session.user.id,
        recipientName: data.fullName,
        street: data.address,
        number: data.number,
        complement: data.complement || undefined,
        city: data.city,
        state: data.state,
        neighborhood: data.neighborhood,
        zipCode: data.zipCode,
        country: "Brasil",
        phone: data.phone,
      })
      .returning();

    revalidatePath("/cart/identification");

    return shippingAddress;
  } catch (error) {
    console.error("Error creating shipping address:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Erro interno do servidor");
  }
};
