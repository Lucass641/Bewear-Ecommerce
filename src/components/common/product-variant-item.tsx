import Image from "next/image";
import Link from "next/link";

import { formatCentsToBRL } from "@/helpers/money";

interface ProductVariantItemProps {
  variant: {
    id: string;
    name: string;
    slug: string;
    color: string;
    priceInCents: number;
    imageUrl: string;
    productId: string;
    createdAt: Date;
    product: {
      id: string;
      name: string;
      slug: string;
      description: string;
      categoryId: string;
      createdAt: Date;
    };
  };
}

const ProductVariantItem = ({ variant }: ProductVariantItemProps) => {
  return (
    <div className="group flex w-full flex-col gap-4">
      <Link
        href={`/product-variant/${variant.slug}`}
        className="flex items-center justify-center overflow-hidden rounded-3xl"
      >
        <Image
          src={variant.imageUrl}
          alt={variant.color}
          sizes="100vw"
          width={0}
          height={0}
          className="h-auto w-full object-contain transition-transform hover:scale-110 md:h-auto md:w-100 md:rounded-3xl"
        />
      </Link>

      <div className="flex flex-col gap-1 md:gap-2">
        <Link
          href={`/product-variant/${variant.slug}`}
          className="truncate text-sm font-semibold hover:underline md:text-base"
        >
          {variant.product.name}
        </Link>

        <p className="text-muted-foreground truncate text-xs font-medium md:text-sm">
          {variant.color}
        </p>

        <p className="truncate text-sm font-semibold md:text-base">
          {formatCentsToBRL(variant.priceInCents)}
        </p>
      </div>
    </div>
  );
};

export default ProductVariantItem;
