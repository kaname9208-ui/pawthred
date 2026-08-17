import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth/admin";
import {
  readCatalogRaw,
  writeCatalogRaw,
  SEED_PRODUCTS,
} from "@/lib/data/products";
import type { Product } from "@/lib/types";

export const runtime = "nodejs";

// GET /api/admin/products —— 返回当前商品列表（无目录时回退种子）
export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const list = (await readCatalogRaw()) ?? SEED_PRODUCTS;
  return NextResponse.json({ products: list });
}

// POST /api/admin/products —— 新建或更新单个商品（按 slug upsert）
export async function POST(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let product: Product;
  try {
    product = (await req.json()) as Product;
  } catch {
    return NextResponse.json({ error: "Invalid product data." }, { status: 400 });
  }
  if (!product.slug || !product.name) {
    return NextResponse.json({ error: "slug and name are required." }, { status: 400 });
  }
  const current = (await readCatalogRaw()) ?? SEED_PRODUCTS;
  const idx = current.findIndex((p) => p.slug === product.slug);
  let next: Product[];
  if (idx >= 0) {
    next = current.map((p, i) => (i === idx ? product : p));
  } else {
    next = [...current, product];
  }
  await writeCatalogRaw(next);
  return NextResponse.json({ ok: true, product });
}

// DELETE /api/admin/products —— 删除单个商品
export async function DELETE(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const current = (await readCatalogRaw()) ?? SEED_PRODUCTS;
  const next = current.filter((p) => p.slug !== slug);
  await writeCatalogRaw(next);
  return NextResponse.json({ ok: true });
}
