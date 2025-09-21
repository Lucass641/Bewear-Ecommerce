import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, productTable, productVariantTable } from "@/db/schema";

export const getAllCategories = async () => {
  const categories = await db.query.categoryTable.findMany({});
  return categories;
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });
  return category;
};

export const getCategoryProductVariants = async (categoryId: string) => {
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
    .where(eq(productTable.categoryId, categoryId));

  return productVariants;
};
