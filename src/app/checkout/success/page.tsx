"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const CheckoutSuccessPage = () => {
  useEffect(() => {
    localStorage.removeItem("buyNow");
    localStorage.removeItem("temporaryCartId");
  }, []);

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="text-center">
        <Image
          src="/illustration.svg"
          alt="Success"
          width={300}
          height={300}
          className="mx-auto"
        />
        <DialogTitle className="mt-4 text-2xl">Pedido Efetuado!</DialogTitle>
        <DialogDescription className="font-medium">
          Seu pedido foi efetuado com sucesso. Você pode acompanhar o status na
          seção de Meus Pedidos.
        </DialogDescription>
        <DialogFooter>
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <Button className="w-full rounded-full" size="lg" asChild>
              <Link href="/my-orders">Ver meus pedidos</Link>
            </Button>
            <Button
              className="w-full rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Pagina inicial</Link>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutSuccessPage;
