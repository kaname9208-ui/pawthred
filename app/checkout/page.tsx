"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Editable } from "@/components/editable/Editable";
import { formatUSD } from "@/lib/format";
import { createCheckout } from "@/lib/api/client";

export default function CheckoutPage() {
  const { items, total, discount, shipping, grandTotal, clear } = useCart();
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="container-page section text-center">
        <h1 className="h-display text-4xl">
          <Editable eid="checkout.empty.title" fallback="Nothing to check out" />
        </h1>
        <p className="mt-3 text-muted">
          <Editable eid="checkout.empty.subtitle" fallback="Your cart is empty." />
        </p>
        <Link href="/products" className="btn-primary mt-7">
          <Editable eid="checkout.empty.cta" fallback="Start Shopping" />
        </Link>
      </div>
    );
  }

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    if (email) {
      try {
        localStorage.setItem("paw-thread-email", email);
      } catch {
        /* ignore */
      }
    }
    const payload = items.map((it) => ({
      slug: it.slug,
      name: it.name,
      price: it.price,
      qty: it.qty,
      options: it.options,
      category: it.category,
      photoUrl: it.photoUrl,
      photoUrls: it.photoUrls,
      photoNames: it.photoNames,
    }));
    const { url, error: err } = await createCheckout(
      payload,
      email || undefined,
      note.trim() || undefined
    );
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    if (url) {
      window.location.href = url; // 跳转到 Stripe 托管收银台
      return;
    }
    setError("No checkout URL returned.");
  }

  return (
    <div className="container-page section">
      <h1 className="h-display mb-8 text-4xl">
        <Editable eid="checkout.title" fallback="Checkout" />
      </h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handlePay} className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">
              <Editable eid="checkout.contact" fallback="Contact" />
            </h2>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl2 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink/40"
            />
            <p className="mt-3 text-[12.5px] text-muted">
              <Editable
                eid="checkout.paymentNote"
                fallback="You'll enter your shipping address and card securely on the next step, powered by Stripe."
              />
            </p>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">
              Order Notes
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={800}
              rows={5}
              placeholder="Anything we should know? Example: please keep the portrait simple, include the pet's name, or use the photo only as a reference."
              className="w-full resize-none rounded-xl2 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink/40"
            />
            <p className="mt-2 text-[12.5px] text-muted">
              Optional. This will be saved with your order for the embroidery artist.
            </p>
          </div>

          {error && (
            <div className="rounded-xl2 border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60">
            <Editable eid="checkout.submit" fallback={busy ? "Redirecting…" : "Pay with Card"} />
          </button>
          <p className="text-center text-[12px] text-muted">
            Secured by Stripe · Payments in USD
          </p>
        </form>

        <aside className="h-fit rounded-xl2 border border-line bg-paper p-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            <Editable eid="checkout.summary" fallback="Order Summary" />
          </h2>
          <div className="mt-4 space-y-3 text-[14px] text-charcoal">
            {items.map((it) => (
              <div key={it.slug + (it.photoName || "")} className="flex justify-between gap-3">
                <span className="line-clamp-1">
                  <Editable eid={`product.${it.slug}.name`} fallback={it.name} /> × {it.qty}
                </span>
                <span>{formatUSD(it.price * it.qty)}</span>
              </div>
            ))}
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>
                  <Editable eid="checkout.summaryDiscount" fallback="Apparel bundle" />
                </span>
                <span>−{formatUSD(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-3 text-charcoal">
              <span>
                <Editable eid="checkout.summaryShipping" fallback="Shipping" />
              </span>
              <span>{shipping > 0 ? formatUSD(shipping) : "Free"}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold text-ink">
            <span>
              <Editable eid="checkout.summaryTotal" fallback="Total" />
            </span>
            <span>{formatUSD(grandTotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
