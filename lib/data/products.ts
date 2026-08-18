import { list, put } from "@vercel/blob";
import type { Product } from "@/lib/types";
import {
  colorOption,
  sizeOption,
  socksSizeOption,
  placementOption,
  petNameOption,
} from "@/lib/data/options";

// 商品数据现在由「后台 admin」管理，存到 Vercel Blob 的 catalog/products.json（public）。
// 读取失败时回退到下面的 SEED_PRODUCTS，保证站点在后台尚未写入任何数据前也能正常显示。

const CATALOG_PATH = "catalog/products.json";

// ---- 初始种子数据（与后台未写入前一致） ----
export const SEED_PRODUCTS: Product[] = [
  {
    slug: "custom-pet-t-shirt",
    name: "Custom Pet Embroidered T-Shirt",
    category: "t-shirts",
    categoryLabel: "T-Shirts",
    priceFrom: 39.99,
    priceOriginal: 49.99,
    reviews: 1298,
    rating: 4.8,
    ratio: "4/5",
    tint: "#DFE0E8",
    blurb: "Simple. Personal. Yours.",
    description:
      "A lightweight combed-cotton tee with a refined pet portrait embroidery on the chest. Breathable, everyday comfort with a story only you know.",
    perExtraPet: 10,
    options: [
      colorOption([
        { value: "cream", label: "Cream", swatch: "#F3ECE0" },
        { value: "black", label: "Black", swatch: "#1A1A1A" },
        { value: "heather-grey", label: "Heather Grey", swatch: "#B8B2A8" },
        { value: "sage", label: "Sage", swatch: "#C7CDBF" },
      ]),
      sizeOption,
      placementOption,
      petNameOption,
    ],
  },
  {
    slug: "custom-pet-crewneck",
    name: "Custom Pet Embroidered Crewneck",
    category: "crewnecks",
    categoryLabel: "Crewnecks",
    priceFrom: 54.99,
    priceOriginal: 69.99,
    reviews: 906,
    rating: 4.9,
    ratio: "4/5",
    tint: "#E9D9C2",
    blurb: "Classic comfort, quietly personal.",
    description:
      "A timeless crewneck sweater with your pet's portrait stitched at the chest. Clean lines, premium cotton blend, and a fit that works for any season.",
    perExtraPet: 12,
    options: [
      colorOption([
        { value: "cream", label: "Cream", swatch: "#F3ECE0" },
        { value: "black", label: "Black", swatch: "#1A1A1A" },
        { value: "heather-grey", label: "Heather Grey", swatch: "#B8B2A8" },
        { value: "sage", label: "Sage", swatch: "#C7CDBF" },
        { value: "navy", label: "Navy", swatch: "#2C3A4B" },
      ]),
      sizeOption,
      placementOption,
      petNameOption,
    ],
  },
  {
    slug: "custom-pet-socks",
    name: "Custom Pet Embroidered Socks",
    category: "socks",
    categoryLabel: "Socks",
    priceFrom: 19.99,
    priceOriginal: 24.99,
    reviews: 312,
    rating: 4.8,
    ratio: "4/5",
    tint: "#E8DCD0",
    blurb: "Every step, a little closer.",
    description:
      "Soft combed-cotton crew socks with your pet's face embroidered at the ankle. Cushioned sole, stay-up fit, and a small daily dose of joy with every step.",
    perExtraPet: 6,
    options: [
      colorOption([
        { value: "cream", label: "Cream", swatch: "#F3ECE0" },
        { value: "black", label: "Black", swatch: "#1A1A1A" },
        { value: "heather-grey", label: "Heather Grey", swatch: "#B8B2A8" },
        { value: "sage", label: "Sage", swatch: "#C7CDBF" },
        { value: "navy", label: "Navy", swatch: "#2C3A4B" },
      ]),
      socksSizeOption,
      placementOption,
      petNameOption,
    ],
  },
];

// ---- 从 Blob 读取商品目录 ----
async function readCatalog(): Promise<Product[] | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  try {
    const { blobs } = await list({ token, prefix: CATALOG_PATH });
    const found = blobs.find((b) => b.pathname === CATALOG_PATH) ?? blobs[0];
    if (!found) return null;
    const res = await fetch(found.url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = (await res.json()) as Product[];
    return Array.isArray(json) ? json : null;
  } catch {
    return null;
  }
}

// 后台读写原语（storefront 与 admin 共用）
export async function readCatalogRaw(): Promise<Product[] | null> {
  return readCatalog();
}

export async function writeCatalogRaw(products: Product[]): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  await put(CATALOG_PATH, JSON.stringify(products, null, 2), {
    access: "public",
    token,
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

// ---- 同步导出（供首页/组件直接使用，无需 await） ----
// 后台写入 Blob 前使用种子数据；后台上线后建议改为异步读取。
export const products = SEED_PRODUCTS;

// ---- 对外异步接口（原同步函数名保留，改为 async） ----
export async function getProducts(): Promise<Product[]> {
  return (await readCatalog()) ?? SEED_PRODUCTS;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug);
}

export async function getByCategory(cat?: string): Promise<Product[]> {
  const all = await getProducts();
  if (!cat || cat === "all") return all;
  return all.filter((p) => p.category === cat);
}
