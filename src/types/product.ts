
export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number;
  image: string;
  lastMonth: number;
  lastWeek: number;
  markets: MarketPrice[];
  nameBn: string;
  slug: string;
  today: number;
  unit: string;
  yesterday: number;

  // Optional fields for API category filtering
  category?: string;
  categoryId?: string;
  categorySlug?: string;
  description?: string;
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface ApiResponse<T> {
  data: T[];
  Count?: number;
}

export type SortOption =
  | "default"
  | "price-asc"
  | "price-desc";
