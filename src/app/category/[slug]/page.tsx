import { notFound } from "next/navigation";

import {
  getCategoryBySlug,
  getCategoryProductVariants,
} from "@/data/categories/get";

import CategoryPageClient from "./components/category-page-client";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) {
    return notFound();
  }

  const productVariants = await getCategoryProductVariants(category.id);

  return (
    <CategoryPageClient category={category} productVariants={productVariants} />
  );
};

export default CategoryPage;
