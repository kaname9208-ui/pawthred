"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";
import { siteConfig } from "@/lib/config/site.config";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  shipping: number;
  grandTotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "paw-thread-cart";

// 由 slug + 选项 + 是否有照片 生成稳定 key，便于合并相同定制项
export function itemKey(item: Pick<CartItem, "slug" | "options" | "photoName">): string {
  const opts = Object.entries(item.options)
    .map(([k, v]) => `${k}:${v}`)
    .sort()
    .join("|");
  const photo = item.photoName ? "photo" : "nophoto";
  return `${item.slug}#${photo}#${opts}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  function addItem(item: CartItem) {
    const key = itemKey(item);
    setItems((prev) => {
      const idx = prev.findIndex((i) => itemKey(i) === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((i) => itemKey(i) !== key));
  }

  function updateQty(key: string, qty: number) {
    setItems((prev) =>
      prev.map((i) => (itemKey(i) === key ? { ...i, qty: Math.max(1, qty) } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  const value = useMemo<CartContextValue>(
    () => {
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const shipping =
        subtotal === 0
          ? 0
          : subtotal >= siteConfig.freeShippingThreshold
            ? 0
            : siteConfig.shippingFee;
      return {
        items,
        itemCount: items.reduce((s, i) => s + i.qty, 0),
        total: subtotal,
        shipping,
        grandTotal: subtotal + shipping,
        addItem,
        removeItem,
        updateQty,
        clear,
      };
    },
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
