
import type { Product, Category } from "@/types/product";

const API_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchFromAPI<T>(
  endpoint: string
): Promise<T> {
  let lastError: unknown;

  for (const baseURL of API_URLS) {
    try {
      const response = await fetch(
        `${baseURL}${endpoint}`,
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `API error: ${response.status}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      console.error(
        `Failed API: ${baseURL}${endpoint}`,
        error
      );
    }
  }

  throw new Error(
    `All Bazar Dor APIs failed: ${String(lastError)}`
  );
}

// Extract arrays from different possible API wrappers
function extractArray<T>(
  payload: unknown,
  keys: string[]
): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (
    typeof payload === "object" &&
    payload !== null
  ) {
    const object = payload as Record<string, unknown>;

    for (const key of keys) {
      if (Array.isArray(object[key])) {
        return object[key] as T[];
      }
    }

    for (const value of Object.values(object)) {
      if (
        typeof value === "object" &&
        value !== null
      ) {
        try {
          return extractArray<T>(value, keys);
        } catch {
          // Continue checking other properties
        }
      }
    }
  }

  throw new Error("Invalid API data format");
}

// Extract a single object from an API response
function extractObject<T>(
  payload: unknown,
  keys: string[]
): T {
  if (
    typeof payload === "object" &&
    payload !== null
  ) {
    const object = payload as Record<string, unknown>;

    if ("id" in object && "slug" in object) {
      return object as T;
    }

    for (const key of keys) {
      if (
        typeof object[key] === "object" &&
        object[key] !== null
      ) {
        try {
          return extractObject<T>(object[key], keys);
        } catch {
          // Continue checking
        }
      }
    }
  }

  throw new Error("Invalid object data");
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const response = await fetchFromAPI<unknown>(
    "/products"
  );

  return extractArray<Product>(
    response,
    ["data", "products", "result", "items"]
  );
}

// Get a single product
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  // First try finding the product in the full list
  const products = await getProducts();

  const product = products.find(
    (item) => item.slug === slug
  );

  if (product) {
    return product;
  }

  // Try the individual product endpoint
  try {
    const response = await fetchFromAPI<unknown>(
      `/products/${encodeURIComponent(slug)}`
    );

    return extractObject<Product>(
      response,
      ["data", "product", "result"]
    );
  } catch {
    return null;
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetchFromAPI<unknown>(
    "/categories"
  );

  return extractArray<Category>(
    response,
    ["data", "categories", "result", "items"]
  );
}

// Get a single category
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const categories = await getCategories();

  return (
    categories.find(
      (category) => category.slug === slug
    ) ?? null
  );
}

// Get products by category
export async function getProductsByCategory(
  slug: string
): Promise<Product[]> {
  try {
    const response = await fetchFromAPI<unknown>(
      `/products?category=${encodeURIComponent(slug)}`
    );

    return extractArray<Product>(
      response,
      ["data", "products", "result", "items"]
    );
  } catch {
    // Fallback: filter locally if category data exists
    const products = await getProducts();

    return products.filter(
      (product) =>
        product.category === slug ||
        product.categoryId === slug ||
        product.categorySlug === slug
    );
  }
}
