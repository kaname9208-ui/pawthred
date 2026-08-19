"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Editable } from "@/components/editable/Editable";

export default function CheckoutSuccess() {
  const { clear } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get("order_id"));
    clear();
  }, [clear]);

  return (
    <div className="container-page section text-center">
      <div className="mx-auto max-w-md card p-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warm-soft text-warm-dark">
          ✓
        </div>
        <h1 className="h-display text-3xl">
          <Editable eid="checkout.success.title" fallback="Thank you!" />
        </h1>
        <p className="mt-3 text-muted">
          <Editable
            eid="checkout.success.body"
            fallback="Your order is confirmed. We'll start preparing your custom embroidery details."
          />
        </p>
        {orderId && <p className="mt-2 text-[13px] text-muted">Order ref: {orderId}</p>}
        <Link href="/products" className="btn-primary mt-7">
          <Editable eid="checkout.success.cta" fallback="Continue Shopping" />
        </Link>
      </div>
    </div>
  );
}
