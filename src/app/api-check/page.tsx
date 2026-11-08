
import { getProducts, getCategories } from "@/lib/api";
import { formatPrice, formatUnit } from "@/lib/utils";

export default async function ApiCheckPage() {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    return (
      <main className="min-h-screen bg-[#f8faf5] p-6 text-[#18251c]">
        <div className="mx-auto max-w-5xl space-y-8">
          <h1 className="text-3xl font-bold">
            বাজার দর - API Test
          </h1>

          <section className="rounded-xl bg-white p-5 shadow">
            <h2 className="text-xl font-bold">
              API Summary
            </h2>

            <p className="mt-3">
              Total Products: {products.length}
            </p>

            <p>
              Total Categories: {categories.length}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">
              Products
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product) => (
                <article
                  key={product.id}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="text-4xl">
                    {product.image}
                  </div>

                  <h3 className="mt-3 font-bold">
                    {product.nameBn}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {formatUnit(product.unit)}
                  </p>

                  <p className="mt-2 font-bold text-green-700">
                    {formatPrice(product.today)}
                  </p>

                  <p className="text-xs text-gray-500">
                    Slug: {product.slug}
                  </p>

                  <p className="text-xs text-gray-500">
                    Markets: {product.markets?.length ?? 0}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold">
              Categories
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-xl border bg-white p-4"
                >
                  <p className="text-3xl">
                    {category.icon}
                  </p>

                  <p className="mt-2 font-bold">
                    {category.nameBn}
                  </p>

                  <p className="text-xs text-gray-500">
                    {category.slug}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold text-red-600">
          API Integration Failed
        </h1>

        <pre className="mt-4 whitespace-pre-wrap">
          {error instanceof Error
            ? error.message
            : "Unknown error"}
        </pre>
      </main>
    );
  }
}
