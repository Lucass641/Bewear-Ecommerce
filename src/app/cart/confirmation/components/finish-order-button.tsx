"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { createCheckoutSession } from "@/actions/create-checkout-session";
import { Button } from "@/components/ui/button";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";

const FinishOrderButton = () => {
  const searchParams = useSearchParams();
  const checkoutSessionId = searchParams.get("checkoutSessionId") || undefined;
  const finishOrderMutation = useFinishOrder({ checkoutSessionId });
  const handleFinishOrder = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        toast.error("Configuração do Stripe não encontrada");
        console.error(
          "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está configurada",
        );
        return;
      }

      const { orderId } = await finishOrderMutation.mutateAsync();

      if (!orderId) {
        toast.error("Erro ao criar pedido. Tente novamente.");
        return;
      }

      const checkoutSession = await createCheckoutSession({
        orderId,
      });

      if (!checkoutSession?.id) {
        toast.error("Erro ao criar sessão de pagamento. Tente novamente.");
        return;
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );

      if (!stripe) {
        toast.error("Erro ao carregar Stripe. Tente novamente.");
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id,
      });

      if (error) {
        toast.error("Erro ao redirecionar para pagamento. Tente novamente.");
        console.error("Stripe redirect error:", error);
      }
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.");
      console.error("Checkout error:", error);
    }
  };
  return (
    <>
      <Button
        className="w-full rounded-full"
        size="lg"
        onClick={handleFinishOrder}
        disabled={finishOrderMutation.isPending}
      >
        {finishOrderMutation.isPending && <Loader2 className="animate-spin" />}
        Finalizar compra
      </Button>
    </>
  );
};

export default FinishOrderButton;
