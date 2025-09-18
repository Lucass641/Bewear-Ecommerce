export interface CategoryFilters {
  search: string;
  colors: string[];
  sizes: string[];
  sortBy: "price-asc" | "price-desc";
}

export type CategoryType = "accessories" | "sneakers" | "clothing";

export function getCategoryType(categoryName: string): CategoryType {
  const name = categoryName.toLowerCase();
  if (name.includes("acessórios")) return "accessories";
  if (name.includes("tênis")) return "sneakers";
  return "clothing";
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export const sortOptions: FilterOption[] = [
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
];

export const sizeOptions: FilterOption[] = [
  { value: "P", label: "P" },
  { value: "M", label: "M" },
  { value: "G", label: "G" },
  { value: "GG", label: "GG" },
  { value: "ÚNICO", label: "Único" },
  { value: "37", label: "37" },
  { value: "38", label: "38" },
  { value: "39", label: "39" },
  { value: "40", label: "40" },
  { value: "41", label: "41" },
];
