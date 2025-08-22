import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

import Footer from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { db } from "@/db";
import { productVariantTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { getCheckoutSession } from "@/actions/create-checkout-session";

import CartSummary from "../components/cart-summary";
import Addresses from "./components/addresses";

const IdentificationPage = async (props: {
  searchParams?: { checkoutSessionId?: string };
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }
  const hasCheckoutSession = !!props.searchParams?.checkoutSessionId;
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
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
  const checkoutSession = props.searchParams?.checkoutSessionId
    ? await getCheckoutSession(props.searchParams.checkoutSessionId)
    : null;
  if (!hasCheckoutSession && (!cart || cart?.items.length == 0)) {
    redirect("/");
  }
  if (
    hasCheckoutSession &&
    (!checkoutSession || checkoutSession.userId !== session.user.id)
  ) {
    notFound();
  }
  const checkoutVariant = checkoutSession
    ? await db.query.productVariantTable.findFirst({
        where: (pv, { eq }) => eq(pv.id, checkoutSession.productVariantId),
        with: { product: true },
      })
    : null;
  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });
  const cartItems =
    checkoutSession && checkoutVariant
      ? [
          {
            productVariant: checkoutVariant,
            quantity: checkoutSession.quantity,
          },
        ]
      : cart?.items || [];
  const cartTotalInCents = cartItems.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  return (
    <>
      <Header />
      <div className="space-y-4 px-5">
        <Addresses
          shippingAddresses={shippingAddresses}
          defaultShippingAddressId={cart?.shippingAddress?.id || null}
        />
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cartItems.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </>
  );
};

export default IdentificationPage;
