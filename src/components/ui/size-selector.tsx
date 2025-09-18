"use client";

import { cn } from "@/lib/utils";

export type Size =
  | "P"
  | "M"
  | "G"
  | "GG"
  | "ÚNICO"
  | "37"
  | "38"
  | "39"
  | "40"
  | "41"
  | null;

interface SizeSelectorProps {
  value: Size;
  onValueChange: (size: Size) => void;
  className?: string;
  disabled?: boolean;
  isAccessory?: boolean;
  isShoe?: boolean;
}

const clothingSizes: Exclude<
  Size,
  null | "ÚNICO" | "37" | "38" | "39" | "40" | "41"
>[] = ["P", "M", "G", "GG"];
const accessorySize: Exclude<Size, null>[] = ["ÚNICO"];
const shoeSizes: Exclude<Size, null | "ÚNICO" | "P" | "M" | "G" | "GG">[] = [
  "37",
  "38",
  "39",
  "40",
  "41",
];

const SizeSelector = ({
  value,
  onValueChange,
  className,
  disabled = false,
  isAccessory = false,
  isShoe = false,
}: SizeSelectorProps) => {
  const availableSizes = isAccessory
    ? accessorySize
    : isShoe
      ? shoeSizes
      : clothingSizes;

  // Para acessórios, mostrar apenas o tamanho ÚNICO (já selecionado)
  if (isAccessory) {
    return (
      <div className={cn("space-y-3", className)}>
        <h3 className="text-sm font-medium">Tamanho</h3>
        <div className="flex gap-3">
          <div className="border-primary bg-primary text-primary-foreground flex h-10 w-16 items-center justify-center rounded-lg border text-sm font-medium">
            ÚNICO
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium">Selecionar tamanho</h3>
      <div className="flex gap-3">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onValueChange(size)}
            disabled={disabled}
            className={cn(
              "flex h-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
              "focus:ring-ring hover:border-gray-300 focus:ring-2 focus:ring-offset-2 focus:outline-none",
              "disabled:pointer-events-none disabled:opacity-50",
              size === "GG" || size === "ÚNICO" ? "w-12 px-2" : "w-10",
              value === size
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background border-gray-200",
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
