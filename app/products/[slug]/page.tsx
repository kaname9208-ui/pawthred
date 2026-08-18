import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, products } from "@/lib/data/products";
import { reviews, faqs } from "@/lib/data/content";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";
import { Stars } from "@/components/Stars";
import { ProductCustomizer } from "@/components/ProductCustomizer";
import { TrustBadges } from "@/components/TrustBadges";
import { ReviewWall } from "@/components/ReviewWall";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ProductGrid } from "@/components/ProductGrid";
import { formatUSD } from "@/lib/format";
import { siteConfig } from "@/lib/config/site.config";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProduct(params.slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: p.name,
      description: p.description,
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: p.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: p.name,
      description: p.description,
      images: ["/og.png"],
    },
  };
}

const galleryLabels = ["Front view", "Close-up embroidery", "Model wearing", "Pet photo", "Embroidery comparison", "Lifestyle"];

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);
  const productFaqs = faqs.slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${siteConfig.siteUrl.replace(/\/$/, "")}/og.png`,
    brand: { "@type": "Brand", name: siteConfig.brandName },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.priceFrom,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.siteUrl.replace(/\/$/, "")}/products/${product.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.siteUrl.replace(/\/$/, "")}/` },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteConfig.siteUrl.replace(/\/$/, "")}/products` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${siteConfig.siteUrl.replace(/\/$/, "")}/products/${product.slug}` },
    ],
  };

  return (
    <div className="container-page section">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {/* Breadcrumb */}
      <nav className="mb-6 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">
          <Editable eid="product.breadcrumb.home" fallback="Home" />
        </Link>{" "}
        /{" "}
        <Link href="/products" className="hover:text-ink">
          <Editable eid="product.breadcrumb.shop" fallback="Shop" />
        </Link>{" "}
        /{" "}
        <span className="text-ink">
          <Editable eid={`product.${product.slug}.name`} fallback={product.name} />
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div>
          <ImageSlot
            eid={`product.${product.slug}.img`}
            ratio="4/5"
            tint={product.tint}
            fallbackLabel="Front view"
            className="mb-3"
          />
          <div className="grid grid-cols-3 gap-3">
            {galleryLabels.slice(1).map((l, i) => (
              <ImageSlot
                key={l}
                eid={`product.${product.slug}.gallery.${i + 1}`}
                ratio="1/1"
                tint={product.tint}
                fallbackLabel={l}
              />
            ))}
          </div>
        </div>

        {/* Info + customizer */}
        <div>
          <h1 className="h-display text-3xl sm:text-4xl">
            <Editable eid={`product.${product.slug}.name`} fallback={product.name} />
          </h1>
          <div className="mt-3 flex items-center gap-2 text-[14px] text-muted">
            <Stars rating={product.rating} size={16} />
            <span>
              {product.rating.toFixed(1)} / 5 · {product.reviews.toLocaleString()} Reviews
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-ink">
              From {formatUSD(product.priceFrom)}
            </span>
            {product.priceOriginal && (
              <span className="text-[15px] text-muted line-through">
                {formatUSD(product.priceOriginal)}
              </span>
            )}
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            <Editable eid={`product.${product.slug}.description`} fallback={product.description} />
          </p>

          <div className="mt-8 border-t border-line pt-8">
            <ProductCustomizer product={product} />
          </div>
        </div>
      </div>

      <TrustBadges />

      {/* Product reviews */}
      <section className="section">
        <h2 className="h-display mb-8 text-3xl">
          <Editable eid="product.reviews.title" fallback="Reviews for this piece" />
        </h2>
        <ReviewWall reviews={reviews.slice(0, 3)} />
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="mx-auto max-w-3xl">
          <h2 className="h-display mb-8 text-center text-3xl">
            <Editable eid="product.faq.title" fallback="Common questions" />
          </h2>
          <FAQAccordion items={productFaqs} />
        </div>
      </section>

      {/* Related */}
      <section className="section">
        <h2 className="h-display mb-8 text-3xl">
          <Editable eid="product.related.title" fallback="You might also like" />
        </h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
