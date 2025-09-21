"use client";

import { useMemo, useState } from "react";

import ProductVariantItem from "@/components/common/product-variant-item";

import { CategoryFilters } from "../types/filters";
import {
  filterProductVariants,
  getAvailableSizes,
  getUniqueColorsFromVariants,
  ProductVariantWithProduct,
  sortProductVariants,
} from "../utils/filter-utils";
import CategoryHeader from "./category-header";
import FilterSidebar from "./filter-sidebar";

interface CategoryPageClientProps {
  category: {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
  };
  productVariants: ProductVariantWithProduct[];
}

const defaultFilters: CategoryFilters = {
  search: "",
  colors: [],
  sizes: [],
  sortBy: "price-asc",
};

const CategoryPageClient = ({
  category,
  productVariants,
}: CategoryPageClientProps) => {
  const [filters, setFilters] = useState<CategoryFilters>(defaultFilters);

  const colorOptions = useMemo(
    () => getUniqueColorsFromVariants(productVariants),
    [productVariants],
  );
  const availableSizeOptions = useMemo(
    () => getAvailableSizes(category.name),
    [category.name],
  );

  const filteredAndSortedVariants = useMemo(() => {
    const filtered = filterProductVariants(productVariants, filters);
    return sortProductVariants(filtered, filters.sortBy);
  }, [productVariants, filters]);

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="mx-auto max-w-[1920px] px-5 md:px-10 xl:px-16 2xl:px-20">
      <div className="flex min-h-screen gap-6">
        <FilterSidebar
          filters={filters}
          colorOptions={colorOptions}
          sizeOptions={availableSizeOptions}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        <div className="flex-1 space-y-6 py-6">
          <CategoryHeader
            categoryName={category.name}
            productCount={filteredAndSortedVariants.length}
            filters={filters}
            colorOptions={colorOptions}
            sizeOptions={availableSizeOptions}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />

          {filteredAndSortedVariants.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredAndSortedVariants.map((variant) => (
                <ProductVariantItem key={variant.id} variant={variant} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-muted-foreground text-lg font-medium">
                Nenhum produto encontrado
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Tente ajustar os filtros para encontrar mais produtos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPageClient;
