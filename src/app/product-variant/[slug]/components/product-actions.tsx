"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import SizeSelector, { Size } from "@/components/ui/size-selector";

import AddToCartButton from "./add-to-cart-button";
import BuyButton from "./buy-button";

interface ProductActionsProps {
  productVariantId: string;
  isAccessory?: boolean;
  isShoe?: boolean;
}

const ProductActions = ({
  productVariantId,
  isAccessory = false,
  isShoe = false,
}: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<Size>(
    isAccessory ? "ÚNICO" : null,
  );

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };
  return (
    <div className="space-y-4">
      <SizeSelector
        value={selectedSize}
        onValueChange={setSelectedSize}
        isAccessory={isAccessory}
        isShoe={isShoe}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Quantidade</h3>
        <div className="flex w-24 items-center justify-between rounded-lg border border-gray-200">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDecrement}
            className="h-8 w-8"
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{quantity}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleIncrement}
            className="h-8 w-8"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
        <AddToCartButton
          productVariantId={productVariantId}
          quantity={quantity}
          size={selectedSize}
          disabled={!selectedSize}
        />
        <BuyButton
          productVariantId={productVariantId}
          quantity={quantity}
          size={selectedSize}
          disabled={!selectedSize}
        />
      </div>
    </div>
  );
};

export default ProductActions;
