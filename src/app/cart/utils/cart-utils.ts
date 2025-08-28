import { Cart } from "@/types/cart";

export const calculateCartTotal = (cart: Cart | null | undefined): number => {
  if (!cart?.items) return 0;

  return cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );
};

export const mapCartItemsToSummaryProducts = (
  cart: Cart | null | undefined,
) => {
  if (!cart?.items) return [];

  return cart.items.map((item) => ({
    id: item.productVariant.id,
    name: item.productVariant.product.name,
    variantName: item.productVariant.name,
    quantity: item.quantity,
    priceInCents: item.productVariant.priceInCents,
    imageUrl: item.productVariant.imageUrl,
  }));
};

export const getCartStateFromLocalStorage = () => {
  const buyNowFlag = localStorage.getItem("buyNow");
  const tempCartId = localStorage.getItem("temporaryCartId");

  return {
    isBuyNow: buyNowFlag === "true",
    temporaryCartId: tempCartId,
  };
};
