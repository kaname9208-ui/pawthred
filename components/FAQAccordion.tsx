"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/types";
import { Editable } from "@/components/editable/Editable";

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line rounded-xl2 border border-line bg-paper">
      {items.map((it, i) => (
        <div key={i}>
          <button
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="font-medium text-ink">
              <Editable eid={`faq.${i}.q`} fallback={it.q} />
            </span>
            <span className={`text-warm-dark transition-transform ${open === i ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-[14.5px] leading-relaxed text-muted">
              <Editable eid={`faq.${i}.a`} fallback={it.a} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
