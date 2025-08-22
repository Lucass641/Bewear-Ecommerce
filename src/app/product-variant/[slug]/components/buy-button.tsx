"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { addProductToCart } from "@/actions/add-cart-product";
import { Button } from "@/components/ui/button";

interface BuyButtonProps {
  productVariantId: string;
  quantity: number;
}

const BuyButton = ({ productVariantId, quantity }: BuyButtonProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["buyNow", productVariantId, quantity],
    mutationFn: async () =>
      addProductToCart({
        productVariantId,
        quantity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push("/cart/identification");
    },
  });

  return (
    <Button
      className="rounded-full"
      size="lg"
      disabled={isPending}
      onClick={() => mutate()}
    >
      Comprar agora
    </Button>
  );
};

export default BuyButton;
