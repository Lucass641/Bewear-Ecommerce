"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { FilterOption } from "../types/filters";

interface SizeFilterProps {
  options: FilterOption[];
  selectedSizes: string[];
  onChange: (sizes: string[]) => void;
}

const SizeFilter = ({ options, selectedSizes, onChange }: SizeFilterProps) => {
  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      onChange(selectedSizes.filter((s) => s !== size));
    } else {
      onChange([...selectedSizes, size]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium xl:text-base">Tamanhos</h3>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`size-${option.value}`}
              checked={selectedSizes.includes(option.value)}
              onCheckedChange={() => handleSizeToggle(option.value)}
            />
            <label
              htmlFor={`size-${option.value}`}
              className="flex items-center space-x-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <span>{option.label}</span>
              {option.count && (
                <Badge variant="secondary" className="text-xs">
                  {option.count}
                </Badge>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SizeFilter;
