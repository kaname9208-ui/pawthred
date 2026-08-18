"use client";

import { useRef, useState } from "react";
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

// 可编辑图片位：编辑模式下点击即可上传/替换你自己的图；
// 上传会发到服务端（Vercel Blob 公开存储），对所有访客生效，不再只存本地。
export function ImageSlot({
  eid,
  ratio = "4/5",
  tint = "#EDE6DA",
  fallbackLabel,
  className,
  rounded = true,
}: Props) {
  const { editing, getImage, setImage, removeImage, setActive, uploadImage } = useEdit();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const src = getImage(eid);

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      setImage(eid, url);
    } catch (err: any) {
      alert(`Upload failed: ${err?.message || "Unknown error"}`);
    } finally {
      setBusy(false);
    }
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
          {busy ? "Uploading…" : src ? "Click to replace" : "Click to add your image"}
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
