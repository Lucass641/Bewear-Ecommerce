export interface CartItem {
  id: string;
  cartId: string;
  productVariantId: string;
  quantity: number;
  createdAt: Date;
  productVariant: {
    id: string;
    name: string;
    slug: string;
    color: string;
    priceInCents: number;
    imageUrl: string;
    createdAt: Date;
    product: {
      id: string;
      name: string;
      slug: string;
      description: string;
      createdAt: Date;
    };
  };
}

export interface ShippingAddress {
  id: string;
  userId: string;
  recipientName: string;
  street: string;
  number: string;
  complement: string | null;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
  country: string;
  phone: string;
  createdAt: Date;
}

export interface Cart {
  id: string;
  userId: string;
  shippingAddressId: string | null;
  isTemporary: boolean;
  createdAt: Date;
  shippingAddress: ShippingAddress | null;
  items: CartItem[];
  totalPriceInCents: number;
}

export interface CartSummaryProduct {
  id: string;
  name: string;
  variantName: string;
  quantity: number;
  priceInCents: number;
  imageUrl: string;
}
