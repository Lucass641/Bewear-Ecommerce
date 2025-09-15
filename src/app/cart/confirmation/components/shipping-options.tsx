"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Package, Truck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCentsToBRL } from "@/helpers/money";
import { calculateShipping, ShippingOption } from "@/lib/shipping";
import { Cart } from "@/types/cart";

interface ShippingOptionsProps {
  cart: Cart;
  onShippingSelect: (
    option: ShippingOption | null,
    shippingCost: number,
  ) => void;
}

const formatDeliveryTime = (deliveryTime: number) => {
  return `${deliveryTime} dias úteis`;
};

const ShippingOptions = ({ cart, onShippingSelect }: ShippingOptionsProps) => {
  const [selectedShipping, setSelectedShipping] =
    useState<ShippingOption | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);

  const {
    mutate: calculateShippingMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: calculateShipping,
    onSuccess: (options) => {
      setShippingOptions(options);
      if (options.length > 0) {
        const cheapestOption = options[0];
        setSelectedShipping(cheapestOption);
        onShippingSelect(cheapestOption, cheapestOption.price);
      }
    },
    onError: (error) => {
      console.error("Erro ao calcular frete:", error);
      setShippingOptions([]);
      setSelectedShipping(null);
      onShippingSelect(null, 0);
    },
  });

  const handleCalculateShipping = useCallback(() => {
    if (!cart?.items?.length || !cart.shippingAddress?.zipCode) return;

    const totalValue = cart.items.reduce(
      (acc, item) =>
        acc + (item.productVariant.priceInCents / 100) * item.quantity,
      0,
    );

    const totalWeight = cart.items.reduce(
      (acc, item) => acc + 0.5 * item.quantity,
      0,
    );

    calculateShippingMutation({
      zipCode: cart.shippingAddress.zipCode,
      totalValue,
      totalWeight,
    });
  }, [cart?.items, cart.shippingAddress?.zipCode, calculateShippingMutation]);

  const handleShippingSelection = (optionId: string) => {
    const option = shippingOptions.find((opt) => opt.id === optionId);
    if (option) {
      setSelectedShipping(option);
      onShippingSelect(option, option.price);
    }
  };
  useEffect(() => {
    if (
      cart.shippingAddress?.zipCode &&
      !shippingOptions.length &&
      !isPending
    ) {
      handleCalculateShipping();
    }
  }, [
    cart.shippingAddress?.zipCode,
    shippingOptions.length,
    isPending,
    handleCalculateShipping,
  ]);

  if (!cart.shippingAddress?.zipCode) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 font-semibold">
          <Truck />
          Opções de Entrega
        </h3>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao calcular frete. Tente novamente ou contate o suporte.
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {shippingOptions.length > 0 && !isPending && (
        <div>
          <RadioGroup
            value={selectedShipping?.id || ""}
            onValueChange={handleShippingSelection}
            className="space-y-2"
          >
            {shippingOptions.map((option) => (
              <Label
                key={option.id}
                htmlFor={option.id}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                  selectedShipping?.id === option.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                  <div className="bg-none flex h-10 w-10 items-center justify-center rounded text-lg">
                    {option.name === "PAC" ? "📦" : "⚡"}
                  </div>
                  <div>
                    <div className="font-semibold">{option.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {option.company} • {formatDeliveryTime(option.deliveryTime)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {formatCentsToBRL(option.price * 100)}
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}

      {shippingOptions.length === 0 && !isPending && !error && (
        <Alert>
          <Package className="h-4 w-4" />
          <AlertDescription>
            Calculando opções de frete para este CEP...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ShippingOptions;
