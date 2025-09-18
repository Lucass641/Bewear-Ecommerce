"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Size } from "@/components/ui/size-selector";
import { useAddToCart } from "@/hooks/mutations/use-add-to-cart";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity: number;
  size: Size;
  disabled?: boolean;
}

const AddToCartButton = ({
  productVariantId,
  quantity,
  size,
  disabled = false,
}: AddToCartButtonProps) => {
  const addToCartMutation = useAddToCart();

  const handleAddToCart = async () => {
    if (!size) return;

    try {
      await addToCartMutation.mutateAsync({
        productVariantId,
        quantity,
        size,
      });
    } catch (error) {
      toast.error("Erro ao adicionar produto à sacola. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full rounded-full lg:flex-1"
      size="lg"
      disabled={disabled || addToCartMutation.isPending}
      onClick={handleAddToCart}
    >
      {addToCartMutation.isPending && <Loader2 className="animate-spin" />}
      Adicionar à Sacola
    </Button>
  );
};

export default AddToCartButton;
