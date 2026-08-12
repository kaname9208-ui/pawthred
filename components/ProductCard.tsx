import Link from "next/link";
import type { Product } from "@/lib/types";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";
import { Stars } from "@/components/Stars";
import { formatUSD } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl2 border border-line bg-paper">
        <ImageSlot
          eid={`product.${product.slug}.img`}
          ratio={product.ratio}
          tint={product.tint}
          fallbackLabel={product.categoryLabel}
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-cream">
          <Editable eid="product.flag" fallback="Best Seller" />
        </span>
      </div>
      <div className="mt-4">
        <h3 className="font-display text-[17px] font-semibold leading-snug text-ink">
          <Editable eid={`product.${product.slug}.name`} fallback={product.name} />
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted">
          <Stars rating={product.rating} size={14} />
          <span>
            {product.rating.toFixed(1)} · {product.reviews.toLocaleString()} Reviews
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-ink">
            From {formatUSD(product.priceFrom)}
          </span>
          {product.priceOriginal && (
            <span className="text-[13px] text-muted line-through">
              {formatUSD(product.priceOriginal)}
            </span>
          )}
        </div>
        <span className="mt-3 inline-block text-[13px] font-medium text-warm-dark transition-colors group-hover:text-ink">
          <Editable eid="product.card.cta" fallback="Shop Now →" />
        </span>
      </div>
    </Link>
  );
}
