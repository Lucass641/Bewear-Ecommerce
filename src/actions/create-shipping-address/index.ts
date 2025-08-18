"use server";

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
  createShippingAddressSchema.parse(data);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const digitsOnly = (value: string) => value.replace(/\D/g, "");

  const [shippingAddress] = await db
    .insert(shippingAddressTable)
    .values({
      userId: session.user.id,
      recipientName: data.fullName,
      street: data.address,
      number: data.number,
      complement: data.complement,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
      zipCode: digitsOnly(data.zipCode),
      country: "Brasil",
      phone: digitsOnly(data.phone),
      email: data.email,
      cpfOrCnpj: digitsOnly(data.cpf),
    })
    .returning();

  return shippingAddress;
};
