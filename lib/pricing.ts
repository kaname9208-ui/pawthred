import type { CartItem } from "@/lib/types";
import { siteConfig } from "@/lib/config/site.config";

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
  itemCount: number;
  freeShipping: boolean;
}

export function countCartItems(items: { qty?: number }[]): number {
  return items.reduce((sum, item) => sum + Math.max(0, Math.floor(item.qty ?? 0)), 0);
}

export function qualifiesForFreeShipping(items: { qty?: number }[]): boolean {
  return countCartItems(items) >= siteConfig.freeShippingItemThreshold;
}

// 统一计价：小计 + 运费（买 2 件及以上免运费）
export function computeTotals(items: CartItem[]): OrderTotals {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = countCartItems(items);
  const freeShipping = itemCount >= siteConfig.freeShippingItemThreshold;
  const discount = 0;
  const shipping = subtotal === 0 || freeShipping ? 0 : siteConfig.shippingFee;
  const grandTotal = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discount, shipping, grandTotal, itemCount, freeShipping };
}
