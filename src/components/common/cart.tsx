"use client";
import { Separator } from "@radix-ui/react-separator";
import { Loader2, ShoppingBag, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { formatCentsToBRL } from "@/helpers/money";
import { useCart } from "@/hooks/queries/use-cart";

import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";

export const Cart = () => {
  const { data: cart, isPending } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const handleContinueClick = () => {
    setIsCartOpen(false);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="size-6 md:size-7" />
          {totalItems > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {" "}
            <ShoppingBagIcon className="size-5 opacity-70 md:size-6" />{" "}
            <p className="font-semibold md:text-xl">Sacola</p>
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col px-5 pb-5">
          <div className="flex h-full max-h-full flex-col overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex h-full flex-col gap-8">
                {isPending ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                ) : cart?.items && cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productVariantId={item.productVariant.id}
                      productName={item.productVariant.product.name}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                      size={item.size}
                    />
                  ))
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                    <ShoppingBagIcon className="size-16 opacity-20" />
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">
                        Sua sacola está vazia
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Adicione produtos para começar suas compras
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          {cart?.items && cart?.items.length > 0 && (
            <div className="flex flex-col gap-4">
              <Separator />
              <div className="flex items-center justify-between text-xs font-medium">
                <p className="font-semibold md:text-sm">Subtotal</p>
                <p>{formatCentsToBRL(cart?.totalPriceInCents ?? 0)}</p>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <Button className="rounded-full" asChild disabled={isPending}>
                  <Link
                    href="/cart/identification"
                    onClick={handleContinueClick}
                  >
                    {isPending && <Loader2 className="mr-2 animate-spin" />}
                    Finalizar compra
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full"
                  asChild
                  disabled={isPending}
                >
                  <Link href="/" onClick={handleContinueClick}>
                    Continuar comprando
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
