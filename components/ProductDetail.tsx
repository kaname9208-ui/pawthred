"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { Editable } from "@/components/editable/Editable";
import { Stars } from "@/components/Stars";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCustomizer } from "@/components/ProductCustomizer";
import { formatUSD } from "@/lib/format";

// 商品详情的两栏布局：左图廊 + 右信息与定制器。
// 颜色选择状态在此统一持有，图廊与定制器共享，确保“选颜色即换图”。
export function ProductDetail({ product }: { product: Product }) {
  const colorOpt = product.options.find(
    (o) => o.id === "color" && o.choices && o.choices.length > 0
  );
  const initialColor = colorOpt?.choices?.[0].value ?? "";
  const [selectedColor, setSelectedColor] = useState(initialColor);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <ProductGallery
        slug={product.slug}
        tint={product.tint}
        colorChoices={colorOpt?.choices}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />

      <div>
        <h1 className="h-display text-3xl sm:text-4xl">
          <Editable eid={`product.${product.slug}.name`} fallback={product.name} />
        </h1>
        <div className="mt-3 flex items-center gap-2 text-[14px] text-muted">
          <Stars rating={product.rating} size={16} />
          <span>
            {product.rating.toFixed(1)} / 5 · {product.reviews.toLocaleString()} Reviews
          </span>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-ink">
            From {formatUSD(product.priceFrom)}
          </span>
          {product.priceOriginal && (
            <span className="text-[15px] text-muted line-through">
              {formatUSD(product.priceOriginal)}
            </span>
          )}
        </div>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          <Editable
            eid={`product.${product.slug}.description`}
            fallback={product.description}
          />
        </p>

        <div className="mt-8 border-t border-line pt-8">
          <ProductCustomizer
            product={product}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
        </div>
      </div>
    </div>
  );
}
