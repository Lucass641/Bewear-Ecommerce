"use client";

import { IdCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CheckoutStepper } from "@/components/common/checkout-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/queries/use-cart";
import { useTemporaryCart } from "@/hooks/queries/use-temporary-cart";
import { ShippingOption } from "@/lib/shipping";
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
import ShippingOptions from "./shipping-options";

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
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [shippingCost, setShippingCost] = useState(0);

  const handleShippingSelect = (
    option: ShippingOption | null,
    cost: number,
  ) => {
    setSelectedShipping(option);
    setShippingCost(cost);
  };

  if (!activeCart || activeCart.items.length === 0) {
    return <EmptyCartState />;
  }

  const cartTotalInCents = calculateCartTotal(activeCart);
  const shippingInCents = Math.round(shippingCost * 100);
  const totalWithShipping = cartTotalInCents + shippingInCents;
  const summaryProducts = mapCartItemsToSummaryProducts(activeCart);

  const steps = [
    { id: "cart", title: "Sacola", status: "completed" as const },
    {
      id: "identification",
      title: "Identificação",
      status: "completed" as const,
    },
    { id: "payment", title: "Pagamento", status: "current" as const },
  ];

  if (!activeCart.shippingAddress) {
    router.push("/cart/identification");
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Stepper at the top for all screens */}
      <div className="mb-6 px-5">
        <CheckoutStepper steps={steps} />
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:px-5">
        <div className="lg:col-span-2">
          <div className="px-5 lg:px-0">
            <Card>
              <CardHeader className="flex items-center gap-2">
                <IdCard />
                <CardTitle className="font-semibold md:text-xl">
                  Identificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ShippingAddressCard
                  shippingAddress={activeCart.shippingAddress}
                />
              </CardContent>

              <CardContent className="pt-2">
                <ShippingOptions
                  cart={activeCart}
                  onShippingSelect={handleShippingSelect}
                />
              </CardContent>

              <CardContent className="pt-2">
                <FinishOrderButton
                  disabled={!selectedShipping}
                  shippingPriceInCents={shippingInCents}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 lg:mt-0">
          <div className="px-5 lg:px-0">
            <CartSummary
              subtotalInCents={cartTotalInCents}
              totalInCents={totalWithShipping}
              shippingInCents={shippingInCents}
              products={summaryProducts}
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

export default CartConfirmationWrapper;
