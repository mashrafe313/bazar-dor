
import Link from "next/link";

const groceries = [
  { emoji: "🍚", name: "চাল", price: "৫৮ টাকা", color: "bg-orange-100" },
  { emoji: "🥔", name: "আলু", price: "৩৫ টাকা", color: "bg-yellow-100" },
  { emoji: "🧅", name: "পেঁয়াজ", price: "৬০ টাকা", color: "bg-purple-100" },
  { emoji: "🐟", name: "মাছ", price: "২৮০ টাকা", color: "bg-blue-100" },
  { emoji: "🥚", name: "ডিম", price: "১৪৫ টাকা", color: "bg-amber-100" },
  { emoji: "🥬", name: "সবজি", price: "৪০ টাকা", color: "bg-green-100" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8faf5]">

      {/* HERO SECTION */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">

          {/* LEFT CONTENT */}
          <div className="space-y-7">

            {/* EYEBROW */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cce5d2] bg-[#eaf5ed] px-4 py-2 text-sm font-semibold text-[#16834a]">
              <span>🌿</span>
              <span>আপনার প্রতিদিনের বাজারের বিশ্বস্ত সঙ্গী</span>
            </div>

            {/* MAIN HEADING */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#18251c] sm:text-5xl lg:text-6xl">
              বাজারের সঠিক দাম,
              <span className="mt-2 block text-[#16834a]">
                এখন আপনার হাতেই!
              </span>
            </h1>

            {/* SUBTITLE */}
            <p className="max-w-xl text-base leading-8 text-[#718074] sm:text-lg">
              চাল, ডাল, তেল, মাছ, মাংস ও নিত্যপ্রয়োজনীয়
              পণ্যের প্রতিদিনের বাজারদর জানুন এক জায়গায়।
              সঠিক তথ্যের মাধ্যমে পরিকল্পনা করুন আপনার
              প্রতিদিনের বাজার।
            </p>

            {/* CTA BUTTON */}
            <div className="flex flex-wrap items-center gap-4">

              <Link
                href="#সব-পণ্য"
                className="inline-flex items-center gap-2 rounded-xl bg-[#16834a] px-7 py-4 font-bold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-1 hover:bg-[#10683a]"
              >
                সকল পণ্য দেখুন
                <span>→</span>
              </Link>

              <div className="text-sm text-[#718074]">
                <p className="font-bold text-[#18251c]">
                  প্রতিদিনের বাজারদর
                </p>
                <p>এক নজরে, এক জায়গায়</p>
              </div>

            </div>

            {/* SMALL FEATURES */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-3 text-sm font-medium text-[#536157]">
              <span>✓ সহজে দাম দেখুন</span>
              <span>✓ পণ্যভিত্তিক তথ্য</span>
              <span>✓ বাজারভিত্তিক তুলনা</span>
            </div>

          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="relative mx-auto w-full max-w-lg">

            {/* BACKGROUND CIRCLE */}
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e4f0df] sm:h-96 sm:w-96" />

            {/* DECORATIONS */}
            <div className="absolute -right-2 top-4 z-10 rounded-2xl bg-white p-3 text-3xl shadow-lg sm:right-2">
              🥦
            </div>

            <div className="absolute -left-2 top-1/3 z-10 rounded-2xl bg-white p-3 text-3xl shadow-lg">
              🥕
            </div>

            <div className="absolute -bottom-2 right-5 z-10 rounded-2xl bg-white p-3 text-3xl shadow-lg">
              🍅
            </div>

            {/* MAIN CARD */}
            <div className="relative z-0 rounded-[2rem] border border-[#e5eae4] bg-white p-5 shadow-2xl sm:p-7">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#718074]">
                    বাজারের পণ্যসমূহ
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-[#18251c]">
                    আজকের বাজার 🛒
                  </h2>
                </div>

                <span className="rounded-full bg-[#eaf5ed] px-3 py-1.5 text-xs font-bold text-[#16834a]">
                  বাজার দর
                </span>
              </div>

              {/* GROCERY GRID */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {groceries.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 rounded-2xl border border-[#edf0eb] p-3 transition hover:-translate-y-1 hover:shadow-md sm:p-4"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-3xl ${item.color}`}
                    >
                      {item.emoji}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-[#18251c]">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#16834a]">
                        {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTTOM CARD */}
              <div className="mt-5 flex items-center justify-between rounded-xl bg-[#eaf5ed] p-4">
                <div>
                  <p className="text-xs text-[#718074]">
                    আপনার বাজার, আপনার হিসাব
                  </p>
                  <p className="mt-1 font-bold text-[#16834a]">
                    প্রতিদিনের দাম এক নজরে
                  </p>
                </div>

                <span className="text-3xl">🛍️</span>
              </div>

            </div>

            {/* FLOATING DECORATION */}
            <div className="absolute -bottom-7 -left-3 z-10 hidden rounded-2xl bg-[#16834a] px-5 py-3 text-white shadow-xl sm:block">
              <p className="text-sm font-bold">
                🌱 স্মার্ট বাজার ব্যবস্থাপনা
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
