"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { itemKey } from "@/components/CartProvider";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";
import { siteConfig } from "@/lib/config/site.config";
import { formatUSD } from "@/lib/format";
import { getProduct } from "@/lib/data/products";

export default function CartPage() {
  const { items, total, shipping, grandTotal, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page section text-center">
        <h1 className="h-display text-4xl">
          <Editable eid="cart.empty.title" fallback="Your cart is empty" />
        </h1>
        <p className="mt-3 text-muted">
          <Editable
            eid="cart.empty.subtitle"
            fallback="Upload a pet photo and create something personal."
          />
        </p>
        <Link href="/products" className="btn-primary mt-7">
          <Editable eid="cart.empty.cta" fallback="Start Shopping" />
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, siteConfig.freeShippingThreshold - total);
  const progress = Math.min(100, (total / siteConfig.freeShippingThreshold) * 100);

  return (
    <div className="container-page section">
      <h1 className="h-display mb-8 text-4xl">
        <Editable eid="cart.title" fallback="Your Cart" />
      </h1>

      {/* Free shipping progress */}
      <div className="mb-8 rounded-xl2 border border-line bg-paper p-4">
        <p className="text-[13.5px] text-charcoal">
          {remaining > 0 ? (
            <>
              <Editable eid="cart.freeShip.prefix" fallback="Add" />{" "}
              <span className="font-semibold">{formatUSD(remaining)}</span>{" "}
              <Editable eid="cart.freeShip.suffix" fallback="more for Free Shipping." />
            </>
          ) : (
            <span className="font-semibold text-warm-dark">
              <Editable eid="cart.freeShip.unlocked" fallback="You've unlocked Free Shipping! 🎉" />
            </span>
          )}
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full bg-warm" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((it) => {
            const key = itemKey(it);
            const product = getProduct(it.slug);
            const opts = Object.entries(it.options)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ");
            return (
              <div key={key} className="flex gap-4 rounded-xl2 border border-line bg-paper p-4">
                <ImageSlot
                  eid={`product.${it.slug}.img`}
                  ratio="1/1"
                  tint={product?.tint ?? "#EDE6DA"}
                  fallbackLabel={it.name}
                  className="h-24 w-24 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-[17px] font-semibold text-ink">
                      <Editable eid={`product.${it.slug}.name`} fallback={it.name} />
                    </h3>
                    <button
                      onClick={() => removeItem(key)}
                      className="text-[13px] text-warm-dark hover:underline"
                    >
                      <Editable eid="cart.remove" fallback="Remove" />
                    </button>
                  </div>
                  {it.photoName && (
                    <p className="text-[12.5px] text-muted">
                      <Editable eid="cart.photoLabel" fallback="Photo" />: {it.photoName}
                    </p>
                  )}
                  <p className="text-[12.5px] text-muted">{opts}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(key, it.qty - 1)}
                        className="h-8 w-8 rounded-full border border-line text-ink"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{it.qty}</span>
                      <button
                        onClick={() => updateQty(key, it.qty + 1)}
                        className="h-8 w-8 rounded-full border border-line text-ink"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-ink">{formatUSD(it.price * it.qty)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl2 border border-line bg-paper p-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            <Editable eid="cart.summary.title" fallback="Summary" />
          </h2>
          <div className="mt-4 space-y-2 text-[14.5px] text-charcoal">
            <div className="flex justify-between">
              <span>
                <Editable eid="cart.summary.subtotal" fallback="Subtotal" />
              </span>
              <span>{formatUSD(total)}</span>
            </div>
            <div className="flex justify-between">
              <span>
                <Editable eid="cart.summary.shipping" fallback="Shipping" />
              </span>
              <span>{shipping > 0 ? formatUSD(shipping) : "Free"}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold text-ink">
            <span>
              <Editable eid="cart.summary.total" fallback="Total" />
            </span>
            <span>{formatUSD(grandTotal)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-5 w-full">
            <Editable eid="cart.checkout" fallback="Checkout" />
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-[13px] text-warm-dark hover:underline"
          >
            <Editable eid="cart.continue" fallback="Continue shopping" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
