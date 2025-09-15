import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartConfirmationWrapper from "./components/cart-confirmation-wrapper";

const ConfirmationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
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

  if (!cart) {
    redirect("/");
  }

  const totalPriceInCents = cart.items.reduce(
    (total, item) => total + item.productVariant.priceInCents * item.quantity,
    0
  );

  const cartWithTotal = {
    ...cart,
    totalPriceInCents,
  };

  return <CartConfirmationWrapper serverCart={cartWithTotal} />;
};

export default ConfirmationPage;
