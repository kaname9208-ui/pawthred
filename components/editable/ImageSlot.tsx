"use client";

import { useRef } from "react";
import { useEdit } from "@/components/editable/EditProvider";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { cn } from "@/lib/format";

interface Props {
  eid: string;
  ratio?: string;
  tint?: string;
  fallbackLabel?: string;
  className?: string;
  rounded?: boolean;
}

// 把上传图片压缩到合适尺寸并转为 dataURL（避免 localStorage 超额）
function fileToDataUrl(file: File, max = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 可编辑图片位：编辑模式下点击即可上传/替换你自己的图；非编辑态正常展示。
export function ImageSlot({
  eid,
  ratio = "4/5",
  tint = "#EDE6DA",
  fallbackLabel,
  className,
  rounded = true,
}: Props) {
  const { editing, getImage, setImage, removeImage, setActive } = useEdit();
  const inputRef = useRef<HTMLInputElement>(null);
  const src = getImage(eid);

  async function onFile(file?: File) {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setImage(eid, url);
  }

  const [rw, rh] = ratio.split("/").map(Number);
  const pad = rh && rw ? (rh / rw) * 100 : 100;

  return (
    <div
      className={cn("relative w-full", className)}
      onClick={
        editing
          ? (e) => {
              e.stopPropagation();
              setActive({ type: "image", eid });
              inputRef.current?.click();
            }
          : undefined
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {src ? (
        <div
          className={cn(
            "relative w-full overflow-hidden",
            rounded && "rounded-xl2",
            editing && "outline outline-2 outline-dashed outline-warm"
          )}
          style={{ paddingTop: `${pad}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={fallbackLabel ?? "custom image"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className={cn(editing && "rounded-xl2 outline outline-2 outline-dashed outline-warm")}>
          <ImagePlaceholder ratio={ratio} tint={tint} label={fallbackLabel} rounded={rounded} />
        </div>
      )}

      {editing && (
        <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10.5px] font-medium text-cream">
          {src ? "Click to replace" : "Click to add your image"}
        </span>
      )}

      {editing && src && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeImage(eid);
          }}
          className="absolute right-2 top-2 z-10 rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-medium text-cream"
        >
          Remove
        </button>
      )}
    </div>
  );
}
