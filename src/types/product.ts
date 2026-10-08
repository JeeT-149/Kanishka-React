export type Category = "single" | "blends" | "tea" | "gear";

export type RoastLevel = 1 | 2 | 3 | 4 | 5;

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  image: string;
  images: string[];
  origin?: string;
  roast?: RoastLevel;
  tastingNotes?: string[];
  weight?: string;
  inStock?: boolean;
  description?: string;
  reviewCount?: number;
  brewRecipe?: string;
  featured?: number;
}

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "single", label: "Single Origin Coffee" },
  { id: "blends", label: "Blends" },
  { id: "tea", label: "Tea" },
  { id: "gear", label: "Brew Gear" },
];

export const categoryLabel = (category: Category): string =>
  CATEGORIES.find((item) => item.id === category)?.label ?? category;
