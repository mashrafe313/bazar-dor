
import type { Product } from "@/types/product";

// Convert English digits into Bengali digits
export function toBengaliNumber(
  value: number | string
): string {
  const bengaliDigits = [
    "০", "১", "২", "৩", "৪",
    "৫", "৬", "৭", "৮", "৯",
  ];

  return String(value).replace(
    /\d/g,
    (digit) => bengaliDigits[Number(digit)]
  );
}

// Format currency using Bengali digits
export function formatPrice(
  price: number
): string {
  return `${toBengaliNumber(
    new Intl.NumberFormat("en-IN").format(price)
  )} টাকা`;
}

// Format percentage
export function formatPercentage(
  value: number
): string {
  return `${toBengaliNumber(
    Math.abs(value).toFixed(1)
  )}%`;
}

// Calculate price change percentage
export function getPriceChange(
  today: number,
  yesterday: number
): number {
  if (yesterday === 0) return 0;

  return (
    ((today - yesterday) / yesterday) * 100
  );
}

// Get price change information
export function getPriceStatus(
  today: number,
  yesterday: number
) {
  const change = getPriceChange(today, yesterday);

  if (change > 0) {
    return {
      direction: "up" as const,
      color: "text-green-600",
      symbol: "▲",
      percentage: formatPercentage(change),
    };
  }

  if (change < 0) {
    return {
      direction: "down" as const,
      color: "text-red-600",
      symbol: "▼",
      percentage: formatPercentage(change),
    };
  }

  return {
    direction: "flat" as const,
    color: "text-gray-500",
    symbol: "—",
    percentage: "০.০%",
  };
}

// Format product unit in Bengali
export function formatUnit(unit: string): string {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    l: "প্রতি লিটার",
    pcs: "প্রতি পিস",
    piece: "প্রতি পিস",
    dozen: "প্রতি ডজন",
    packet: "প্রতি প্যাকেট",
    gm: "প্রতি গ্রাম",
    g: "প্রতি গ্রাম",
  };

  return units[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

// Calculate average price from market data
export function getAveragePrice(
  product: Product
): number {
  if (!product.markets?.length) {
    return product.today;
  }

  const total = product.markets.reduce(
    (sum, market) =>
      sum + (market.min + market.max) / 2,
    0
  );

  return Math.round(total / product.markets.length);
}

// Get minimum market price
export function getMinimumPrice(
  product: Product
): number {
  if (!product.markets?.length) {
    return product.today;
  }

  return Math.min(
    ...product.markets.map((market) => market.min)
  );
}

// Get maximum market price
export function getMaximumPrice(
  product: Product
): number {
  if (!product.markets?.length) {
    return product.today;
  }

  return Math.max(
    ...product.markets.map((market) => market.max)
  );
}

// Sort products by numeric price
export function sortProducts(
  products: Product[],
  sort: "default" | "price-asc" | "price-desc"
): Product[] {
  const sorted = [...products];

  if (sort === "price-asc") {
    return sorted.sort(
      (a, b) => a.today - b.today
    );
  }

  if (sort === "price-desc") {
    return sorted.sort(
      (a, b) => b.today - a.today
    );
  }

  return sorted;
}
