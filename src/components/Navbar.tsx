
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { getCategories, getProducts } from "@/lib/api";
import {
  formatPrice,
  formatUnit,
  formatPercentage,
  getPriceChange,
} from "@/lib/utils";

import { useSession, signOut } from "@/lib/auth-client";

import type { Category, Product } from "@/types/product";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banglaDate, setBanglaDate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const date = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    setBanglaDate(date);

    async function loadNavbarData() {
      try {
        const [categoryData, productData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(categoryData);
        setProducts(productData);
      } catch (error) {
        console.error("Navbar loading failed:", error);
      }
    }

    loadNavbarData();
  }, []);

  async function handleSignOut() {
    try {
      await signOut();
      setMenuOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const tickerProducts = products.slice(0, 12);
  const tickerItems = [...tickerProducts, ...tickerProducts];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5eae4] bg-[#f8faf5]">

      {/* TOP NAVBAR */}
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:flex-nowrap sm:px-4 sm:py-4">

        {/* LOGO */}
        <Link href="/" className="shrink-0">
          <h1 className="text-xl font-extrabold tracking-tight text-[#16834a] sm:text-3xl">
            বাজার দর
          </h1>

          <p className="mt-1 text-xs text-[#718074]">
            {banglaDate || "আজকের বাজার"}
          </p>
        </Link>

        {/* AUTH SECTION */}
        <div className="relative flex shrink-0 items-center gap-2">

          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-[#eaf5ed]" />
          ) : user ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 rounded-full px-2 py-1.5 transition hover:bg-[#eaf5ed]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcfce7] font-bold text-[#16834a]">
                  {userInitial}
                </span>

                <span className="hidden text-sm font-medium text-[#18251c] sm:block">
                  {userName}
                </span>

                <span className="text-xs text-[#718074]">
                  {menuOpen ? "▲" : "▼"}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-[#e5eae4] bg-white p-4 shadow-xl">

                  <div className="border-b border-[#e5eae4] pb-3">
                    <p className="font-bold text-[#18251c]">
                      {userName}
                    </p>

                    <p className="mt-1 break-all text-xs text-[#718074]">
                      {userEmail}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-[#536157] transition hover:bg-[#eaf5ed] hover:text-[#16834a]"
                  >
                    <span>♙</span>
                    আমার প্রোফাইল
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <span>↪</span>
                    সাইন আউট
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <nav className="border-t border-[#e5eae4]">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-3 py-2 sm:px-4">

          <Link
            href="/"
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              pathname === "/"
                ? "bg-[#eaf5ed] text-[#16834a]"
                : "text-[#536157] hover:bg-[#eaf5ed] hover:text-[#16834a]"
            }`}
          >
            সব পণ্য
          </Link>

          {categories.map((category) => {
            const isActive = pathname === `/category/${category.slug}`;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#eaf5ed] text-[#16834a]"
                    : "text-[#536157] hover:bg-[#eaf5ed] hover:text-[#16834a]"
                }`}
              >
                {category.icon} {category.nameBn}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* PRICE TICKER */}
      {tickerItems.length > 0 && (
        <div className="overflow-hidden border-t border-[#e5eae4] bg-[#eaf5ed] py-2.5">
          <div className="ticker-track flex w-max items-center">
            {tickerItems.map((product, index) => {
              const change = getPriceChange(
                product.today,
                product.yesterday
              );

              return (
                <Link
                  key={`${product.id}-${index}`}
                  href={`/product/${product.slug}`}
                  className="flex shrink-0 items-center gap-2 px-5 text-sm text-[#536157]"
                >
                  <span>{product.nameBn}</span>

                  <span className="font-bold">
                    {formatPrice(product.today)}
                  </span>

                  <span className="text-[#718074]">
                    / {formatUnit(product.unit)}
                  </span>

                  <span
                    className={
                      change > 0
                        ? "font-semibold text-red-600"
                        : change < 0
                        ? "font-semibold text-green-700"
                        : "text-gray-500"
                    }
                  >
                    {change > 0 ? "▲" : change < 0 ? "▼" : "—"}
                    {" "}
                    {formatPercentage(change)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
}
