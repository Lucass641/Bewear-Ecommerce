"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { FilterOption } from "../types/filters";

const getColorValue = (color: string): string => {
  const colorMap: Record<string, string> = {
    preta: "#000000",
    preto: "#000000",
    branca: "#FFFFFF",
    branco: "#FFFFFF",
    azul: "#1e40af",
    vermelho: "#dc2626",
    verde: "#16a34a",
    amarelo: "#eab308",
    rosa: "#ec4899",
    roxo: "#7c3aed",
    marrom: "#a16207",
    cinza: "#6b7280",
    laranja: "#ea580c",
    vinho: "#7f1d1d",
    bege: "#d6d3d1",
  };

  return colorMap[color.toLowerCase()] || "#6b7280";
};

interface ColorFilterProps {
  options: FilterOption[];
  selectedColors: string[];
  onChange: (colors: string[]) => void;
}

const ColorFilter = ({
  options,
  selectedColors,
  onChange,
}: ColorFilterProps) => {
  const handleColorToggle = (color: string) => {
    if (selectedColors.includes(color)) {
      onChange(selectedColors.filter((c) => c !== color));
    } else {
      onChange([...selectedColors, color]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium xl:text-base">Cores</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <Checkbox
              id={`color-${option.value}`}
              checked={selectedColors.includes(option.value)}
              onCheckedChange={() => handleColorToggle(option.value)}
            />
            <label
              htmlFor={`color-${option.value}`}
              className="flex items-center space-x-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <div
                className="h-4 w-4 rounded-full border border-gray-300 shadow-sm"
                style={{
                  backgroundColor: getColorValue(option.value),
                  ...(option.value.toLowerCase().includes("branco") ||
                  option.value.toLowerCase().includes("branca")
                    ? { border: "1px solid #d1d5db" }
                    : {}),
                }}
              />
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

export default ColorFilter;
