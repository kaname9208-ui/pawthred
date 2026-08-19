import type { Metadata } from "next";
import Link from "next/link";
import { products, getByCategory } from "@/lib/data/products";
import { ProductGrid } from "@/components/ProductGrid";
import { categorySections } from "@/lib/data/content";
import { Editable } from "@/components/editable/Editable";
import { cn } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shop Custom Pet Embroidered Apparel",
  description:
    "Browse custom pet embroidered t-shirts, crewnecks and hoodies. Made to order from your pet's photo.",
  alternates: { canonical: "/products" },
};

const cats = [
  { slug: "all", title: "All" },
  ...categorySections.map((c) => ({ slug: c.slug, title: c.title })),
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const cat = searchParams?.cat;
  const list = await getByCategory(cat);
  const title = cat && cat !== "all" ? `${cat.charAt(0).toUpperCase() + cat.slice(1)}` : "All Products";

  return (
    <div className="container-page section">
      <div className="mb-3 text-center">
        <span className="eyebrow">
          <Editable eid="shop.eyebrow" fallback="Shop" />
        </span>
        <h1 className="h-display mt-2 text-4xl sm:text-5xl">
          <Editable eid="shop.title" fallback="Custom Pet Apparel" />
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          <Editable
            eid="shop.subtitle"
            fallback={`${products.length}+ ways to wear your favorite face. Pick a garment, upload a photo, make it yours.`}
          />
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {cats.map((c, i) => {
          const isAll = c.slug === "all";
          const idx = isAll ? -1 : i - 1;
          return (
            <Link
              key={c.slug}
              href={isAll ? "/products" : `/products?cat=${c.slug}`}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
                (cat === c.slug || (isAll && !cat))
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-paper text-ink hover:border-ink/40"
              )}
            >
              {isAll ? (
                <Editable eid="shop.filter.all" fallback={c.title} />
              ) : (
                <Editable eid={`cat.${idx}.title`} fallback={c.title} />
              )}
            </Link>
          );
        })}
      </div>

      <h2 className="mb-6 font-display text-2xl font-semibold text-ink">
        <Editable eid="shop.listTitle" fallback={title} />
      </h2>
      <ProductGrid products={list} />
    </div>
  );
}
