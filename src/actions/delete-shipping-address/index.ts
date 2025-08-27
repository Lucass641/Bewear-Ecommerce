"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  DeleteShippingAddressSchema,
  deleteShippingAddressSchema,
} from "./schema";

export const deleteShippingAddress = async (
  data: DeleteShippingAddressSchema,
) => {
  deleteShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const shippingAddress = await db.query.shippingAddressTable.findFirst({
    where: (address, { eq }) => eq(address.id, data.addressId),
  });

  if (!shippingAddress) {
    throw new Error("Shipping address not found");
  }

  if (shippingAddress.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(shippingAddressTable)
    .where(eq(shippingAddressTable.id, data.addressId));

  revalidatePath("/cart/identification");
};
