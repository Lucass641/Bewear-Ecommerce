import Image from "next/image";
import Link from "next/link";

import { productVariantTable } from "@/db/schema";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferSelect)[];
}

const VariantSelector = ({
  variants,
  selectedVariantSlug,
}: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-3">
      {variants.map((variant) => (
        <Link
          href={`/product-variant/${variant.slug}`}
          key={variant.id}
          className={`group relative rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
            selectedVariantSlug === variant.slug
              ? "border-primary ring-primary/20 ring-2"
              : "border-gray-200 hover:border-gray-300"
          }`}
          title={variant.color}
        >
          <Image
            width={68}
            height={68}
            src={variant.imageUrl}
            alt={variant.color}
            className="rounded-[10px] object-cover"
          />
          {selectedVariantSlug === variant.slug}
        </Link>
      ))}
    </div>
  );
};

export default VariantSelector;
