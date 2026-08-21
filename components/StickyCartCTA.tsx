"use client";

import Link from "next/link";
import { useState } from "react";
import { itemKey, useCart } from "@/components/CartProvider";
import { siteConfig } from "@/lib/config/site.config";
import { formatUSD } from "@/lib/format";

interface Props {
  editTarget?: string;
}

const OPTION_LABELS: Record<string, string> = {
  color: "Color",
  size: "Size",
  embroideryStyle: "Style",
  placement: "Placement",
  petName: "Pet name",
  pets: "Pets",
  fleece: "Fleece",
};

function formatOptionValue(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Mobile storefront cart bar. The product creation button lives inside the form;
// this fixed bar only summarizes the cart and sends shoppers to checkout.
export function StickyCartCTA({ editTarget = "#customize" }: Props) {
  const { items, itemCount, total, discount, shipping, grandTotal, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const hasItems = itemCount > 0;
  const remainingItems = Math.max(0, siteConfig.freeShippingItemThreshold - itemCount);
  const progress =
    siteConfig.freeShippingItemThreshold > 0
      ? Math.min(100, (itemCount / siteConfig.freeShippingItemThreshold) * 100)
      : 100;
  const shippingNote = shipping > 0 ? `(shipping ${formatUSD(shipping)})` : "(free shipping)";

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-ink/35 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div
        className={[
          "fixed inset-x-0 bottom-0 z-50 lg:hidden",
          open ? "rounded-t-2xl border-t border-line bg-cream shadow-2xl" : "border-t border-line bg-cream/95 backdrop-blur",
        ].join(" ")}
      >
        {open && (
          <div className="max-h-[72vh] overflow-y-auto px-4 pb-3 pt-3">
            <div className="mx-auto h-1.5 w-12 rounded-full bg-line" />
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-display text-xl font-semibold text-ink">Your Cart</div>
                <div className="mt-0.5 text-[13px] text-muted">
                  {hasItems ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout` : "No items yet"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-medium text-ink"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-xl2 border border-line bg-paper p-3">
              <div className="flex justify-between text-[13px] text-charcoal">
                <span>Shipping</span>
                <span>{shipping > 0 ? formatUSD(shipping) : "Free"}</span>
              </div>
              <div className="mt-2 text-[12px] text-muted">
                {remainingItems > 0
                  ? `Add ${remainingItems} more item${remainingItems === 1 ? "" : "s"} for free shipping.`
                  : "You've unlocked free shipping."}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                <div className="h-full bg-warm" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-xl2 border border-line bg-paper p-5 text-center text-[13px] text-muted">
                  Customize a piece above, then add it to your cart.
                </div>
              ) : (
                items.map((item) => {
                  const key = itemKey(item);
                  const photoUrls = item.photoUrls?.length
                    ? item.photoUrls
                    : item.photoUrl
                      ? [item.photoUrl]
                      : [];
                  return (
                    <div key={key} className="rounded-xl2 border border-line bg-paper p-3">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-cream">
                          {photoUrls.length > 0 ? (
                            <div className={photoUrls.length === 1 ? "h-full w-full" : "grid h-full w-full grid-cols-2"}>
                              {photoUrls.slice(0, 4).map((url, index) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  key={`${url}-${index}`}
                                  src={url}
                                  alt={`${item.name} pet photo ${index + 1}`}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                              No photo
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="truncate font-semibold text-ink">{item.name}</div>
                            <div className="shrink-0 text-[13px] font-semibold text-ink">
                              {formatUSD(item.price * item.qty)}
                            </div>
                          </div>
                          <div className="mt-0.5 text-[12px] text-muted">Qty {item.qty}</div>
                          <div className="mt-1 space-y-0.5 text-[11.5px] leading-snug text-muted">
                            {Object.entries(item.options).map(([id, value]) => (
                              <div key={id}>
                                <span className="text-charcoal">{OPTION_LABELS[id] ?? id}:</span>{" "}
                                {formatOptionValue(value)}
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(key)}
                            className="mt-2 text-[12px] font-medium text-warm-dark underline-offset-2 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-4 rounded-xl2 border border-line bg-white p-3 text-[13px] text-charcoal">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatUSD(total)}</span>
              </div>
              {discount > 0 && (
                <div className="mt-1 flex justify-between text-green-700">
                  <span>Apparel bundle</span>
                  <span>-{formatUSD(discount)}</span>
                </div>
              )}
              <div className="mt-1 flex justify-between">
                <span>Shipping</span>
                <span>{shipping > 0 ? formatUSD(shipping) : "Free"}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-line pt-2 font-semibold text-ink">
                <span>Total</span>
                <span>{formatUSD(grandTotal)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="container-page flex items-center gap-3 px-0 py-3">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="min-w-0 flex-1 text-left"
          >
            <div className="text-[12px] font-medium text-warm-dark underline-offset-2">
              Cart
            </div>
            <div className="mt-0.5 text-[12px] text-muted">
              {hasItems ? `${itemCount} item${itemCount === 1 ? "" : "s"} in cart` : "Cart is empty"}
            </div>
            <div className="font-semibold text-ink">
              {formatUSD(grandTotal)} <span className="text-[11px] font-normal text-muted">{shippingNote}</span>
            </div>
          </button>
          <Link
            href={hasItems ? "/checkout" : editTarget}
            className={hasItems ? "btn-primary flex-1 text-center" : "btn-primary flex-1 text-center opacity-60"}
          >
            {hasItems ? "Checkout" : "Add Item First"}
          </Link>
        </div>
      </div>
    </>
  );
}
