"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import { PhotoUploader, type UploadedPhoto } from "@/components/PhotoUploader";
import { StickyCartCTA } from "@/components/StickyCartCTA";
import { Editable } from "@/components/editable/Editable";
import { cn } from "@/lib/format";

const embroideryStyleImages: Record<string, string> = {
  "portrait-only": "/options/embroidery-style-portrait-only.jpg",
  "portrait-name": "/options/embroidery-style-college.jpg",
  "name-only": "/options/embroidery-style-name-under.jpg",
};

const placementImages: Record<string, string> = {
  "left-chest": "/options/placement-left-chest.jpg",
  "front-center": "/options/placement-front-center.jpg",
  "back-center": "/options/placement-back-center.jpg",
};

function ImageOptionPreview({
  type,
  label,
  images,
}: {
  type: string;
  label: string;
  images: Record<string, string>;
}) {
  return (
    <span className="block">
      <span className="relative mb-2 block aspect-square w-full overflow-hidden rounded-xl2 bg-white">
        <img
          src={images[type]}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
        />
      </span>
      <span className="block text-[12.5px] font-semibold text-ink">{label}</span>
    </span>
  );
}

export function ProductCustomizer({
  product,
  selectedColor = "",
  onColorChange,
}: {
  product: Product;
  /** 受控颜色（与图廊共享），不传则组件内部自理 */
  selectedColor?: string;
  onColorChange?: (v: string) => void;
}) {
  const { addItem } = useCart();

  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [petCount, setPetCount] = useState(1);
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const opt of product.options) {
      // 颜色由父级（ProductDetail）统一控制，这里不写入选初始值
      if (opt.id === "color") continue;
      if (opt.type === "select" && opt.choices?.length) init[opt.id] = opt.choices[0].value;
    }
    return init;
  });
  const [added, setAdded] = useState(false);

  const price = useMemo(() => {
    const fleece = selections.fleece === "yes" ? 5 : 0;
    return product.priceFrom + fleece + (petCount - 1) * product.perExtraPet;
  }, [product, petCount, selections.fleece]);

  function setOpt(id: string, value: string) {
    setSelections((s) => ({ ...s, [id]: value }));
  }

  function handleAdd() {
    if (photos.length === 0) return;
    addItem({
      slug: product.slug,
      name: product.name,
      price,
      qty: 1,
      options: {
        pets: String(petCount),
        ...selections,
        ...(selectedColor ? { color: selectedColor } : {}),
      },
      photoName: photos.map((photo) => photo.name).join(", "),
      photoUrl: photos.find((photo) => photo.photoUrl)?.photoUrl,
      photoNames: photos.map((photo) => photo.name),
      photoUrls: photos.map((photo) => photo.photoUrl).filter(Boolean) as string[],
      category: product.category,
    });
    setAdded(true);
  }

  const canAdd = photos.length > 0;

  return (
    <div className="space-y-8">
      {/* Upload */}
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">
          <Editable eid="customizer.step1" fallback="1 · Upload Pet Photo" />
        </h3>
        <PhotoUploader maxPhotos={3} onPhotoChange={setPhotos} />
      </div>

      {/* Pet count */}
      <div>
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">
          <Editable eid="customizer.step2" fallback="2 · How many pets?" />
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setPetCount(n)}
              className={cn(
                "flex-1 rounded-xl2 border px-4 py-3 text-sm font-medium transition-colors",
                petCount === n
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-paper text-ink hover:border-ink/40"
              )}
            >
              {n}{" "}
              <Editable
                eid={n > 1 ? "customizer.pets" : "customizer.pet"}
                fallback={n > 1 ? "Pets" : "Pet"}
              />
              {n > 1 && (
                <span className="block text-[11px] font-normal opacity-70">
                  +${product.perExtraPet * (n - 1)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Remaining options (color/size/placement/text) */}
      <div className="space-y-5">
        {product.options.map((opt) => (
          <div key={opt.id}>
            <h3 className="mb-3 font-display text-lg font-semibold text-ink">
              <Editable eid={`customizer.opt.${opt.id}`} fallback={opt.label} />
              {opt.required && <span className="ml-1 text-warm-dark">*</span>}
            </h3>

            {opt.type === "select" && opt.id === "color" && opt.choices && (
              <div className="flex flex-wrap gap-3">
                {opt.choices.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => onColorChange?.(c.value)}
                    title={c.label}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-transform",
                      selectedColor === c.value ? "border-ink scale-110" : "border-line"
                    )}
                    style={{ backgroundColor: c.swatch }}
                    aria-label={c.label}
                  />
                ))}
              </div>
            )}

            {opt.type === "select" && opt.id === "embroideryStyle" && opt.choices && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {opt.choices.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setOpt(opt.id, c.value)}
                    className={cn(
                      "rounded-xl2 border bg-paper p-2 text-center transition-colors",
                      selections[opt.id] === c.value
                        ? "border-ink ring-2 ring-ink/10"
                        : "border-line hover:border-ink/40"
                    )}
                  >
                    <ImageOptionPreview type={c.value} label={c.label} images={embroideryStyleImages} />
                  </button>
                ))}
              </div>
            )}

            {opt.type === "select" && opt.id === "placement" && opt.choices && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {opt.choices.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setOpt(opt.id, c.value)}
                    className={cn(
                      "min-h-[92px] rounded-xl2 border bg-paper p-3 text-center transition-colors",
                      selections[opt.id] === c.value
                        ? "border-ink ring-2 ring-ink/10"
                        : "border-line hover:border-ink/40"
                    )}
                  >
                    <ImageOptionPreview type={c.value} label={c.label} images={placementImages} />
                  </button>
                ))}
              </div>
            )}

            {opt.type === "select" && opt.id !== "color" && opt.id !== "embroideryStyle" && opt.id !== "placement" && opt.choices && (
              <div className="flex flex-wrap gap-2">
                {opt.choices.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setOpt(opt.id, c.value)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      selections[opt.id] === c.value
                        ? "border-ink bg-ink text-cream"
                        : "border-line bg-paper text-ink hover:border-ink/40"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {opt.type === "text" && (
              <input
                type="text"
                value={selections[opt.id] ?? ""}
                onChange={(e) => setOpt(opt.id, e.target.value)}
                placeholder={opt.placeholder}
                maxLength={20}
                className="w-full max-w-xs rounded-xl2 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink/40"
              />
            )}
          </div>
        ))}
      </div>

      {/* Price + Add (desktop) */}
      <div className="hidden items-center justify-between gap-4 rounded-xl2 border border-line bg-paper p-5 lg:flex">
        <div>
          <div className="text-[12px] text-muted">
            <Editable eid="customizer.yourPiece" fallback="Your custom piece" />
          </div>
          <div className="font-display text-2xl font-semibold text-ink">${price.toFixed(2)}</div>
        </div>
        {added ? (
          <Link href="/cart" className="btn-primary">
            <Editable eid="customizer.viewCart" fallback="View Cart →" />
          </Link>
        ) : (
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Editable eid="customizer.add" fallback="Create My Custom Piece" />
          </button>
        )}
      </div>

      {!canAdd && (
        <p className="hidden text-[13px] font-medium text-warm-dark lg:block">
          <Editable eid="customizer.needPhoto" fallback="Please upload your pet photo first." />
        </p>
      )}
      {added && (
        <p className="hidden text-[13px] font-medium text-green-700 lg:block">
          <Editable eid="customizer.added" fallback="Added to cart! Review in your cart before checkout." />
        </p>
      )}

      {/* Mobile sticky CTA */}
      <StickyCartCTA
        price={price}
        label={canAdd ? "Create My Custom Piece" : "Upload Photo First"}
        disabled={!canAdd}
        onClick={handleAdd}
        hint={added ? "Added · " : "Your piece"}
      />
    </div>
  );
}
