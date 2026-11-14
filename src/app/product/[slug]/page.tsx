
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  unit: string;
  markets: Market[];
};

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(price);

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

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();

    const products = Array.isArray(result)
      ? result
      : Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.products)
          ? result.products
          : [];

    return (
      products.find((product: Product) => product.slug === slug) ||
      null
    );
  } catch (error) {
    console.error("Product fetching error:", error);
    throw error;
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // AUTHENTICATION CHECK
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const { slug } = await params;

  let product: Product | null;

  try {
    product = await getProduct(slug);
  } catch {
    return (
      <main className="min-h-screen bg-[#f0f6f1] px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#18251c]">
            তথ্য লোড করা যাচ্ছে না
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>

          <Link
            href="/"
            className="mt-5 inline-block rounded-lg bg-[#16834a] px-5 py-2.5 text-sm font-semibold text-white"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    notFound();
  }

  const markets = product.markets || [];

  const minimumPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => Number(market.min)))
      : product.today;

  const maximumPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => Number(market.max)))
      : product.today;

  const averagePrice =
    markets.length > 0
      ? markets.reduce(
          (total, market) =>
            total +
            (Number(market.min) + Number(market.max)) / 2,
          0
        ) / markets.length
      : product.today;

  const difference = product.today - product.yesterday;

  const percentage =
    product.yesterday > 0
      ? (difference / product.yesterday) * 100
      : 0;

  const isUp = difference > 0;
  const isDown = difference < 0;

  const imageIsUrl =
    product.image?.startsWith("http") ||
    product.image?.startsWith("/");

  return (
    <main className="min-h-screen bg-[#f0f6f1] px-3 py-5 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-5xl">

        {/* BREADCRUMB */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#718074]">
          <Link href="/" className="hover:text-[#16834a]">
            হোম
          </Link>

          <span>›</span>

          <Link href="/" className="hover:text-[#16834a]">
            পণ্য
          </Link>

          <span>›</span>

          <span className="font-medium text-[#16834a]">
            {product.nameBn}
          </span>
        </div>

        {/* PRODUCT SUMMARY CARD */}
        <section className="rounded-xl border border-[#e3ebe4] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3 sm:gap-5">

            {/* PRODUCT IMAGE */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f6f1] sm:h-20 sm:w-20">
              {imageIsUrl ? (
                <img
                  src={product.image}
                  alt={product.nameBn}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="text-3xl sm:text-4xl">
                  {product.image || "🛒"}
                </span>
              )}
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold text-[#18251c] sm:text-xl">
                {product.nameBn}
              </h1>

              <p className="mt-1 text-xs text-[#718074]">
                একক: {getUnit(product.unit)}
              </p>

              <p className="mt-1 text-[11px] text-[#718074] sm:text-xs">
                বাংলাদেশের বিভিন্ন বাজারে আজকের বাজারদর
              </p>
            </div>

            {/* TODAY PRICE */}
            <div className="shrink-0 rounded-xl bg-[#f0f6f1] px-3 py-3 text-center sm:px-5">
              <p className="text-[10px] text-[#718074] sm:text-xs">
                আজকের বাজার দর
              </p>

              <p className="mt-1 text-xl font-extrabold text-[#18251c] sm:text-2xl">
                {formatPrice(product.today)}
              </p>

              <p className="text-[10px] text-[#718074]">
                টাকা / {getUnit(product.unit)}
              </p>

              <p
                className={`mt-1 text-[10px] font-bold ${
                  isUp
                    ? "text-red-600"
                    : isDown
                      ? "text-green-700"
                      : "text-gray-500"
                }`}
              >
                {isUp
                  ? `▲ ${formatPrice(Math.abs(percentage))}%`
                  : isDown
                    ? `▼ ${formatPrice(Math.abs(percentage))}%`
                    : "— ০.০%"}
              </p>
            </div>
          </div>
        </section>

        {/* PRICE ANALYSIS */}
        <section className="mt-4 rounded-xl border border-[#e3ebe4] bg-white p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-bold text-[#18251c]">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">

            {/* MINIMUM */}
            <div className="rounded-xl border border-[#e5eee7] bg-[#fbfdfb] p-3 sm:p-4">
              <p className="text-[10px] text-[#718074] sm:text-xs">
                সর্বনিম্ন দাম
              </p>

              <h3 className="mt-2 text-lg font-extrabold text-green-600 sm:text-2xl">
                {formatPrice(minimumPrice)} টাকা
              </h3>

              <p className="mt-1 text-[9px] text-[#718074] sm:text-xs">
                বাজারের সর্বনিম্ন মূল্য
              </p>
            </div>

            {/* MAXIMUM */}
            <div className="rounded-xl border border-[#e5eee7] bg-[#fbfdfb] p-3 sm:p-4">
              <p className="text-[10px] text-[#718074] sm:text-xs">
                সর্বোচ্চ দাম
              </p>

              <h3 className="mt-2 text-lg font-extrabold text-red-500 sm:text-2xl">
                {formatPrice(maximumPrice)} টাকা
              </h3>

              <p className="mt-1 text-[9px] text-[#718074] sm:text-xs">
                বাজারের সর্বোচ্চ মূল্য
              </p>
            </div>

            {/* AVERAGE */}
            <div className="rounded-xl border border-[#e5eee7] bg-[#fbfdfb] p-3 sm:p-4">
              <p className="text-[10px] text-[#718074] sm:text-xs">
                গড় দাম
              </p>

              <h3 className="mt-2 text-lg font-extrabold text-[#16834a] sm:text-2xl">
                {formatPrice(averagePrice)} টাকা
              </h3>

              <p className="mt-1 text-[9px] text-[#718074] sm:text-xs">
                গড় বাজার মূল্য
              </p>
            </div>

          </div>
        </section>

        {/* MARKET PRICE TABLE */}
        <section className="mt-4 rounded-xl border border-[#e3ebe4] bg-white p-3 sm:p-5">

          <h2 className="mb-3 text-sm font-bold text-[#18251c] sm:text-base">
            বাজারভিত্তিক আজকের দাম
          </h2>

          {markets.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-[#e5eae4]">
              <table className="w-full min-w-[600px] border-collapse text-left">

                <thead className="bg-[#eaf3e9]">
                  <tr>
                    <th className="px-3 py-3 text-xs font-bold text-[#18251c] sm:px-4">
                      বাজার
                    </th>

                    <th className="px-3 py-3 text-xs font-bold text-[#18251c] sm:px-4">
                      বিভাগ
                    </th>

                    <th className="px-3 py-3 text-xs font-bold text-[#18251c] sm:px-4">
                      সর্বনিম্ন
                    </th>

                    <th className="px-3 py-3 text-xs font-bold text-[#18251c] sm:px-4">
                      সর্বোচ্চ
                    </th>

                    <th className="px-3 py-3 text-right text-xs font-bold text-[#18251c] sm:px-4">
                      গড়
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {markets.map((market, index) => {
                    const marketAverage =
                      (Number(market.min) + Number(market.max)) / 2;

                    return (
                      <tr
                        key={`${market.market}-${index}`}
                        className={
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-[#f0f6f1]"
                        }
                      >
                        <td className="px-3 py-3 text-xs font-semibold text-[#18251c] sm:px-4">
                          {market.market}
                        </td>

                        <td className="px-3 py-3 text-xs text-[#718074] sm:px-4">
                          {market.division}
                        </td>

                        <td className="px-3 py-3 text-xs font-bold text-green-600 sm:px-4">
                          {formatPrice(Number(market.min))} টাকা
                        </td>

                        <td className="px-3 py-3 text-xs font-bold text-red-500 sm:px-4">
                          {formatPrice(Number(market.max))} টাকা
                        </td>

                        <td className="px-3 py-3 text-right text-xs font-bold text-[#18251c] sm:px-4">
                          {formatPrice(marketAverage)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg bg-[#f0f6f1] p-5 text-sm text-[#718074]">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        {/* DISCLAIMER */}
        <p className="mt-4 rounded-lg bg-[#e5f1e7] p-3 text-center text-[10px] text-[#718074] sm:text-xs">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হতে পারে।
        </p>

      </div>
    </main>
  );
}
