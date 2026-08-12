import type { Product, CustomizeOption } from "@/lib/types";

// 共享定制选项模板（满足 brief §十 的定制模块要求）
const sizes: CustomizeOption["choices"] = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "2XL", label: "2XL" },
  { value: "3XL", label: "3XL" },
];

const placements: CustomizeOption["choices"] = [
  { value: "left-chest", label: "Left Chest" },
  { value: "center", label: "Center" },
  { value: "sleeve", label: "Sleeve" },
];

function colorOption(colors: CustomizeOption["choices"]): CustomizeOption {
  return { id: "color", label: "Color", type: "select", required: true, choices: colors };
}
const sizeOption: CustomizeOption = {
  id: "size",
  label: "Size",
  type: "select",
  required: true,
  choices: sizes,
};
const placementOption: CustomizeOption = {
  id: "placement",
  label: "Embroidery Placement",
  type: "select",
  required: true,
  choices: placements,
};
const textOption: CustomizeOption = {
  id: "petName",
  label: "Add your pet's name (optional)",
  type: "text",
  placeholder: "e.g. MAX",
};

const C = {
  cream: { value: "cream", label: "Cream", swatch: "#F3ECE0" },
  black: { value: "black", label: "Black", swatch: "#1A1A1A" },
  grey: { value: "heather-grey", label: "Heather Grey", swatch: "#B8B2A8" },
  sage: { value: "sage", label: "Sage", swatch: "#C7CDBF" },
  rose: { value: "dusty-rose", label: "Dusty Rose", swatch: "#D8B7AE" },
  navy: { value: "navy", label: "Navy", swatch: "#2C3A4B" },
};

function apparel(p: Omit<Product, "options"> & { colors: CustomizeOption["choices"] }): Product {
  const { colors, ...rest } = p;
  return {
    ...rest,
    options: [colorOption(colors), sizeOption, placementOption, textOption],
  };
}

// Mock 产品数据 —— 全部原创，无任何参考站图片/文案复制
// 当前在售 3 款（按用户要求）：T恤 → 圆领卫衣 → 袜子
export const products: Product[] = [
  apparel({
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
    colors: [C.cream, C.black, C.grey, C.sage],
  }),
  apparel({
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
    colors: [C.cream, C.black, C.grey, C.sage, C.navy],
  }),
  apparel({
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
    colors: [C.cream, C.black, C.grey, C.sage, C.navy],
  }),
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getByCategory(cat?: string): Product[] {
  if (!cat || cat === "all") return products;
  return products.filter((p) => p.category === cat);
}
