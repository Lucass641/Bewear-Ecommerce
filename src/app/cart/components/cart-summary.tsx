import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/helpers/money";

interface CartSummaryProps {
  subtotalInCents: number;
  totalInCents: number;
  shippingInCents?: number;
  hideShipping?: boolean;
  products: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
    size: string;
  }>;
}

const CartSummary = ({
  subtotalInCents,
  totalInCents,
  shippingInCents = 0,
  hideShipping = false,
  products,
}: CartSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(subtotalInCents)}{" "}
          </p>
        </div>
        {!hideShipping && (
          <div className="flex justify-between">
            <p className="text-sm">Frete</p>
            <p className="text-muted-foreground text-sm font-medium">
              {shippingInCents > 0
                ? formatCentsToBRL(shippingInCents)
                : "Grátis"}
            </p>
          </div>
        )}
        <div className="flex justify-between">
          <p className="text-sm">Total</p>
          <p className="text-muted-foreground text-sm font-medium">
            {formatCentsToBRL(totalInCents)}{" "}
          </p>
        </div>

        <div className="py-3">
          <Separator />
        </div>

        {products.map((product) => (
          <div key={product.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={78}
                  height={78}
                  className="rounded-lg"
                />
                <div className="mx-2 flex flex-col">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {product.variantName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Tamanho: {product.size}
                  </p>
                  <p className="text-xs font-semibold">
                    Qtd: {product.quantity}
                  </p>
                  <p className="text-sm font-semibold">
                    {formatCentsToBRL(product.priceInCents)}
                  </p>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CartSummary;
