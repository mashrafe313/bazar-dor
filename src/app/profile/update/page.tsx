
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await authClient.updateUser({ name: name.trim() });

      if (result.error) {
        setError(result.error.message || "Profile update failed.");
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f0f6f1]">
        প্রোফাইল লোড হচ্ছে...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f6f1] px-4 py-10">
      <div className="mx-auto max-w-xl">

        <Link
          href="/profile"
          className="mb-6 inline-block text-sm font-medium text-[#16834a] hover:underline"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>

        <div className="rounded-2xl border border-[#e5eae4] bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-[#18251c]">
            তথ্য আপডেট করুন
          </h1>

          <p className="mt-2 text-sm text-[#718074]">
            আপনার অ্যাকাউন্টের ব্যক্তিগত তথ্য পরিবর্তন করুন।
          </p>

          <form onSubmit={handleUpdate} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#536157]">
                আপনার নাম
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                required
                placeholder="আপনার নাম লিখুন"
                className="w-full rounded-lg border border-[#e5eae4] px-4 py-3 text-sm outline-none focus:border-[#16834a]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#536157]">
                ইমেইল
              </label>

              <input
                type="email"
                value={session.user.email || ""}
                disabled
                className="w-full rounded-lg border border-[#e5eae4] bg-[#f8faf9] px-4 py-3 text-sm text-[#718074]"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || name.trim().length < 2}
              className="w-full rounded-lg bg-[#008b42] py-3 font-semibold text-white transition hover:bg-[#006f35] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "আপডেট হচ্ছে..." : "Update Information"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
