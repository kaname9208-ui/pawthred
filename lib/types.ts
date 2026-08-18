export type Category =
  | "t-shirts"
  | "hoodies"
  | "socks";

export interface Choice {
  value: string;
  label: string;
  /** 真实颜色色值，用于颜色 Swatch 展示 */
  swatch?: string;
}

export interface CustomizeOption {
  id: string;
  label: string;
  type: "select" | "text";
  choices?: Choice[];
  placeholder?: string;
  required?: boolean;
}

export interface Product {
  slug: string;
  name: string;
  category: Category;
  categoryLabel: string;
  priceFrom: number;
  priceOriginal?: number;
  reviews: number;
  rating: number;
  /** 占位图比例，如 "4/5" */
  ratio: string;
  /** 占位图主色 */
  tint: string;
  /** 分类区块短标语 */
  blurb: string;
  description: string;
  /** 每件额外宠物加价（USD） */
  perExtraPet: number;
  options: CustomizeOption[];
}

export interface Review {
  id: string;
  author: string;
  location: string;
  verified: boolean;
  rating: number;
  pet: string;
  text: string;
  ratio: string;
  tint: string;
  /** 明确标记为示例评价，避免伪造真实消费者 */
  demo: true;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  qty: number;
  options: Record<string, string>;
  photoName?: string;
  /** 顾客宠物照在 Vercel Blob 上的真实可访问 URL（下单后卖家端可见） */
  photoUrl?: string;
  /** 商品类目（衣服/袜子），用于满减与包邮计算 */
  category?: Category;
}
