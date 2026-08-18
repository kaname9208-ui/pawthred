import { list, put } from "@vercel/blob";

// 订单数据存到 Vercel Blob 的 orders/orders.json（public 可读，但只通过本项目的接口读写）。
// 这样卖家端（/admin/orders）就能看到每一笔订单，包含顾客宠物照的真实 URL。

const ORDERS_PATH = "orders/orders.json";

export interface OrderItem {
  slug: string;
  name: string;
  price: number;
  qty: number;
  options: Record<string, string>;
  photoUrl?: string;
  category?: string;
}

export interface Order {
  id: string;
  sessionId?: string;
  email?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
  status: "paid" | "pending";
}

async function readRaw(): Promise<Order[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return [];
  try {
    const { blobs } = await list({ token, prefix: ORDERS_PATH });
    const found = blobs.find((b) => b.pathname === ORDERS_PATH) ?? blobs[0];
    if (!found) return [];
    const res = await fetch(found.url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = (await res.json()) as Order[];
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function readOrders(): Promise<Order[]> {
  const all = await readRaw();
  // 新订单在前
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function writeOrders(orders: Order[]): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  await put(ORDERS_PATH, JSON.stringify(orders, null, 2), {
    access: "public",
    token,
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function appendOrder(order: Order): Promise<void> {
  const current = await readRaw();
  current.push(order);
  await writeOrders(current);
}
