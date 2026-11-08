
export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

        <p className="text-lg font-medium text-gray-700">
          Loading BazarDor...
        </p>

        <p className="text-sm text-gray-500">
          Please wait while we fetch the latest prices.
        </p>
      </div>
    </main>
  );
}
