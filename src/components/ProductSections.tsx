
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  today: number;
  yesterday: number;
  unit: string;
  category?: string;
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD").format(price);

const getUnit = (unit: string) => {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
    dozen: "প্রতি ডজন",
  };

  return units[unit?.toLowerCase()] || `প্রতি ${unit}`;
};

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

export default function ProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য পাওয়া যায়নি");
        }

        const result = await response.json();

        const productList = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.products)
          ? result.products
          : [];

        if (productList.length === 0) {
          throw new Error("কোনো পণ্য পাওয়া যায়নি");
        }

        setProducts(productList);
      } catch (err) {
        console.error("Product API Error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "কিছু একটা সমস্যা হয়েছে"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const risingProducts = [...products]
    .filter((product) => product.today > product.yesterday)
    .sort(
      (a, b) =>
        (b.today - b.yesterday) / b.yesterday -
        (a.today - a.yesterday) / a.yesterday
    )
    .slice(0, 6);

  const fallingProducts = [...products]
    .filter((product) => product.today < product.yesterday)
    .sort(
      (a, b) =>
        (a.today - a.yesterday) / a.yesterday -
        (b.today - b.yesterday) / b.yesterday
    )
    .slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl space-y-14 px-3 py-10 sm:space-y-20 sm:px-5 sm:py-16">

      {/* Rising Products */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#18251c] sm:text-3xl">
            আজ দাম বেড়েছে <span className="text-green-600">▲</span>
          </h2>
          <p className="mt-2 text-[#718074]">
            যেসব পণ্যের দাম গতকালের তুলনায় বেড়েছে
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : risingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Falling Products */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#18251c] sm:text-3xl">
            আজ দাম কমেছে <span className="text-red-500">▼</span>
          </h2>
          <p className="mt-2 text-[#718074]">
            যেসব পণ্যের দাম গতকালের তুলনায় কমেছে
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : fallingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* All Products */}
      <section id="সব-পণ্য">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#18251c] sm:text-3xl">
            সব পণ্য
          </h2>
          <p className="mt-2 text-[#718074]">
            প্রতিদিনের প্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর এক জায়গায়
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 p-8 text-center text-red-600">
            <p>{error}</p>
            <p className="mt-2 text-sm">
              পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
