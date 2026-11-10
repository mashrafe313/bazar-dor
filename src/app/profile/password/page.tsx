
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
      });

      if (result.error) {
        setError(result.error.message || "Password change failed.");
        return;
      }

      setMessage("Your password has been changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[#718074]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f6f1] px-4 py-12">
      <div className="mx-auto max-w-xl">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#16834a] hover:underline"
        >
          ← প্রোফাইলে ফিরে যান
        </Link>

        <div className="rounded-2xl border border-[#e5eae4] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#18251c]">
              পাসওয়ার্ড পরিবর্তন
            </h1>
            <p className="mt-2 text-sm text-[#718074]">
              আপনার অ্যাকাউন্টের নিরাপত্তার জন্য পাসওয়ার্ড আপডেট করুন।
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#18251c]">
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                required
                className="w-full rounded-lg border border-[#e5eae4] px-4 py-3 text-sm outline-none focus:border-[#16834a]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#18251c]">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড লিখুন"
                minLength={8}
                required
                className="w-full rounded-lg border border-[#e5eae4] px-4 py-3 text-sm outline-none focus:border-[#16834a]"
              />
              <p className="mt-1 text-xs text-[#718074]">
                কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন।
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#18251c]">
                নতুন পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
                required
                className="w-full rounded-lg border border-[#e5eae4] px-4 py-3 text-sm outline-none focus:border-[#16834a]"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#16834a] px-5 py-3 font-semibold text-white transition hover:bg-[#10683a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
