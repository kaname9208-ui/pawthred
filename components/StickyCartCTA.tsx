"use client";

import { Editable } from "@/components/editable/Editable";

interface Props {
  price: number;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  hint?: string;
}

// 移动端固定底栏 CTA（桌面端隐藏），如 "Create Yours — $59.99"
export function StickyCartCTA({ price, label, disabled, onClick, hint }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 p-3 backdrop-blur lg:hidden">
      <div className="container-page flex items-center gap-3 px-0">
        <div className="flex-1">
          <div className="text-[12px] text-muted">{hint ?? "Total"}</div>
          <div className="font-semibold text-ink">${price.toFixed(2)}</div>
        </div>
        <button
          onClick={onClick}
          disabled={disabled}
          className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Editable eid={disabled ? "customizer.ctaUpload" : "customizer.ctaCreate"} fallback={label} />
        </button>
      </div>
    </div>
  );
}
