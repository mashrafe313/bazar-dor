
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f0f6f1]">
        প্রোফাইল লোড হচ্ছে...
      </main>
    );
  }

  const userName = session.user.name || "User";
  const userEmail = session.user.email || "";

  return (
    <main className="min-h-screen bg-[#f0f6f1] px-3 py-6 sm:px-4 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-[#e5eae4] bg-white p-5 shadow-sm sm:p-8">

          {/* PROFILE HEADER */}
          <div className="flex flex-col items-center gap-4 border-b border-[#edf0ed] pb-6 sm:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#dcfce7] text-3xl font-bold text-[#16834a]">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-xl font-bold text-[#18251c]">
                {userName}
              </h1>

              <p className="mt-1 break-all text-sm text-[#718074]">
                {userEmail}
              </p>

              <p className="mt-2 text-xs font-semibold text-[#16834a]">
                বাজার দর সদস্য
              </p>
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <section className="pt-6">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-bold text-[#18251c]">
              <span className="text-xl text-[#16834a]">♙</span>
              ব্যক্তিগত তথ্য
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#536157]">
                  আপনার নাম
                </label>

                <input
                  type="text"
                  value={userName}
                  readOnly
                  className="w-full rounded-lg border border-[#e5eae4] bg-[#f8faf9] px-4 py-3 text-sm text-[#536157]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#536157]">
                  ইমেইল
                </label>

                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full rounded-lg border border-[#e5eae4] bg-[#f8faf9] px-4 py-3 text-sm text-[#718074]"
                />
              </div>

              <Link
                href="/profile/update"
                className="block w-full rounded-lg bg-[#008b42] py-3 text-center font-semibold text-white transition hover:bg-[#006f35]"
              >
                তথ্য আপডেট করুন
              </Link>
            </div>
          </section>

          {/* PASSWORD */}
          <section className="mt-8 border-t border-[#edf0ed] pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf5ed] text-xl text-[#16834a]">
                🔒
              </div>

              <div>
                <h2 className="font-bold text-[#18251c]">
                  পাসওয়ার্ড
                </h2>

                <p className="mt-1 text-xs text-[#718074]">
                  আপনার অ্যাকাউন্টের নিরাপত্তা বজায় রাখুন
                </p>
              </div>
            </div>

            <Link
              href="/profile/password"
              className="mt-4 block w-full rounded-lg border border-[#16834a] py-3 text-center text-sm font-semibold text-[#16834a] transition hover:bg-[#eaf5ed]"
            >
              পাসওয়ার্ড পরিবর্তন
            </Link>
          </section>

        </div>
      </div>
    </main>
  );
}
