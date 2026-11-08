
import { notFound } from "next/navigation";

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
  new Intl.NumberFormat("bn-BD").format(price);

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

    return products.find(
      (product: Product) => product.slug === slug
    ) || null;
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
  const { slug } = await params;

  let product: Product | null;

  try {
    product = await getProduct(slug);
  } catch {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8faf5] px-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#18251c]">
            তথ্য লোড করা যাচ্ছে না
          </h1>
          <p className="mt-3 text-[#718074]">
            অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
          <a
            href="/"
            className="mt-6 inline-block rounded-xl bg-[#16834a] px-6 py-3 font-semibold text-white"
          >
            হোম পেজে ফিরে যান
          </a>
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

  return (
    <main className="min-h-screen bg-[#f8faf5] px-5 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-[#16834a] hover:underline"
        >
          ← হোম পেজে ফিরে যান
        </a>

        {/* Product Summary */}
        <section className="rounded-3xl border border-[#e5eae4] bg-white p-6 shadow-sm md:p-10">

          <div className="flex flex-col gap-8 md:flex-row md:items-center">

            <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-3xl bg-[#f3f7ef] text-7xl">
              {product.image || "🛒"}
            </div>

            <div className="flex-1">
              <span className="inline-block rounded-full bg-[#e8f5e9] px-4 py-2 text-sm font-semibold text-[#16834a]">
                বাজার দর
              </span>

              <h1 className="mt-4 text-3xl font-bold text-[#18251c] md:text-4xl">
                {product.nameBn}
              </h1>

              <p className="mt-3 text-[#718074]">
                বাংলাদেশের বিভিন্ন বাজারে{" "}
                {product.nameBn} এর আজকের বাজারদর।
              </p>

              <p className="mt-3 font-medium text-[#718074]">
                একক: {getUnit(product.unit)}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <span className="text-3xl font-bold text-[#16834a]">
                  {formatPrice(product.today)} টাকা
                </span>

                <span
                  className={`rounded-full px-3 py-2 text-sm font-bold ${
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

              <p className="mt-2 text-sm text-[#718074]">
                গতকালের দাম: {formatPrice(product.yesterday)} টাকা
              </p>
            </div>

          </div>
        </section>

        {/* Price Summary */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#18251c]">
            মূল্য বিশ্লেষণ
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

            <div className="rounded-2xl border border-[#e5eae4] bg-white p-6">
              <p className="text-sm text-[#718074]">
                সর্বনিম্ন দাম
              </p>
              <h3 className="mt-3 text-3xl font-bold text-green-600">
                {formatPrice(minimumPrice)}
              </h3>
              <p className="mt-2 text-sm text-[#718074]">
                টাকা
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5eae4] bg-white p-6">
              <p className="text-sm text-[#718074]">
                সর্বোচ্চ দাম
              </p>
              <h3 className="mt-3 text-3xl font-bold text-red-500">
                {formatPrice(maximumPrice)}
              </h3>
              <p className="mt-2 text-sm text-[#718074]">
                টাকা
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5eae4] bg-white p-6">
              <p className="text-sm text-[#718074]">
                গড় দাম
              </p>
              <h3 className="mt-3 text-3xl font-bold text-[#16834a]">
                {formatPrice(Math.round(averagePrice))}
              </h3>
              <p className="mt-2 text-sm text-[#718074]">
                টাকা
              </p>
            </div>

          </div>
        </section>

        {/* Market Prices */}
        <section className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#18251c]">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <p className="mt-2 text-[#718074]">
              বিভিন্ন বাজারে {product.nameBn} এর মূল্য তুলনা করুন।
            </p>
          </div>

          {markets.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-[#e5eae4] bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#eaf3e9]">
                    <tr>
                      <th className="p-4 text-sm font-bold text-[#18251c]">
                        বাজার
                      </th>
                      <th className="p-4 text-sm font-bold text-[#18251c]">
                        বিভাগ
                      </th>
                      <th className="p-4 text-sm font-bold text-[#18251c]">
                        সর্বনিম্ন
                      </th>
                      <th className="p-4 text-sm font-bold text-[#18251c]">
                        সর্বোচ্চ
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {markets.map((market, index) => (
                      <tr
                        key={`${market.market}-${index}`}
                        className="border-t border-[#e5eae4]"
                      >
                        <td className="p-4 font-semibold text-[#18251c]">
                          {market.market}
                        </td>

                        <td className="p-4 text-[#718074]">
                          {market.division}
                        </td>

                        <td className="p-4 font-semibold text-green-600">
                          {formatPrice(Number(market.min))} টাকা
                        </td>

                        <td className="p-4 font-semibold text-red-500">
                          {formatPrice(Number(market.max))} টাকা
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="rounded-2xl bg-white p-6 text-[#718074]">
              এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।
            </p>
          )}
        </section>

        {/* Disclaimer */}
        <p className="mt-10 rounded-xl bg-[#eaf3e9] p-5 text-center text-sm text-[#718074]">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হতে পারে।
        </p>

      </div>
    </main>
  );
}
