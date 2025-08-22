"use client";

import { useEffect } from "react";

import { removeProductFromCart } from "@/actions/remove-cart-product";

const EphemeralCartCleanup = () => {
  useEffect(() => {
    const cleanup = async () => {
      try {
        const id = sessionStorage.getItem("ephemeralCartItemId");
        if (!id) return;
        await removeProductFromCart({ cartItemId: id });
        sessionStorage.removeItem("ephemeralCartItemId");
      } catch {}
    };
    cleanup();
  }, []);
  return null;
};

export default EphemeralCartCleanup;
