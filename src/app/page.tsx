
import Link from "next/link";
import Image from "next/image";
import ProductSections from "@/components/ProductSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f1f6f1]">

      {/* HERO SECTION */}
      <section className="mx-auto max-w-[1440px] px-4 pt-0 sm:px-6 lg:px-9">
        <div className="grid min-h-[330px] items-center gap-6 overflow-hidden rounded-b-2xl border border-[#e5eae4] bg-[#f9fcf9] px-6 py-8 sm:px-10 md:grid-cols-[1.5fr_1fr] md:px-10 lg:px-12 lg:py-7">

          {/* LEFT CONTENT */}
          <div className="space-y-5">

            {/* DATE BADGE */}
            <div className="inline-flex rounded-full bg-[#dcfce7] px-4 py-1.5 text-xs font-bold text-[#16834a]">
              শনিবার, ১৪ নভেম্বর, ২০২৬
            </div>

            {/* MAIN HEADING */}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#111827] sm:text-4xl md:text-5xl lg:text-[46px]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            {/* DESCRIPTION */}
            <p className="max-w-xl text-sm leading-7 text-[#718074] sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ
              এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* CTA BUTTON */}
            <div className="pt-2">
              <Link
                href="#সব-পণ্য"
                className="inline-flex items-center justify-center rounded-lg bg-[#008b3d] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#10683a]"
              >
                সব দাম দেখুন
              </Link>
            </div>

          </div>

          {/* RIGHT HERO IMAGE */}
          <div className="flex items-center justify-center">
            <div className="relative flex h-[210px] w-full max-w-[310px] items-center justify-center sm:h-[250px] md:h-[270px]">

              <Image
                src="/assets/hero-image.png"
                alt="Fresh vegetables and groceries in a basket"
                width={400}
                height={400}
                priority
                className="relative z-10 h-full w-full object-contain"
              />

            </div>
          </div>

        </div>
      </section>

      {/* PRODUCT SECTIONS */}
      <ProductSections />

    </main>
  );
}
