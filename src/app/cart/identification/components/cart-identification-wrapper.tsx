"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CheckoutStepper } from "@/components/common/checkout-stepper";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/queries/use-cart";
import { useTemporaryCart } from "@/hooks/queries/use-temporary-cart";
import { ShippingAddress } from "@/types/cart";

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

  const steps = [
    { id: "cart", title: "Sacola", status: "completed" as const },
    {
      id: "identification",
      title: "Identificação",
      status: "current" as const,
    },
    { id: "payment", title: "Pagamento", status: "upcoming" as const },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Stepper at the top for all screens */}
      <div className="mb-6 px-5">
        <CheckoutStepper steps={steps} />
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:px-5">
        <div className="lg:col-span-2">
          <div className="px-5 lg:px-0">
            <Addresses
              shippingAddresses={shippingAddresses}
              defaultShippingAddressId={activeCart?.shippingAddress?.id || null}
            />
          </div>
        </div>

        <div className="mt-4 lg:mt-0">
          <div className="px-5 lg:px-0">
            <CartSummary
              subtotalInCents={cartTotalInCents}
              totalInCents={cartTotalInCents}
              products={summaryProducts}
              hideShipping={true}
            />
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">Continuar comprando</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartIdentificationWrapper;
