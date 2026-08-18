import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ValueProps } from "@/components/ValueProps";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustBadges } from "@/components/TrustBadges";
import { UGCWall } from "@/components/UGCWall";
import { GiftStory } from "@/components/GiftStory";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";
import { products } from "@/lib/data/products";
import { faqs } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Custom Pet Embroidered Apparel — Turn Your Pet Into Something You Can Wear",
  description:
    "Paw & Thread turns your favorite pet photo into a custom embroidered tee, crewneck or socks. Premium stitching, made to order, shipped from the USA.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <CategoryGrid />

      <ValueProps />

      <HowItWorks />

      {/* Best Sellers */}
      <section className="container-page section">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">
              <Editable eid="home.bestsellers.eyebrow" fallback="Best Sellers" />
            </span>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl">
              <Editable eid="home.bestsellers.title" fallback="Start with a favorite" />
            </h2>
          </div>
        </div>
        <ProductGrid products={products.slice(0, 6)} />
      </section>

      {/* Embroidery close-up showcase */}
      <section className="bg-paper">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
          <ImageSlot eid="home.detail.img" ratio="4/5" tint="#E7D8C9" fallbackLabel="Embroidery Close-up" />
          <div>
            <span className="eyebrow">
              <Editable eid="home.detail.eyebrow" fallback="The Detail" />
            </span>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl">
              <Editable eid="home.detail.title" fallback="Stitch by stitch, unmistakably them" />
            </h2>
            <p className="mt-5 text-lg text-muted">
              <Editable
                eid="home.detail.body"
                fallback="Every portrait is translated into detailed embroidery — the tilt of an ear, the look in their eye. Premium thread, reinforced stitching, and a finish built to survive the wash and the years."
              />
            </p>
          </div>
        </div>
      </section>

      <TrustBadges />

      <GiftStory />

      <UGCWall />

      {/* FAQ preview */}
      <section className="container-page section">
        <div className="mb-10 text-center">
          <span className="eyebrow">
            <Editable eid="home.faq.eyebrow" fallback="Questions" />
          </span>
          <h2 className="h-display mt-3 text-3xl sm:text-4xl">
            <Editable eid="home.faq.title" fallback="Good to know" />
          </h2>
        </div>
        <div className="mx-auto max-w-3xl">
          <FAQAccordion items={faqs.slice(0, 5)} />
        </div>
      </section>
    </>
  );
}
