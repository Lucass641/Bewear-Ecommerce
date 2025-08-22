"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { useCreateCheckoutSession } from "@/hooks/mutations/use-create-checkout-session";

interface BuyButtonProps {
  productVariantId: string;
  quantity: number;
}

const BuyButton = ({ productVariantId, quantity }: BuyButtonProps) => {
  const router = useRouter();

  const createSessionMutation = useCreateCheckoutSession({
    productVariantId,
    quantity,
  });

  return (
    <Button
      className="rounded-full"
      size="lg"
      disabled={createSessionMutation.isPending}
      onClick={() =>
        createSessionMutation.mutate(undefined, {
          onSuccess: (session) => {
            const qs = session?.id ? `?checkoutSessionId=${session.id}` : "";
            router.push(`/cart/identification${qs}`);
          },
        })
      }
    >
      Comprar agora
    </Button>
  );
};

export default BuyButton;
