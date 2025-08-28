import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const EmptyCartState = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 px-5 text-center">
    <div className="bg-muted flex size-16 items-center justify-center rounded-full">
      <ShoppingBagIcon className="size-8 opacity-50" />
    </div>
    <div className="space-y-2">
      <p className="text-lg font-semibold">Sua sacola está vazia</p>
      <p className="text-muted-foreground text-sm">
        Adicione produtos para continuar com suas compras
      </p>
    </div>
    <Button asChild className="mt-4">
      <Link href="/">Continuar Comprando</Link>
    </Button>
  </div>
);
