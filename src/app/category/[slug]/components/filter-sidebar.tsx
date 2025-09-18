"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import ColorFilter from "./color-filter";
import SearchFilter from "./search-filter";
import SizeFilter from "./size-filter";
import SortFilter from "./sort-filter";
import { CategoryFilters, FilterOption } from "../types/filters";

interface FilterSidebarProps {
  filters: CategoryFilters;
  colorOptions: FilterOption[];
  sizeOptions: FilterOption[];
  onFiltersChange: (filters: CategoryFilters) => void;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  filters,
  colorOptions,
  sizeOptions,
  onFiltersChange,
  onClearFilters,
}: FilterSidebarProps) => {
  const hasActiveFilters =
    filters.search ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.sortBy !== "price-asc";

  return (
    <div className="bg-background hidden w-80 flex-col space-y-6 border-r p-6 lg:flex xl:w-96">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold xl:text-xl">Filtros</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Limpar
          </Button>
        )}
      </div>

      <SearchFilter
        value={filters.search}
        onChange={(search) => onFiltersChange({ ...filters, search })}
      />

      <Separator />

      <SortFilter
        value={filters.sortBy}
        onChange={(sortBy) =>
          onFiltersChange({
            ...filters,
            sortBy: sortBy as CategoryFilters["sortBy"],
          })
        }
      />

      <Separator />

      {colorOptions.length > 0 && (
        <>
          <ColorFilter
            options={colorOptions}
            selectedColors={filters.colors}
            onChange={(colors) => onFiltersChange({ ...filters, colors })}
          />
          <Separator />
        </>
      )}

      {sizeOptions.length > 0 && (
        <SizeFilter
          options={sizeOptions}
          selectedSizes={filters.sizes}
          onChange={(sizes) => onFiltersChange({ ...filters, sizes })}
        />
      )}
    </div>
  );
};

export default FilterSidebar;
