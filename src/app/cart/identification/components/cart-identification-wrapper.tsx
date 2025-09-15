"use client";
import { useEffect, useState } from "react";

import { useCart } from "@/hooks/queries/use-cart";
import { useTemporaryCart } from "@/hooks/queries/use-temporary-cart";
import { Cart, ShippingAddress } from "@/types/cart";

import CartSummary from "../../components/cart-summary";
import { EmptyCartState } from "../../components/empty-cart-state";
import {
  calculateCartTotal,
  getCartStateFromLocalStorage,
  mapCartItemsToSummaryProducts,
} from "../../utils/cart-utils";
import Addresses from "./addresses";

interface CartIdentificationWrapperProps {
  shippingAddresses: ShippingAddress[];
  defaultShippingAddressId: string | null;
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

const CartIdentificationWrapper = ({
  shippingAddresses,
}: CartIdentificationWrapperProps) => {
  const { activeCart } = useCartState();

  if (!activeCart || activeCart.items.length === 0) {
    return <EmptyCartState />;
  }

  const cartTotalInCents = calculateCartTotal(activeCart);
  const summaryProducts = mapCartItemsToSummaryProducts(activeCart);

  return (
    <div className="space-y-4 px-5">
      <Addresses
        shippingAddresses={shippingAddresses}
        defaultShippingAddressId={activeCart?.shippingAddress?.id || null}
      />
      <CartSummary
        subtotalInCents={cartTotalInCents}
        totalInCents={cartTotalInCents}
        products={summaryProducts}
        hideShipping={true}
      />
    </div>
  );
};

export default CartIdentificationWrapper;
