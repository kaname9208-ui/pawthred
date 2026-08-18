import { siteConfig } from "@/lib/config/site.config";
import type { CartItem } from "@/lib/types";

// 衣服类目（参与「买 N 件减」活动）；袜子不参与
export const CLOTHING_CATEGORIES: string[] = ["t-shirts", "hoodies"];

export function isClothing(category?: string): boolean {
  return !!category && CLOTHING_CATEGORIES.includes(category);
}

// 衣服满 2 件起，每件减 $5：2 件→−$10，3 件→−$15，4 件→−$20，以此类推。
// 袜子（socks）不计入。
export function bulkClothingDiscount(
  items: { category?: string; qty?: number }[]
): number {
  const clothingQty = items
    .filter((i) => isClothing(i.category))
    .reduce((s, i) => s + Math.max(0, Math.floor(i.qty ?? 0)), 0);
  return clothingQty >= 2 ? 5 * clothingQty : 0;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
}

// 统一计价：小计 − 衣服满减 + 运费（满 freeShippingThreshold 包邮，否则 shippingFee）
export function computeTotals(items: CartItem[]): OrderTotals {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = bulkClothingDiscount(items);
  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= siteConfig.freeShippingThreshold
        ? 0
        : siteConfig.shippingFee;
  const grandTotal = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discount, shipping, grandTotal };
}
