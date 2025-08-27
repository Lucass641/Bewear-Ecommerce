"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CancelPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    toast.error("Pagamento cancelado. Tente novamente mais tarde.");

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [router]);

  return (
    <>
      <Header />
      <div className="bg-background flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="space-y-6 text-center">
              <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                <X className="text-destructive h-10 w-10" />
              </div>

              <div className="space-y-2">
                <h1 className="text-foreground text-2xl font-bold">
                  Pagamento Cancelado
                </h1>
                <p className="text-muted-foreground text-sm">
                  Seu pagamento foi cancelado. Não se preocupe, nenhuma cobrança
                  foi efetuada.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full rounded-full"
                  size="lg"
                >
                  Voltar à página inicial
                </Button>
                <p className="text-muted-foreground text-xs">
                  Redirecionamento automático em {countdown} segundos...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CancelPage;
