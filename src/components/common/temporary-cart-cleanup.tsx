"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useClearTemporaryCart } from "@/hooks/mutations/use-clear-temporary-cart";

export const TemporaryCartCleanup = () => {
  const pathname = usePathname();
  const clearTemporaryCartMutation = useClearTemporaryCart();

  useEffect(() => {
    const buyNowFlag = localStorage.getItem("buyNow");
    const temporaryCartId = localStorage.getItem("temporaryCartId");

    if (buyNowFlag === "true" && temporaryCartId) {
      const isInCheckoutFlow = pathname.startsWith("/cart/");
      const isInProductPage = pathname.startsWith("/product-variant/");

      if (!isInCheckoutFlow && !isInProductPage) {
        clearTemporaryCartMutation.mutate(temporaryCartId);
        localStorage.removeItem("buyNow");
        localStorage.removeItem("temporaryCartId");
      }
    }
  }, [pathname, clearTemporaryCartMutation]);

  return null;
};
