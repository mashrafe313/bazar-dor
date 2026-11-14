
export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e5eae4] bg-[#f9fcf9]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 text-center text-[11px] font-medium text-[#718074] sm:flex-row sm:text-left">

        {/* LEFT TEXT */}
        <p>
          বাজার দর — প্রতিদিনের বাজার দর এক নজরে।
        </p>

        {/* RIGHT TEXT */}
        <p>
          সকল দাম সর্বশেষ তথ্যের ভিত্তিতে প্রদর্শিত হয়।
        </p>

      </div>
    </footer>
  );
}
