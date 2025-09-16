import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

interface ProductItemProps {
  product: typeof productTable.$inferSelect & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  textContainerClassName?: string;
}

const ProductItem = ({ product }: ProductItemProps) => {
  const firstVariant = product.variants[0];
  return (
    <Link
      href={`/product-variant/${firstVariant.slug}`}
      className="group flex w-full flex-col gap-4"
    >
      <div className="flex items-center justify-center overflow-hidden rounded-3xl">
        <Image
          src={firstVariant.imageUrl}
          alt={firstVariant.name}
          sizes="100vw"
          width={0}
          height={0}
          className="h-auto w-full object-contain transition-transform hover:scale-110 md:h-auto md:w-100 md:rounded-3xl"
        />
      </div>
      <div className="flex flex-col gap-1 md:gap-2">
        <p className="truncate text-sm font-semibold md:text-base">
          {product.name}
        </p>
        <p className="text-muted-foreground truncate text-xs font-medium md:text-sm">
          {product.description}
        </p>
        <p className="truncate text-sm font-semibold md:text-base">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
