"use client";

import { IdCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  if (!activeCart.shippingAddress) {
    router.push("/cart/identification");
    return null;
  }

  return (
    <div className="space-y-6 px-5">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <IdCard />
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent>
          <ShippingAddressCard shippingAddress={activeCart.shippingAddress} />
        </CardContent>

        <CardContent className="pt-2">
          <ShippingOptions
            cart={activeCart}
            onShippingSelect={handleShippingSelect}
          />
        </CardContent>

        <CardContent className="pt-2">
          <FinishOrderButton disabled={!selectedShipping} />
        </CardContent>
      </Card>

      <CartSummary
        subtotalInCents={cartTotalInCents}
        totalInCents={totalWithShipping}
        shippingInCents={shippingInCents}
        products={summaryProducts}
      />
    </div>
  );
};

export default CartConfirmationWrapper;
