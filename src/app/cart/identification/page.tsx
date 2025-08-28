import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import CartIdentificationWrapper from "./components/cart-identification-wrapper";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }

  // Verificar se há um carrinho temporário no localStorage (client-side)
  // Como esta é uma server component, vamos buscar o carrinho principal primeiro
  // e deixar o client-side lidar com a lógica do carrinho temporário

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq, and }) =>
      and(eq(cart.userId, session.user.id), eq(cart.isTemporary, false)),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });

  return (
    <CartIdentificationWrapper
      shippingAddresses={shippingAddresses}
      defaultShippingAddressId={cart?.shippingAddress?.id || null}
      serverCart={cart}
    />
  );
};

export default IdentificationPage;
