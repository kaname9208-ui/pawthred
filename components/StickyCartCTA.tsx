"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

interface Props {
  editTarget?: string;
}

// Mobile storefront cart bar. The product creation button lives inside the form;
// this fixed bar only summarizes the cart and sends shoppers to checkout.
export function StickyCartCTA({ editTarget = "#customize" }: Props) {
  const { itemCount, grandTotal } = useCart();
  const hasItems = itemCount > 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 p-3 backdrop-blur lg:hidden">
      <div className="container-page flex items-center gap-3 px-0">
        <div className="min-w-0 flex-1">
          <a href={editTarget} className="text-[12px] font-medium text-warm-dark underline-offset-2 hover:underline">
            Edit
          </a>
          <div className="mt-0.5 text-[12px] text-muted">
            {hasItems ? `${itemCount} item${itemCount === 1 ? "" : "s"} in cart` : "Cart is empty"}
          </div>
          <div className="font-semibold text-ink">${grandTotal.toFixed(2)}</div>
        </div>
        <Link
          href={hasItems ? "/cart" : editTarget}
          className={hasItems ? "btn-primary flex-1 text-center" : "btn-primary flex-1 text-center opacity-60"}
        >
          {hasItems ? "Checkout" : "Add Item First"}
        </Link>
      </div>
    </div>
  );
}
