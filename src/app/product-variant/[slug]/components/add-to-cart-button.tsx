"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/mutations/use-add-to-cart";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
}: AddToCartButtonProps) => {
  const addToCartMutation = useAddToCart();

  const handleAddToCart = async () => {
    try {
      await addToCartMutation.mutateAsync({
        productVariantId,
        quantity,
      });
    } catch (error) {
      toast.error("Erro ao adicionar produto à sacola. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Button
      variant="outline"
      className="rounded-full"
      size="lg"
      disabled={addToCartMutation.isPending}
      onClick={handleAddToCart}
    >
      {addToCartMutation.isPending && <Loader2 className="animate-spin" />}
      Adicionar à Sacola
    </Button>
  );
};

export default AddToCartButton;
