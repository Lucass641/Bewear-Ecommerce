"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useBuyNow } from "@/hooks/mutations/use-buy-now";

interface BuyButtonProps {
  productVariantId: string;
  quantity: number;
}

const BuyButton = ({ productVariantId, quantity }: BuyButtonProps) => {
  const router = useRouter();
  const buyNowMutation = useBuyNow();

  const handleBuyNow = async () => {
    try {
      const result = await buyNowMutation.mutateAsync({
        productVariantId,
        quantity,
      });

      if (result?.cartId) {
        localStorage.setItem("buyNow", "true");
        localStorage.setItem("temporaryCartId", result.cartId);
        router.push("/cart/identification");
      }
    } catch (error) {
      toast.error("Erro ao adicionar produto ao carrinho. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Button
      className="rounded-full"
      size="lg"
      disabled={buyNowMutation.isPending}
      onClick={handleBuyNow}
    >
      {buyNowMutation.isPending && <Loader2 className="animate-spin" />}
      Comprar agora
    </Button>
  );
};

export default BuyButton;
