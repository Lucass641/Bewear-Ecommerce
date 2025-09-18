"use client";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ColorFilter from "./color-filter";
import SearchFilter from "./search-filter";
import SizeFilter from "./size-filter";
import SortFilter from "./sort-filter";
import { CategoryFilters, FilterOption } from "../types/filters";

interface MobileFilterSheetProps {
  filters: CategoryFilters;
  colorOptions: FilterOption[];
  sizeOptions: FilterOption[];
  onFiltersChange: (filters: CategoryFilters) => void;
  onClearFilters: () => void;
}

const MobileFilterSheet = ({
  filters,
  colorOptions,
  sizeOptions,
  onFiltersChange,
  onClearFilters,
}: MobileFilterSheetProps) => {
  const hasActiveFilters =
    filters.search ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.sortBy !== "price-asc";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
              {[
                filters.search ? 1 : 0,
                filters.colors.length,
                filters.sizes.length,
                filters.sortBy !== "price-asc" ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 px-6 py-4">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Filtros</SheetTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                Limpar
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-6">
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;
