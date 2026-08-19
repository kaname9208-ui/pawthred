import { products, getProduct, getByCategory } from "@/lib/data/products";
import { reviews, faqs } from "@/lib/data/content";
import type { Product, Review, FaqItem } from "@/lib/types";

// 统一接口适配层：USE_MOCK=true 时返回本地 Mock 数据；
// 后续接入真实后端（Shopify / 自建 API）时改为 false 并实现对应 fetch。
// 当前项目无 API Key，因此默认走 Mock，不阻塞建站。
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const delay = <T>(data: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const api = {
  async listProducts(cat?: string): Promise<Product[]> {
    if (USE_MOCK) return delay(getByCategory(cat));
    // TODO: 真实接口 await fetch(`/api/products?cat=${cat}`)
    return delay(getByCategory(cat));
  },
  async getProduct(slug: string): Promise<Product | undefined> {
    if (USE_MOCK) return delay(getProduct(slug));
    return delay(getProduct(slug));
  },
  async listReviews(): Promise<Review[]> {
    if (USE_MOCK) return delay(reviews);
    return delay(reviews);
  },
  async listFaqs(): Promise<FaqItem[]> {
    if (USE_MOCK) return delay(faqs);
    return delay(faqs);
  },
};

// 创建 Stripe Checkout Session（真实收款）。前端把购物车传过来，服务端用 key 创建会话并返回跳转 URL。
export async function createCheckout(
  items: { slug: string; name: string; price: number; qty: number; options?: Record<string, string>; photoUrl?: string; photoUrls?: string[]; photoNames?: string[] }[],
  email?: string,
  note?: string
): Promise<{ url?: string; error?: string }> {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, email, note }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data?.error || "Checkout failed." };
    return { url: data.url };
  } catch (e: any) {
    return { error: e?.message || "Network error." };
  }
}

// 预留的真实后端契约（无 Key 时不调用）：
// POST /api/upload        -> { url }           上传宠物照片
// POST /api/preview       -> { layoutUrl }     生成示例版式（诚实占位，非 AI 成品）
// POST /api/orders        -> { orderId }       创建订单
export const API_ENDPOINTS = {
  upload: "/api/upload",
  preview: "/api/preview",
  orders: "/api/orders",
} as const;
