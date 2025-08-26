"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { useCreateNewCart } from "@/hooks/mutations/use-create-new-cart";

interface BuyButtonProps {
  productVariantId: string;
  quantity: number;
}

const BuyButton = ({ productVariantId, quantity }: BuyButtonProps) => {
  const router = useRouter();

  const createSessionMutation = useCreateNewCart({
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
