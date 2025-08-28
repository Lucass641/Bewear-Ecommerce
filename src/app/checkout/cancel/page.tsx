"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClearTemporaryCart } from "@/hooks/mutations/use-clear-temporary-cart";

const CancelPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [isClient, setIsClient] = useState(false);
  const clearTemporaryCartMutation = useClearTemporaryCart();

  useEffect(() => {
    setIsClient(true);

    const buyNowFlag = localStorage.getItem("buyNow");
    const temporaryCartId = localStorage.getItem("temporaryCartId");

    if (buyNowFlag === "true" && temporaryCartId) {
      clearTemporaryCartMutation.mutate(temporaryCartId);
    }

    let intervalId: NodeJS.Timeout;

    const startCountdown = () => {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    startCountdown();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [router, clearTemporaryCartMutation]);

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="text-center">
        <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
          <X className="text-destructive h-10 w-10" />
        </div>
        <DialogTitle className="mt-4 text-2xl">Pagamento Cancelado</DialogTitle>
        <DialogDescription className="font-medium">
          Seu pagamento foi cancelado. Não se preocupe, nenhuma cobrança foi
          efetuada.
        </DialogDescription>
        <DialogFooter>
          <div className="flex w-full flex-col items-center justify-center gap-2">
            {isClient && (
              <div className="h-1 w-full rounded-full bg-gray-200">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                />
              </div>
            )}

            <p className="text-muted-foreground text-xs">
              {isClient
                ? `Redirecionamento automático em ${countdown} segundo${countdown !== 1 ? "s" : ""}...`
                : "Redirecionamento automático em 5 segundos..."}
            </p>
            <Button
              className="w-full rounded-full"
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/">Página inicial</Link>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelPage;
