"use client";

import { useMemo, useState } from "react";

import ProductItem from "@/components/common/product-item";

import { CategoryFilters } from "../types/filters";
import {
  filterProducts,
  getAvailableSizes,
  getUniqueColors,
  ProductWithVariants,
  sortProducts,
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
  products: ProductWithVariants[];
}

const defaultFilters: CategoryFilters = {
  search: "",
  colors: [],
  sizes: [],
  sortBy: "price-asc",
};

const CategoryPageClient = ({
  category,
  products,
}: CategoryPageClientProps) => {
  const [filters, setFilters] = useState<CategoryFilters>(defaultFilters);

  const colorOptions = useMemo(() => getUniqueColors(products), [products]);
  const availableSizeOptions = useMemo(
    () => getAvailableSizes(category.name),
    [category.name],
  );

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = filterProducts(products, filters);
    return sortProducts(filtered, filters.sortBy);
  }, [products, filters]);

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
            productCount={filteredAndSortedProducts.length}
            filters={filters}
            colorOptions={colorOptions}
            sizeOptions={availableSizeOptions}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
          />

          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
              {filteredAndSortedProducts.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  textContainerClassName="max-w-full"
                />
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
