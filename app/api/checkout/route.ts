import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config/site.config";
import { bulkClothingDiscount, computeTotals } from "@/lib/pricing";
import { upsertOrder } from "@/lib/data/orders";
import type { Category } from "@/lib/types";

export const runtime = "nodejs";

interface CheckoutItem {
  slug: string;
  name: string;
  price: number;
  qty: number;
  options?: Record<string, string>;
  category?: string;
  photoUrl?: string;
}

function variantLabel(options?: Record<string, string>, photoUrl?: string): string {
  const order = ["color", "size", "placement", "petName", "pets", "fleece"];
  const parts = Object.keys(options || {})
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .filter((k) => options?.[k])
    .map((k) => options?.[k]);
  if (photoUrl) parts.push("photo attached");
  return parts.length ? ` - ${parts.join(" / ")}` : "";
}

function normalizeItems(items: CheckoutItem[]) {
  const categories: Category[] = ["t-shirts", "hoodies", "socks"];
  return items
    .filter((it) => it && Number(it.price) > 0 && Number(it.qty) > 0)
    .map((it) => ({
      slug: it.slug,
      name: it.name,
      price: Number(it.price),
      qty: Math.max(1, Math.floor(Number(it.qty))),
      options: it.options || {},
      photoUrl: it.photoUrl,
      category: categories.includes(it.category as Category)
        ? (it.category as Category)
        : undefined,
    }));
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel." },
      { status: 500 }
    );
  }

  let body: { items?: CheckoutItem[]; email?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = normalizeItems(Array.isArray(body.items) ? body.items : []);
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const line_items = items.map((it) => ({
    quantity: it.qty,
    price_data: {
      currency: "usd",
      unit_amount: Math.round(it.price * 100),
      product_data: {
        name: `${it.name}${variantLabel(it.options, it.photoUrl)}`,
      },
    },
  }));

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = subtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.shippingFee;
  if (shipping > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(shipping * 100),
        product_data: { name: "Shipping" },
      },
    });
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(secret);

  const discount = bulkClothingDiscount(items);
  const couponId =
    discount > 0
      ? (
          await stripe.coupons.create({
            amount_off: Math.round(discount * 100),
            currency: "usd",
            duration: "once",
            name: "Apparel bundle",
          })
        ).id
      : undefined;

  const totals = computeTotals(items);
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 800) : undefined;

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:4000";

  try {
    await upsertOrder({
      id: orderId,
      email: body.email,
      note,
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.grandTotal,
      createdAt,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
      customer_email: body.email || undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      metadata: { source: "paw-thread-nextjs", orderId, note: note || "" },
      payment_intent_data: {
        metadata: { source: "paw-thread-nextjs", orderId, note: note || "" },
      },
    });

    await upsertOrder({
      id: orderId,
      sessionId: session.id,
      email: body.email,
      note,
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.grandTotal,
      createdAt,
      status: "pending",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: err?.message || "Stripe checkout failed." },
      { status: 500 }
    );
  }
}
