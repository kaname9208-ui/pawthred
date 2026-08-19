"use client";

import { useEffect, useMemo, useState } from "react";
import type { Choice } from "@/lib/types";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { useEdit } from "@/components/editable/EditProvider";
import { cn } from "@/lib/format";
import { crewneckImages } from "@/lib/data/crewneckImages";

const LABELS = ["Front view", "Close-up embroidery", "Model wearing", "Lifestyle shot", "Detail"];
const PER_COLOR = 5;

interface Props {
  slug: string;
  tint: string;
  colorChoices?: Choice[];
  selectedColor: string;
  onColorChange: (v: string) => void;
}

// 商品图廊：大图 + 缩略图条 + 翻页（左右箭头 / 点缩略图）。
// 每个颜色对应自己的一组图片（eid 按颜色区分），选择颜色即切换整组图。
export function ProductGallery({ slug, tint, colorChoices, selectedColor, onColorChange }: Props) {
  const { editing } = useEdit();
  const [index, setIndex] = useState(0);

  // 切换颜色时，回到该颜色的第一张
  useEffect(() => setIndex(0), [selectedColor]);

  const base = colorChoices?.length
    ? `product.${slug}.c.${selectedColor}`
    : `product.${slug}.g`;

  const eids = useMemo(
    () => Array.from({ length: PER_COLOR }, (_, i) => `${base}.${i}`),
    [base]
  );

  function go(delta: number) {
    setIndex((i) => (i + delta + PER_COLOR) % PER_COLOR);
  }

  const bigEid = eids[index];
  const activeColorLabel = colorChoices?.find((c) => c.value === selectedColor)?.label;
  const staticSrc =
    slug === "custom-pet-crewneck" && index === 0
      ? crewneckImages[selectedColor]
      : undefined;

  return (
    <div>
      {/* 主图 + 翻页箭头 */}
      <div className="relative">
        {/* 编辑模式下，点击大图即上传；展示模式下不可点（缩略图负责切换） */}
        <ImageSlot
          eid={bigEid}
          ratio="4/5"
          tint={tint}
          fallbackLabel={LABELS[index]}
          fallbackSrc={staticSrc}
          className="mb-0"
        />
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-md transition hover:bg-cream"
        >
          <span className="text-xl leading-none">‹</span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-md transition hover:bg-cream"
        >
          <span className="text-xl leading-none">›</span>
        </button>
        {activeColorLabel && (
          <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-medium text-cream">
            {activeColorLabel}
          </span>
        )}
      </div>

      {/* 缩略图：点击任意一张即拉到大图 */}
      <div className="mt-3 grid grid-cols-5 gap-2">
        {eids.map((eid, i) => (
          <div
            key={eid}
            onClick={() => {
              if (!editing) setIndex(i);
            }}
            className={cn(
              "cursor-pointer overflow-hidden rounded-xl2 transition",
              index === i
                ? "ring-2 ring-ink"
                : "opacity-80 ring-1 ring-line hover:opacity-100"
            )}
          >
            <ImageSlot
              eid={eid}
              ratio="1/1"
              tint={tint}
              fallbackLabel={LABELS[i]}
              fallbackSrc={
                slug === "custom-pet-crewneck" && i === 0
                  ? crewneckImages[selectedColor]
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {/* 颜色标签（点击切换颜色，与右侧定制器联动） */}
      {colorChoices?.length ? (
        <div className="mt-4">
          <div className="mb-2 text-[13px] font-medium text-muted">
            {activeColorLabel ?? "Color"}
          </div>
          <div className="flex flex-wrap gap-3">
            {colorChoices.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => onColorChange(c.value)}
                title={c.label}
                aria-label={c.label}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-transform",
                  selectedColor === c.value ? "border-ink scale-110" : "border-line"
                )}
                style={{ backgroundColor: c.swatch }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
