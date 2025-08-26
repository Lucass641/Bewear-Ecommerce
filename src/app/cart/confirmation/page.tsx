import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getNewCart } from "@/actions/create-new-cart";
import { Header } from "@/components/common/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { auth } from "@/lib/auth";

import CartSummary from "../components/cart-summary";
import { formatAddress } from "../helpers/address";
import FinishOrderButton from "./components/finish-order-button";

const ConfirmationPage = async (props: {
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
    ? await getNewCart(props.searchParams.checkoutSessionId)
    : null;
  if (!hasCheckoutSession && (!cart || cart?.items.length == 0)) {
    redirect("/");
  }
  const checkoutVariant = checkoutSession
    ? await db.query.productVariantTable.findFirst({
        where: (pv, { eq }) => eq(pv.id, checkoutSession.productVariantId),
        with: { product: true },
      })
    : null;
  const items =
    checkoutSession && checkoutVariant
      ? [
          {
            productVariant: checkoutVariant,
            quantity: checkoutSession.quantity,
          },
        ]
      : cart?.items || [];
  const cartTotalInCents = items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
  const shippingAddress = checkoutSession?.shippingAddressId
    ? await db.query.shippingAddressTable.findFirst({
        where: (sa, { eq, and }) =>
          and(
            eq(sa.id, checkoutSession.shippingAddressId!),
            eq(sa.userId, session.user.id),
          ),
      })
    : cart?.shippingAddress;
  if (!shippingAddress) {
    redirect(
      hasCheckoutSession
        ? `/cart/identification?checkoutSessionId=${props.searchParams?.checkoutSessionId}`
        : "/cart/identification",
    );
  }

  return (
    <div>
      <Header />

      <div className="space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <p className="text-sm whitespace-pre-line">
                  {formatAddress(shippingAddress)}
                </p>
              </CardContent>
            </Card>
            <FinishOrderButton />
          </CardContent>
        </Card>
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
    </div>
  );
};

export default ConfirmationPage;
