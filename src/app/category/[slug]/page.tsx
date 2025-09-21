import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { categoryTable, productTable, productVariantTable } from "@/db/schema";

import CategoryPageClient from "./components/category-page-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  if (!category) {
    return notFound();
  }
  const productVariants = await db
    .select({
      id: productVariantTable.id,
      name: productVariantTable.name,
      slug: productVariantTable.slug,
      color: productVariantTable.color,
      priceInCents: productVariantTable.priceInCents,
      imageUrl: productVariantTable.imageUrl,
      productId: productVariantTable.productId,
      createdAt: productVariantTable.createdAt,
      product: {
        id: productTable.id,
        name: productTable.name,
        slug: productTable.slug,
        description: productTable.description,
        categoryId: productTable.categoryId,
        createdAt: productTable.createdAt,
      },
    })
    .from(productVariantTable)
    .innerJoin(productTable, eq(productVariantTable.productId, productTable.id))
    .where(eq(productTable.categoryId, category.id));

  return (
    <CategoryPageClient category={category} productVariants={productVariants} />
  );
};

export default CategoryPage;
