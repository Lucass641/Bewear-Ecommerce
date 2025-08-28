"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [temporaryCartId, setTemporaryCartId] = useState<string | null>(null);
  const finishOrderMutation = useFinishOrder();

  useEffect(() => {
    const buyNowFlag = localStorage.getItem("buyNow");
    const tempCartId = localStorage.getItem("temporaryCartId");

    if (buyNowFlag === "true" && tempCartId) {
      setIsBuyNow(true);
      setTemporaryCartId(tempCartId);
    }
  }, []);

  const handleFinishOrder = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key is not set");
      }

      const clearCartAfterOrder = !isBuyNow;
      const cartIdToUse =
        isBuyNow && temporaryCartId ? temporaryCartId : undefined;

      const { orderId } = await finishOrderMutation.mutateAsync({
        clearCartAfterOrder,
        cartId: cartIdToUse,
      });

      const checkoutSession = await createCheckoutSession({
        orderId,
      });

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );

      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }

      await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleFinishOrder}
        disabled={finishOrderMutation.isPending}
      >
        {finishOrderMutation.isPending && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        Finalizar pedido
      </Button>
    </>
  );
};

export default FinishOrderButton;
