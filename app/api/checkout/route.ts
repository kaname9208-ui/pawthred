import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config/site.config";
import { bulkClothingDiscount } from "@/lib/pricing";

// 真实收款：服务端用 STRIPE_SECRET_KEY 创建 Stripe Checkout Session，
// 返回托管收银台 URL，前端直接跳转。无需在前端暴露 Secret Key。
export const runtime = "nodejs";

interface CheckoutItem {
  slug: string;
  name: string;
  price: number; // USD, e.g. 39.99
  qty: number;
  options?: Record<string, string>;
  category?: string;
}

// 把定制选项拼成可读后缀：Color / Size / Placement / Name
function variantLabel(options?: Record<string, string>): string {
  if (!options) return "";
  const order = ["color", "size", "placement", "petName"];
  const parts = Object.keys(options)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .filter((k) => options[k])
    .map((k) => options[k]);
  return parts.length ? ` — ${parts.join(" / ")}` : "";
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add STRIPE_SECRET_KEY to your host's environment variables (e.g. Vercel Project Settings → Environment Variables).",
      },
      { status: 500 }
    );
  }

  let body: { items?: CheckoutItem[]; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const line_items = items
    .filter((it) => it && it.price > 0 && it.qty > 0)
    .map((it) => ({
      quantity: Math.max(1, Math.floor(it.qty)),
      price_data: {
        currency: "usd",
        unit_amount: Math.round(Number(it.price) * 100),
        product_data: {
          name: `${it.name}${variantLabel(it.options)}`,
        },
      },
    }));

  // 运费：满 freeShippingThreshold 包邮，否则收 shippingFee（Stripe 按美分计）
  const subtotal = items
    .filter((it) => it && it.price > 0 && it.qty > 0)
    .reduce((s, it) => s + Number(it.price) * Math.max(1, Math.floor(it.qty)), 0);
  const shipping =
    subtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.shippingFee;
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

  // Stripe 客户端（coupon 与收银台都会用到）
  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(secret);

  // 衣服满减活动：满 2 件起每件减 $5（袜子不参与），以一次性 coupon 体现到收银台
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

  if (line_items.length === 0) {
    return NextResponse.json({ error: "No valid items to charge." }, { status: 400 });
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:4000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      ...(couponId ? { discounts: [{ coupon: couponId }] } : {}),
      customer_email: body.email || undefined,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      // 美国市场：收集美国收货地址与电话
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      metadata: { source: "paw-thread-nextjs" },
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
