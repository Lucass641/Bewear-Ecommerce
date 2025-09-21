import {
  CategoryFilters,
  FilterOption,
  getCategoryType,
} from "../types/filters";
import { searchMatch } from "@/utils/search";

export interface ProductWithVariants {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  createdAt: Date;
  variants: Array<{
    id: string;
    name: string;
    slug: string;
    color: string;
    priceInCents: number;
    imageUrl: string;
    productId: string;
    createdAt: Date;
  }>;
}

export interface ProductVariantWithProduct {
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
}

export function getUniqueColors(
  products: ProductWithVariants[],
): FilterOption[] {
  const colorCounts = new Map<string, number>();

  products.forEach((product) => {
    product.variants.forEach((variant) => {
      const currentCount = colorCounts.get(variant.color) || 0;
      colorCounts.set(variant.color, currentCount + 1);
    });
  });

  return Array.from(colorCounts.entries())
    .map(([color, count]) => ({
      value: color,
      label: color,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getUniqueColorsFromVariants(
  productVariants: ProductVariantWithProduct[],
): FilterOption[] {
  const colorCounts = new Map<string, number>();

  productVariants.forEach((variant) => {
    const currentCount = colorCounts.get(variant.color) || 0;
    colorCounts.set(variant.color, currentCount + 1);
  });

  return Array.from(colorCounts.entries())
    .map(([color, count]) => ({
      value: color,
      label: color,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getAvailableSizes(categoryName: string): FilterOption[] {
  const categoryType = getCategoryType(categoryName);

  switch (categoryType) {
    case "accessories":
      return [{ value: "ÚNICO", label: "Único" }];

    case "sneakers":
      return [
        { value: "37", label: "37" },
        { value: "38", label: "38" },
        { value: "39", label: "39" },
        { value: "40", label: "40" },
        { value: "41", label: "41" },
      ];

    case "clothing":
    default:
      return [
        { value: "P", label: "P" },
        { value: "M", label: "M" },
        { value: "G", label: "G" },
        { value: "GG", label: "GG" },
      ];
  }
}

export function filterProducts(
  products: ProductWithVariants[],
  filters: CategoryFilters,
): ProductWithVariants[] {
  return products.filter((product) => {
    if (filters.search) {
      const matchesSearch =
        searchMatch(filters.search, product.name) ||
        searchMatch(filters.search, product.description) ||
        product.variants.some(
          (variant) =>
            searchMatch(filters.search, variant.name) ||
            searchMatch(filters.search, variant.color),
        );

      if (!matchesSearch) return false;
    }

    if (filters.colors.length > 0) {
      const hasMatchingColor = product.variants.some((variant) =>
        filters.colors.includes(variant.color),
      );
      if (!hasMatchingColor) return false;
    }

    return true;
  });
}

export function sortProducts(
  products: ProductWithVariants[],
  sortBy: CategoryFilters["sortBy"],
): ProductWithVariants[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => {
        const minPriceA = Math.min(...a.variants.map((v) => v.priceInCents));
        const minPriceB = Math.min(...b.variants.map((v) => v.priceInCents));
        return minPriceA - minPriceB;
      });

    case "price-desc":
      return sorted.sort((a, b) => {
        const maxPriceA = Math.max(...a.variants.map((v) => v.priceInCents));
        const maxPriceB = Math.max(...b.variants.map((v) => v.priceInCents));
        return maxPriceB - maxPriceA;
      });

    default:
      return sorted;
  }
}

export function filterProductVariants(
  productVariants: ProductVariantWithProduct[],
  filters: CategoryFilters,
): ProductVariantWithProduct[] {
  return productVariants.filter((variant) => {
    if (filters.search) {
      const matchesSearch =
        searchMatch(filters.search, variant.product.name) ||
        searchMatch(filters.search, variant.product.description) ||
        searchMatch(filters.search, variant.name) ||
        searchMatch(filters.search, variant.color);

      if (!matchesSearch) return false;
    }

    if (filters.colors.length > 0) {
      if (!filters.colors.includes(variant.color)) return false;
    }

    return true;
  });
}

export function sortProductVariants(
  productVariants: ProductVariantWithProduct[],
  sortBy: CategoryFilters["sortBy"],
): ProductVariantWithProduct[] {
  const sorted = [...productVariants];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.priceInCents - b.priceInCents);

    case "price-desc":
      return sorted.sort((a, b) => b.priceInCents - a.priceInCents);

    default:
      return sorted;
  }
}
