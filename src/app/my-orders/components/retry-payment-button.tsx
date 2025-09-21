"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRetryOrderPayment } from "@/hooks/mutations/use-retry-order-payment";

interface RetryPaymentButtonProps {
  orderId: string;
}

const RetryPaymentButton = ({ orderId }: RetryPaymentButtonProps) => {
  const retryPaymentMutation = useRetryOrderPayment();

  const handleRetryPayment = async () => {
    try {
      const session = await retryPaymentMutation.mutateAsync({ orderId });
      if (session.url) {
        window.location.href = session.url;
      }
    } catch {
      toast.error("Erro ao tentar pagamento novamente");
    }
  };

  return (
    <Button
      onClick={handleRetryPayment}
      disabled={retryPaymentMutation.isPending}
      size="sm"
      className="gap-2"
    >
      {retryPaymentMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {retryPaymentMutation.isPending ? "Processando..." : "Pagar Agora"}
    </Button>
  );
};

export default RetryPaymentButton;
