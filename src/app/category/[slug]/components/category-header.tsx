"use client";

import MobileFilterSheet from "./mobile-filter-sheet";
import { CategoryFilters, FilterOption } from "../types/filters";

interface CategoryHeaderProps {
  categoryName: string;
  productCount: number;
  filters: CategoryFilters;
  colorOptions: FilterOption[];
  sizeOptions: FilterOption[];
  onFiltersChange: (filters: CategoryFilters) => void;
  onClearFilters: () => void;
}

const CategoryHeader = ({
  categoryName,
  productCount,
  filters,
  colorOptions,
  sizeOptions,
  onFiltersChange,
  onClearFilters,
}: CategoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold lg:text-2xl xl:text-3xl">
          {categoryName}
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          {productCount}{" "}
          {productCount === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </div>

      <MobileFilterSheet
        filters={filters}
        colorOptions={colorOptions}
        sizeOptions={sizeOptions}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    </div>
  );
};

export default CategoryHeader;
