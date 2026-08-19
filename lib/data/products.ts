import { list, put } from "@vercel/blob";
import type { Product } from "@/lib/types";
import {
  colorOption,
  sizeOption,
  tshirtSizeOption,
  socksSizeOption,
  placementOption,
  embroideryStyleOption,
  petNameOption,
  fleeceOption,
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
    priceFrom: 49.9,
    priceOriginal: 59.9,
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
      tshirtSizeOption,
      embroideryStyleOption,
      placementOption,
      petNameOption,
    ],
  },
  {
    slug: "custom-pet-crewneck",
    name: "Custom Pet Embroidered Crewneck",
    category: "hoodies",
    categoryLabel: "Hoodies",
    priceFrom: 59.9,
    priceOriginal: 69.9,
    reviews: 906,
    rating: 4.9,
    ratio: "4/5",
    tint: "#E9D9C2",
    blurb: "Classic comfort, quietly personal.",
    description:
      "A custom embroidered pet portrait crewneck sweatshirt made for everyday comfort, thoughtful gifts, and keepsake moments. Choose your sweatshirt color, embroidery format, placement, pet name, and up to three pet photos for a clean hand-drawn embroidery design.",
    perExtraPet: 10,
    options: [
      colorOption([
        { value: "cream", label: "Cream", swatch: "#BAAA9B" },
        { value: "charcoal", label: "Charcoal", swatch: "#796C60" },
        { value: "heather-grey", label: "Heather Grey", swatch: "#B5A498" },
        { value: "sage", label: "Sage", swatch: "#7E786C" },
        { value: "forest-green", label: "Forest Green", swatch: "#5C5A4F" },
        { value: "burgundy", label: "Burgundy", swatch: "#8F6559" },
        { value: "rose", label: "Rose", swatch: "#C28A89" },
      ]),
      sizeOption,
      embroideryStyleOption,
      placementOption,
      petNameOption,
      fleeceOption,
    ],
  },
  {
    slug: "custom-pet-hoodie",
    name: "Custom Pet Embroidered Hoodie",
    category: "hoodies",
    categoryLabel: "Hoodies",
    priceFrom: 59.9,
    priceOriginal: 69.9,
    reviews: 742,
    rating: 4.9,
    ratio: "4/5",
    tint: "#E3D2BD",
    blurb: "Cozy, and unmistakably yours.",
    description:
      "A soft pullover hoodie with your pet's portrait embroidered at the chest. Drawstring hood, roomy kangaroo pocket, and a fleece-optional interior built for lazy weekends and long walks.",
    perExtraPet: 10,
    options: [
      colorOption([
        { value: "cream", label: "Cream", swatch: "#F3ECE0" },
        { value: "black", label: "Black", swatch: "#1A1A1A" },
        { value: "heather-grey", label: "Heather Grey", swatch: "#B8B2A8" },
        { value: "sage", label: "Sage", swatch: "#C7CDBF" },
        { value: "navy", label: "Navy", swatch: "#2C3A4B" },
      ]),
      sizeOption,
      embroideryStyleOption,
      placementOption,
      petNameOption,
      fleeceOption,
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
    perExtraPet: 10,
    options: [
      colorOption([
        { value: "cream", label: "Cream", swatch: "#F3ECE0" },
        { value: "black", label: "Black", swatch: "#1A1A1A" },
        { value: "heather-grey", label: "Heather Grey", swatch: "#B8B2A8" },
        { value: "sage", label: "Sage", swatch: "#C7CDBF" },
        { value: "navy", label: "Navy", swatch: "#2C3A4B" },
      ]),
      socksSizeOption,
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
  const catalog = (await readCatalog()) ?? SEED_PRODUCTS;
  // 种子数据定义「商品集合与结构」（含新增商品/新增选项如加绒），
  // Blob 目录仅用来覆盖用户通过 /admin/colors 改过的颜色色板。
  // 这样即使后台曾写入旧目录，新增的圆领衫/连帽衫与加绒选项也一定会出现，
  // 同时保留商家已编辑的颜色。
  return SEED_PRODUCTS.map((seed) => {
    const cat = catalog.find((c) => c.slug === seed.slug);
    if (!cat) return seed;
    if (seed.slug === "custom-pet-crewneck") return seed;
    const seedColor = seed.options.find((o) => o.id === "color");
    const catColor = cat.options?.find((o) => o.id === "color");
    if (seedColor && catColor?.choices?.length) {
      return {
        ...seed,
        options: seed.options.map((o) =>
          o.id === "color" ? { ...o, choices: catColor.choices } : o
        ),
      };
    }
    return seed;
  });
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
