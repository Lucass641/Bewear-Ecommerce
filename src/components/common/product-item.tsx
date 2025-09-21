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
  const minPrice = Math.min(...product.variants.map((v) => v.priceInCents));
  const maxPrice = Math.max(...product.variants.map((v) => v.priceInCents));
  const hasMultiplePrices = minPrice !== maxPrice;

  return (
    <div className="group flex w-full flex-col gap-4">
      <Link
        href={`/product-variant/${firstVariant.slug}`}
        className="flex items-center justify-center overflow-hidden rounded-3xl"
      >
        <Image
          src={firstVariant.imageUrl}
          alt={firstVariant.name}
          sizes="100vw"
          width={0}
          height={0}
          className="h-auto w-full object-contain transition-transform hover:scale-110 md:h-auto md:w-100 md:rounded-3xl"
        />
      </Link>

      <div className="flex flex-col gap-1 md:gap-2">
        <Link
          href={`/product-variant/${firstVariant.slug}`}
          className="truncate text-sm font-semibold hover:underline md:text-base"
        >
          {product.name}
        </Link>

        <p className="text-muted-foreground truncate text-xs font-medium md:text-sm">
          {product.description}
        </p>

        <div className="flex items-center gap-2">
          {product.variants.slice(0, 4).map((variant) => (
            <Link
              key={variant.id}
              href={`/product-variant/${variant.slug}`}
              className="group/variant"
              title={variant.color}
            >
              <Image
                width={24}
                height={24}
                src={variant.imageUrl}
                alt={variant.color}
                className="rounded-md border border-gray-200 object-cover transition-transform hover:scale-110 md:h-6 md:w-6"
              />
            </Link>
          ))}
          {product.variants.length > 4 && (
            <span className="text-muted-foreground text-xs font-medium">
              +{product.variants.length - 4}
            </span>
          )}
        </div>

        <p className="truncate text-sm font-semibold md:text-base">
          {hasMultiplePrices
            ? `${formatCentsToBRL(minPrice)} - ${formatCentsToBRL(maxPrice)}`
            : formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </div>
  );
};

export default ProductItem;
