
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

  // LOAD DATE, CATEGORIES AND PRODUCTS
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

  // CLOSE MENU WHEN ROUTE CHANGES
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // SIGN OUT
  async function handleSignOut() {
    try {
      await signOut();
      setMenuOpen(false);
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  // USER INFORMATION
  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  // PRICE TICKER DATA
  const tickerProducts = products.slice(0, 12);
  const tickerItems = [...tickerProducts, ...tickerProducts];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5eae4] bg-[#f8faf5]">

      {/* TOP NAVBAR */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-4">

        {/* LOGO */}
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2"
        >
          <img
            src="/assets/logo.png"
            alt="Bazar Dor Logo"
            className="h-9 w-9 shrink-0 object-contain sm:h-12 sm:w-12"
          />

          <div className="min-w-0">
            <h1 className="whitespace-nowrap text-lg font-extrabold tracking-tight text-[#16834a] sm:text-3xl">
              বাজার দর
            </h1>

            <p className="mt-0.5 whitespace-nowrap text-[10px] text-[#718074] sm:text-xs">
              {banglaDate || "আজকের বাজার"}
            </p>
          </div>
        </Link>

        {/* DESKTOP AUTH SECTION */}
        <div className="relative hidden shrink-0 items-center gap-2 md:flex">

          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-[#eaf5ed]" />
          ) : user ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 rounded-full px-2 py-1.5 transition hover:bg-[#eaf5ed]"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={userName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcfce7] font-bold text-[#16834a]">
                    {userInitial}
                  </span>
                )}

                <span className="text-sm font-medium text-[#18251c]">
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
                className="rounded-lg border border-[#16834a] px-5 py-2 text-sm font-semibold text-[#16834a] transition hover:bg-[#eaf5ed]"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-[#16834a] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#10683a]"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#536157] transition hover:bg-[#eaf5ed] md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* DESKTOP CATEGORY NAVIGATION */}
      <nav className="hidden border-t border-[#e5eae4] md:block">
        <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2">

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
            const isActive =
              pathname === `/category/${category.slug}`;

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

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">

          {/* OVERLAY */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* DRAWER PANEL */}
          <aside className="absolute right-0 top-0 flex h-[100dvh] w-[85%] max-w-[320px] flex-col overflow-hidden bg-white shadow-2xl">

            {/* DRAWER HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src="/assets/logo.png"
                  alt="BazarDor"
                  className="h-10 w-10 rounded-lg object-contain"
                />

                <div>
                  <h2 className="text-lg font-extrabold text-[#16834a]">
                    বাজার দর
                  </h2>

                  <p className="text-[10px] text-gray-500">
                    {banglaDate || "আজকের বাজার"}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
                className="flex h-9 w-9 items-center justify-center text-2xl text-gray-600 hover:text-black"
              >
                ×
              </button>
            </div>

            {/* MOBILE CATEGORY LIST */}
            <nav className="flex-1 overflow-y-auto py-3">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`block px-5 py-3 text-sm font-bold ${
                  pathname === "/"
                    ? "bg-[#eaf8ef] text-[#16834a]"
                    : "text-[#536157]"
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
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium ${
                      isActive
                        ? "bg-[#eaf8ef] text-[#16834a]"
                        : "text-[#536157] hover:bg-gray-50"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.nameBn}</span>
                  </Link>
                );
              })}
            </nav>

            {/* MOBILE ACCOUNT SECTION */}
            <div className="shrink-0 border-t border-gray-100">

              {isPending ? (
                <div className="m-4 h-14 animate-pulse rounded-lg bg-[#eaf8ef]" />
              ) : user ? (
                <>
                  {/* USER INFORMATION */}
                  <div className="flex items-center gap-3 bg-[#f5faf6] px-4 py-3">

                    {user.image ? (
                      <img
                        src={user.image}
                        alt={userName}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] font-bold text-[#16834a]">
                        {userInitial}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#18251c]">
                        {userName}
                      </p>

                      <p className="truncate text-[11px] text-gray-500">
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  {/* MY PROFILE */}
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 bg-[#eaf8ef] px-5 py-3 text-sm font-semibold text-[#16834a]"
                  >
                    <span>♙</span>
                    আমার প্রোফাইল
                  </Link>

                  {/* SIGN OUT */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 bg-white px-5 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <span>⇥</span>
                    সাইন আউট
                  </button>
                </>
              ) : (
                /* SIGN IN / SIGN UP */
                <div className="grid grid-cols-2 gap-3 p-4">

                  <Link
                    href="/signin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg border border-[#16834a] py-3 text-center text-sm font-semibold text-[#16834a]"
                  >
                    সাইন ইন
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg bg-[#16834a] py-3 text-center text-sm font-semibold text-white"
                  >
                    সাইন আপ
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

    </header>
  );
}
