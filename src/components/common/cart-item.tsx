import { MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { formatCentsToBRL } from "@/helpers/money";
import { useDecreaseCartProduct } from "@/hooks/mutations/use-decrease-cart-product";
import { useIncreaseCartItem } from "@/hooks/mutations/use-increase-cart-item";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
  size: string;
}

const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity,
  size,
}: CartItemProps) => {
  const removeProductFromCartMutation = useRemoveProductFromCart(id);
  const decreaseCartProductQuantityMutation = useDecreaseCartProduct(id);
  const increaseCartItemQuantityMutation = useIncreaseCartItem(id);

  const handleDeleteClick = () => {
    removeProductFromCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Produto removido da sacola.");
      },
      onError: () => {
        toast.error("Erro ao remover produto da sacola.");
      },
    });
  };

  const handleDecreaseQuantityClick = () => {
    decreaseCartProductQuantityMutation.mutate();
  };

  const handleIncreaseQuantityClick = () => {
    increaseCartItemQuantityMutation.mutate();
  };

  const totalPriceInCents = productVariantPriceInCents * quantity;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-muted-foreground text-sm">{productVariantName}</p>
          <p className="text-muted-foreground text-xs">Tamanho: {size}</p>
          <div className="flex w-[100px] items-center justify-between rounded-lg border p-1">
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={
                quantity === 1 ? handleDeleteClick : handleDecreaseQuantityClick
              }
            >
              {quantity === 1 ? (
                <Trash2 className="size-3" />
              ) : (
                <MinusIcon className="size-3" />
              )}
            </Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button
              className="h-4 w-4"
              variant="ghost"
              onClick={handleIncreaseQuantityClick}
            >
              <PlusIcon className="size-3" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold">
          {formatCentsToBRL(totalPriceInCents)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
