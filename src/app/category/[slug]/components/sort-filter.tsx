"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { sortOptions } from "../types/filters";

interface SortFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const SortFilter = ({ value, onChange }: SortFilterProps) => {
  const selectedOption = sortOptions.find((option) => option.value === value);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium xl:text-base">Ordenar por</h3>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione a ordenação">
            {selectedOption?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortFilter;
