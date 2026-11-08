
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getCategories,
  getProducts,
} from "@/lib/api";

import {
  formatPrice,
  formatUnit,
  formatPercentage,
  getPriceChange,
} from "@/lib/utils";

import type {
  Category,
  Product,
} from "@/types/product";

export default function Navbar() {
  const pathname = usePathname();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    // Set today's Bengali date
    const date = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    setBanglaDate(date);

    // Fetch categories and products
    async function loadNavbarData() {
      try {
        const [categoryData, productData] =
          await Promise.all([
            getCategories(),
            getProducts(),
          ]);

        setCategories(categoryData);
        setProducts(productData);
      } catch (error) {
        console.error("Navbar data loading failed:", error);
      }
    }

    loadNavbarData();
  }, []);

  // Select products for the price ticker
  const tickerProducts = products.slice(0, 12);

  // Repeat products to create an infinite ticker
  const tickerItems = [
    ...tickerProducts,
    ...tickerProducts,
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5eae4] bg-[#f8faf5]">

      {/* TOP NAVBAR */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">

        {/* LOGO */}
        <Link
          href="/"
          className="shrink-0"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-[#16834a] sm:text-3xl">
            🛒 বাজার দর
          </h1>

          <p className="mt-1 text-xs text-[#718074]">
            {banglaDate || "আজকের বাজার"}
          </p>
        </Link>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-2">

          <Link
            href="/signin"
            className="rounded-lg border border-[#16834a] px-3 py-2 text-sm font-semibold text-[#16834a] transition hover:bg-[#eaf5ed] sm:px-5"
          >
            সাইন ইন
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-[#16834a] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#10683a] sm:px-5"
          >
            সাইন আপ
          </Link>

        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <div className="border-t border-[#e5eae4]">
        <nav className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3">

          <Link
            href="/"
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              pathname === "/"
                ? "bg-[#16834a] text-white"
                : "text-[#536157] hover:bg-[#eaf5ed] hover:text-[#16834a]"
            }`}
          >
            সব পণ্য
          </Link>

          {categories.map((category) => {
            const isActive =
              pathname === `/category/${category.slug}`;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#16834a] text-white"
                    : "text-[#536157] hover:bg-[#eaf5ed] hover:text-[#16834a]"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.nameBn}</span>
              </Link>
            );
          })}

        </nav>
      </div>

      {/* PRICE TICKER */}
      <div className="overflow-hidden border-t border-[#e5eae4] bg-[#18251c] py-2.5">

        <div className="ticker-track flex w-max items-center">

          {tickerItems.length > 0 ? (
            tickerItems.map((product, index) => {
              const change = getPriceChange(
                product.today,
                product.yesterday
              );

              const isUp = change > 0;
              const isDown = change < 0;

              return (
                <div
                  key={`${product.id}-${index}`}
                  className="flex shrink-0 items-center gap-2 px-5 text-sm text-white"
                >
                  <span className="text-lg">
                    {product.image}
                  </span>

                  <span className="font-semibold">
                    {product.nameBn}
                  </span>

                  <span className="text-[#d7e4d8]">
                    {formatPrice(product.today)}
                  </span>

                  <span className="text-xs text-[#aab9ac]">
                    {formatUnit(product.unit)}
                  </span>

                  <span
                    className={`font-bold ${
                      isUp
                        ? "text-green-400"
                        : isDown
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {isUp
                      ? "▲"
                      : isDown
                      ? "▼"
                      : "—"}{" "}
                    {formatPercentage(change)}
                  </span>

                  <span className="ml-4 text-[#607267]">
                    •
                  </span>
                </div>
              );
            })
          ) : (
            <div className="px-5 text-sm text-white">
              বাজার দর — আজকের পণ্যের দাম লোড হচ্ছে...
            </div>
          )}

        </div>
      </div>

    </header>
  );
}
