"use client";

import { useEffect, useMemo, useState } from "react";
import type { Choice } from "@/lib/types";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { useEdit } from "@/components/editable/EditProvider";
import { cn } from "@/lib/format";
import { tshirtImages } from "@/lib/data/tshirtImages";
import { crewneckImages } from "@/lib/data/crewneckImages";
import { hoodieImages } from "@/lib/data/hoodieImages";

const LABELS = ["Front view", "Close-up embroidery", "Model wearing", "Lifestyle shot", "Detail"];
const PER_COLOR = 5;

interface Props {
  slug: string;
  tint: string;
  colorChoices?: Choice[];
  selectedColor: string;
  onColorChange: (v: string) => void;
}

export function ProductGallery({ slug, tint, colorChoices, selectedColor, onColorChange }: Props) {
  const { editing } = useEdit();
  const [index, setIndex] = useState(0);
  const isTShirt = slug === "custom-pet-t-shirt" && !!colorChoices?.length;
  const isCrewneck = slug === "custom-pet-crewneck" && !!colorChoices?.length;
  const isHoodie = slug === "custom-pet-hoodie" && !!colorChoices?.length;
  const linkedImages = isTShirt
    ? tshirtImages
    : isCrewneck
      ? crewneckImages
      : isHoodie
        ? hoodieImages
        : null;

  const selectedColorIndex = useMemo(() => {
    if (!colorChoices?.length) return 0;
    return Math.max(0, colorChoices.findIndex((c) => c.value === selectedColor));
  }, [colorChoices, selectedColor]);

  useEffect(() => {
    setIndex(linkedImages ? selectedColorIndex : 0);
  }, [linkedImages, selectedColorIndex, selectedColor]);

  const base = colorChoices?.length
    ? `product.${slug}.c.${selectedColor}`
    : `product.${slug}.g`;

  const slides = useMemo(() => {
    if (linkedImages && colorChoices?.length) {
      return colorChoices.map((color) => ({
        color,
        eid: `product.${slug}.c.${color.value}.0`,
        label: color.label,
        src: linkedImages[color.value],
      }));
    }

    return Array.from({ length: PER_COLOR }, (_, i) => ({
      color: null,
      eid: `${base}.${i}`,
      label: LABELS[i],
      src: undefined,
    }));
  }, [base, colorChoices, linkedImages, slug]);

  const activeSlide = slides[index] ?? slides[0];
  const activeColorLabel =
    activeSlide?.color?.label ?? colorChoices?.find((c) => c.value === selectedColor)?.label;

  useEffect(() => {
    if (!linkedImages) return;
    slides.forEach((slide) => {
      if (!slide.src || typeof window === "undefined") return;
      const img = new window.Image();
      img.decoding = "async";
      img.src = slide.src;
    });
  }, [linkedImages, slides]);

  function selectSlide(next: number) {
    const slide = slides[next];
    setIndex(next);
    if (slide?.color?.value) onColorChange(slide.color.value);
  }

  function go(delta: number) {
    selectSlide((index + delta + slides.length) % slides.length);
  }

  return (
    <div>
      <div className="relative">
        <ImageSlot
          eid={activeSlide?.eid ?? `${base}.0`}
          ratio="4/5"
          tint={tint}
          fallbackLabel={activeSlide?.label ?? LABELS[index] ?? "Product image"}
          fallbackSrc={activeSlide?.src}
          className="mb-0"
          eager
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

      <div className="mt-3 grid grid-cols-5 gap-2">
        {slides.map((slide, i) => (
          <div
            key={slide.eid}
            onClick={() => {
              if (!editing) selectSlide(i);
            }}
            className={cn(
              "cursor-pointer overflow-hidden rounded-xl2 transition",
              index === i ? "ring-2 ring-ink" : "opacity-80 ring-1 ring-line hover:opacity-100"
            )}
          >
            <ImageSlot
              eid={slide.eid}
              ratio="1/1"
              tint={tint}
              fallbackLabel={slide.label ?? LABELS[i] ?? "Product image"}
              fallbackSrc={slide.src}
              eager={i < 3}
            />
          </div>
        ))}
      </div>

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
                  selectedColor === c.value ? "scale-110 border-ink" : "border-line"
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
