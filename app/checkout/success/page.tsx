"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Editable } from "@/components/editable/Editable";

export default function CheckoutSuccess() {
  const { items, total, discount, shipping, grandTotal, clear } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const postedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    setSessionId(sid);

    // 付款成功后把订单（含顾客宠物照 URL）写入 Blob，供卖家端 /admin/orders 查看
    if (!postedRef.current) {
      postedRef.current = true;
      const email = localStorage.getItem("paw-thread-email") || undefined;
      const orderItems = items
        .filter((it) => it.name)
        .map((it) => ({
          slug: it.slug,
          name: it.name,
          price: it.price,
          qty: it.qty,
          options: it.options,
          photoUrl: it.photoUrl,
          category: it.category,
        }));
      if (orderItems.length > 0) {
        fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid || undefined,
            email,
            items: orderItems,
            subtotal: total,
            discount,
            shipping,
            total: grandTotal,
            status: "paid",
          }),
        }).catch(() => {
          /* 订单写入失败不应影响顾客看到的成功页 */
        });
      }
    }

    clear(); // 最后清空购物车
  }, [clear, items, total, discount, shipping, grandTotal]);

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
            fallback="Your order is confirmed and we've emailed your receipt. We'll start stitching your pet's portrait right away."
          />
        </p>
        {sessionId && (
          <p className="mt-2 text-[13px] text-muted">Order ref: {sessionId.slice(0, 12)}…</p>
        )}
        <Link href="/products" className="btn-primary mt-7">
          <Editable eid="checkout.success.cta" fallback="Continue Shopping" />
        </Link>
      </div>
    </div>
  );
}
