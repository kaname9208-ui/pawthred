import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth/admin";
import { readOrders, appendOrder } from "@/lib/data/orders";
import type { Order } from "@/lib/data/orders";

export const runtime = "nodejs";

// GET /api/orders —— 仅管理员可看（复用 ADMIN_PASSWORD 登录态）
export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await readOrders();
  return NextResponse.json({ orders });
}

// POST /api/orders —— 付款成功后由成功页写入（公开，但做基础校验防滥用）
export async function POST(req: NextRequest) {
  let body: Partial<Order>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Order must contain items." }, { status: 400 });
  }
  // 极简校验：至少有一个 item 带 name 且金额合理
  const ok = body.items.every(
    (it) => it && typeof it.name === "string" && it.name.length > 0 && Number(it.price) >= 0
  );
  if (!ok) {
    return NextResponse.json({ error: "Invalid order items." }, { status: 400 });
  }

  const order: Order = {
    id: body.id || `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    sessionId: body.sessionId,
    email: body.email,
    items: body.items as Order["items"],
    subtotal: Number(body.subtotal) || 0,
    discount: Number(body.discount) || 0,
    shipping: Number(body.shipping) || 0,
    total: Number(body.total) || 0,
    createdAt: body.createdAt || new Date().toISOString(),
    status: body.status || "paid",
  };

  try {
    await appendOrder(order);
    return NextResponse.json({ ok: true, id: order.id });
  } catch (err: any) {
    console.error("Append order failed:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save order." },
      { status: 500 }
    );
  }
}
