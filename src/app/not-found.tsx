
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#f8faf5] px-5 py-16">
      <div className="w-full max-w-lg text-center">

        <div className="text-8xl">🔍</div>

        <h1 className="mt-6 text-7xl font-extrabold text-[#16834a]">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-[#18251c]">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h2>

        <p className="mt-3 leading-7 text-[#718074]">
          দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি পাওয়া যাচ্ছে না।
          পেজটি সরানো হতে পারে অথবা ঠিকানাটি ভুল হতে পারে।
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#16834a] px-7 py-3 font-semibold text-white transition hover:bg-[#10683a]"
        >
          ← হোম পেজে ফিরে যান
        </Link>

        <p className="mt-8 text-sm text-[#718074]">
          বাজার দর — আপনার প্রতিদিনের বাজার সহকারী
        </p>

      </div>
    </main>
  );
}

