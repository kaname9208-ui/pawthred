"use client";

import { useRef, useState } from "react";
import { Editable } from "@/components/editable/Editable";

interface Props {
  onPhotoChange: (info: { name: string; previewUrl: string } | null) => void;
}

// 纯前端上传：仅生成本地预览 URL，不传输到任何服务器（无后端/无 API Key 时使用）。
export function PhotoUploader({ onPhotoChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file?: File) {
    if (!file) return;
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onPhotoChange({ name: file.name, previewUrl: url });
  }

  function clear() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onPhotoChange(null);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl2 border-2 border-dashed border-line bg-paper px-6 py-10 text-center transition-colors hover:border-warm"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9A6F45"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 16V4m0 0L8 8m4-4l4 4" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          <span className="text-sm font-medium text-ink">
            <Editable eid="upload.title" fallback="Upload Your Pet Photo" />
          </span>
          <span className="text-[12.5px] text-muted">
            <Editable eid="upload.formats" fallback="JPG · PNG · WEBP" />
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-4 rounded-xl2 border border-line bg-paper p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Uploaded pet preview" className="h-20 w-20 rounded-lg object-cover" />
          <div className="flex-1">
            <div className="text-sm font-medium text-ink">
              <Editable eid="upload.uploaded" fallback="Photo uploaded" />
            </div>
            <div className="text-[12.5px] text-muted">
              <Editable
                eid="upload.uploadedNote"
                fallback="Looks good — we'll use this for your design."
              />
            </div>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-[13px] font-medium text-warm-dark hover:underline"
          >
            <Editable eid="upload.replace" fallback="Replace" />
          </button>
        </div>
      )}

      <p className="mt-2 text-[12.5px] text-muted">
        <Editable eid="upload.tip" fallback="Best results come from clear, well-lit photos." />
      </p>
      {error && <p className="mt-1 text-[12.5px] text-red-600">{error}</p>}
    </div>
  );
}
