import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/helpers/money";

import ProductActions from "./components/product-actions";

interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
          category: true,
        },
      },
    },
  });
  if (!productVariant) {
    return notFound();
  }
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16">
      <div className="flex flex-col lg:flex-row lg:gap-8 lg:py-8">
        <div className="lg:w-1/2">
          <Image
            src={productVariant.imageUrl}
            alt={productVariant.name}
            sizes="(max-width: 768px) 100vw, 50vw"
            width={0}
            height={0}
            className="h-auto w-full rounded-lg object-cover"
          />
        </div>

        <div className="flex flex-col space-y-6 py-6 lg:w-1/2 lg:py-0">
          <div className="space-y-2">
            <h1 className="text-xl font-bold lg:text-2xl">
              {productVariant.product.name}
            </h1>
            <h2 className="text-muted-foreground text-sm lg:text-base">
              {productVariant.name}
            </h2>
            <p className="text-xl font-bold lg:text-2xl">
              {formatCentsToBRL(productVariant.priceInCents)}
            </p>
          </div>

          <ProductActions
            productVariantId={productVariant.id}
            isAccessory={productVariant.product.category.slug === "acessrios"}
            isShoe={productVariant.product.category.slug === "tnis"}
          />

          <div>
            <p className="text-muted-foreground text-sm leading-relaxed lg:text-base">
              {productVariant.product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="py-8">
        <ProductList
          title="Você também pode gostar"
          products={likelyProducts}
        />
      </div>
    </div>
  );
};

export default ProductVariantPage;
