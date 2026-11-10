
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change?: {
    dir: string;
    pct: number;
  };
};

type SortOption = "default" | "low" | "high";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD").format(price);

function getArray<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];

  if (response && typeof response === "object") {
    const data = response as {
      data?: unknown;
      products?: unknown;
      categories?: unknown;
    };

    if (Array.isArray(data.data)) return data.data as T[];
    if (Array.isArray(data.products)) return data.products as T[];
    if (Array.isArray(data.categories)) return data.categories as T[];
  }

  return [];
}

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    dozen: "প্রতি ডজন",
  };

  return units[unit?.toLowerCase()] || `প্রতি ${unit}`;
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e5eae4] bg-white p-5">
      <div className="mb-5 h-16 w-16 rounded-2xl bg-gray-200" />
      <div className="mb-3 h-5 w-2/3 rounded bg-gray-200" />
      <div className="mb-5 h-4 w-1/3 rounded bg-gray-200" />
      <div className="h-10 rounded bg-gray-200" />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const difference = product.today - product.yesterday;

  const percentage =
    product.yesterday > 0
      ? (difference / product.yesterday) * 100
      : 0;

  const isUp = difference > 0;
  const isDown = difference < 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group min-w-0 rounded-2xl border border-[#e5eae4] bg-white p-4 transition-all duration-300 hover:border-[#16834a] hover:shadow-lg sm:p-5 sm:hover:-translate-y-1"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f7ef] text-4xl">
          {product.image || "🛒"}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isUp
              ? "bg-green-100 text-green-700"
              : isDown
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isUp
            ? `▲ ${formatPrice(Number(percentage.toFixed(1)))}%`
            : isDown
            ? `▼ ${formatPrice(Number(Math.abs(percentage).toFixed(1)))}%`
            : "— ০.০%"}
        </span>
      </div>

     <h3 className="mb-1 break-words text-lg font-bold text-[#18251c] sm:text-xl">
        {product.nameBn}
      </h3>

      <p className="mb-4 text-sm text-[#718074]">
        {getUnit(product.unit)}
      </p>

      <div className="flex items-center justify-between border-t border-[#e5eae4] pt-4">
        <div>
          <p className="text-xs text-[#718074]">আজকের দাম</p>
          <p className="text-xl font-bold text-[#16834a] sm:text-2xl">
            {formatPrice(product.today)} টাকা
          </p>
        </div>

        <span className="text-2xl text-[#16834a] transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse] =
          await Promise.all([
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/categories`),
          ]);

        if (!productResponse.ok || !categoryResponse.ok) {
          throw new Error("তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
        }

        const [productData, categoryData] = await Promise.all([
          productResponse.json(),
          categoryResponse.json(),
        ]);

        if (!active) return;

        setProducts(getArray<Product>(productData));
        setCategories(getArray<Category>(categoryData));
      } catch (err) {
        console.error("Category API Error:", err);

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "কিছু একটা সমস্যা হয়েছে।"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const category = categories.find(
    (item) => item.slug === slug || item.id === slug
  );

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(
      (product) => product.category === slug
    );

    if (sort === "low") {
      return [...filtered].sort(
        (a, b) => Number(a.today) - Number(b.today)
      );
    }

    if (sort === "high") {
      return [...filtered].sort(
        (a, b) => Number(b.today) - Number(a.today)
      );
    }

    return filtered;
  }, [products, slug, sort]);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-3 py-8 sm:px-5 sm:py-12">
        <div className="mb-10 animate-pulse">
          <div className="mb-4 h-10 w-64 rounded-lg bg-gray-200" />
          <div className="h-5 w-80 rounded-lg bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-5">
        <div className="text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold text-[#18251c]">
            তথ্য লোড করা যায়নি
          </h2>
          <p className="mt-3 text-[#718074]">{error}</p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-[#16834a] px-6 py-3 font-semibold text-white hover:bg-[#116b3b]"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center px-5">
        <div className="text-center">
          <div className="mb-4 text-7xl">🔍</div>

          <h1 className="text-3xl font-bold text-[#18251c]">
            ৪০৪ - ক্যাটাগরি পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-[#718074]">
            দুঃখিত! আপনি যে ক্যাটাগরিটি খুঁজছেন সেটি নেই।
          </p>

          <Link
            href="/"
            className="mt-7 inline-block rounded-xl bg-[#16834a] px-6 py-3 font-semibold text-white transition hover:bg-[#116b3b]"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-3 py-8 sm:px-5 sm:py-12">
      {/* Category Header */}
      <section className="mb-10 rounded-3xl bg-[#f3f7ef] p-7 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-semibold text-[#16834a]">
              বাজার দর / ক্যাটাগরি
            </p>

            <h1 className="text-3xl font-bold text-[#18251c] sm:text-4xl">
              <span className="mr-3">{category.icon}</span>
              {category.nameBn}
            </h1>

            <p className="mt-3 text-[#718074]">
              {category.nameBn} ক্যাটাগরির সকল পণ্যের
              সর্বশেষ বাজারদর এক জায়গায়।
            </p>
          </div>

          <div className="rounded-2xl bg-white px-6 py-4 shadow-sm">
            <p className="text-sm text-[#718074]">
              মোট পণ্য
            </p>
            <p className="text-3xl font-bold text-[#16834a]">
              {formatPrice(filteredProducts.length)}
            </p>
          </div>
        </div>
      </section>

      {/* Products Header and Sorting */}
      <section>
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#18251c]">
              {category.nameBn} এর সকল পণ্য
            </h2>

            <p className="mt-2 text-sm text-[#718074]">
              আজকের বাজারদর অনুযায়ী পণ্যের তালিকা।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="category-sort"
              className="whitespace-nowrap text-sm font-medium text-[#718074]"
            >
              সাজান:
            </label>

            <select
              id="category-sort"
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as SortOption)
              }
              className="w-full rounded-xl border border-[#e5eae4] bg-white px-4 py-3 text-sm font-medium text-[#18251c] outline-none transition focus:border-[#16834a] sm:w-64"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">দাম: কম থেকে বেশি</option>
              <option value="high">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Product Cards */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dce5da] bg-[#f8faf7] px-5 py-16 text-center">
            <div className="mb-4 text-6xl">📦</div>

            <h3 className="text-2xl font-bold text-[#18251c]">
              এই ক্যাটাগরিতে কোনো পণ্য নেই
            </h3>

            <p className="mt-3 text-[#718074]">
              বর্তমানে এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>

            <Link
              href="/"
              className="mt-7 inline-block rounded-xl bg-[#16834a] px-6 py-3 font-semibold text-white hover:bg-[#116b3b]"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
