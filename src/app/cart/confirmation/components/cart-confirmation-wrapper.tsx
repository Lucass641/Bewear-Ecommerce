"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/queries/use-cart";
import { useTemporaryCart } from "@/hooks/queries/use-temporary-cart";
import { Cart } from "@/types/cart";

import CartSummary from "../../components/cart-summary";
import { EmptyCartState } from "../../components/empty-cart-state";
import { formatAddress } from "../../helpers/address";
import {
  calculateCartTotal,
  getCartStateFromLocalStorage,
  mapCartItemsToSummaryProducts,
} from "../../utils/cart-utils";
import FinishOrderButton from "./finish-order-button";

interface CartConfirmationWrapperProps {
  serverCart: Cart | null;
}

const useCartState = () => {
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [temporaryCartId, setTemporaryCartId] = useState<string | null>(null);

  const { data: temporaryCart } = useTemporaryCart(temporaryCartId || "");
  const { data: mainCart } = useCart();

  useEffect(() => {
    const { isBuyNow: buyNowFlag, temporaryCartId: tempCartId } =
      getCartStateFromLocalStorage();

    if (buyNowFlag && tempCartId) {
      setIsBuyNow(true);
      setTemporaryCartId(tempCartId);
    }
  }, []);

  return {
    isBuyNow,
    temporaryCartId,
    temporaryCart,
    mainCart,
    activeCart: isBuyNow ? temporaryCart : mainCart,
  };
};

const ShippingAddressCard = ({
  shippingAddress,
}: {
  shippingAddress: Cart["shippingAddress"];
}) => {
  if (!shippingAddress) return null;

  return (
    <Card>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <div>
              <p className="text-sm whitespace-pre-line">
                {formatAddress(shippingAddress)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CartConfirmationWrapper = ({}: CartConfirmationWrapperProps) => {
  const router = useRouter();
  const { activeCart } = useCartState();

  if (!activeCart || activeCart.items.length === 0) {
    return <EmptyCartState />;
  }

  const cartTotalInCents = calculateCartTotal(activeCart);
  const summaryProducts = mapCartItemsToSummaryProducts(activeCart);

  if (!activeCart.shippingAddress) {
    router.push("/cart/identification");
    return null;
  }

  return (
    <div className="space-y-4 px-5">
      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ShippingAddressCard shippingAddress={activeCart.shippingAddress} />
          <FinishOrderButton />
        </CardContent>
      </Card>
      <CartSummary
        subtotalInCents={cartTotalInCents}
        totalInCents={cartTotalInCents}
        products={summaryProducts}
      />
    </div>
  );
};

export default CartConfirmationWrapper;
