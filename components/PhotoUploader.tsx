"use client";

import { useRef, useState } from "react";
import { Editable } from "@/components/editable/Editable";

interface Props {
  onPhotoChange: (info: { name: string; previewUrl: string; photoUrl?: string } | null) => void;
}

// 真正上传：选图后立刻本地预览，同时把文件 POST 到 /api/upload（服务端用 BLOB_READ_WRITE_TOKEN
// 存到 Vercel Blob），拿到永久可访问的 photoUrl。这样卖家端才能收到顾客的照片。
export function PhotoUploader({ onPhotoChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadToServer(file: File): Promise<string | undefined> {
    const form = new FormData();
    form.append("file", file);
    // 定制阶段还没有 Stripe 订单号，用一个随机 id 作为本次上传的归属
    form.append("sessionId", `draft-${Math.random().toString(36).slice(2, 10)}`);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed.");
      }
      return data.url as string;
    } catch {
      return undefined; // 上传失败不阻断下单，但提示
    }
  }

  async function handleFile(file?: File) {
    if (!file) return;
    const okTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!okTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    setError(null);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setPhotoUrl(undefined);
    // 立即把本地预览交出去，用户体验不卡
    onPhotoChange({ name: file.name, previewUrl: localUrl });
    setUploading(true);
    const url = await uploadToServer(file);
    setUploading(false);
    if (url) {
      setPhotoUrl(url);
      // 用服务器真实 URL 覆盖，确保下单时带的是可访问链接
      onPhotoChange({ name: file.name, previewUrl: localUrl, photoUrl: url });
    } else {
      setError("Photo upload failed. You can still check out, but we may need you to resend it.");
    }
  }

  function clear() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPhotoUrl(undefined);
    if (inputRef.current) inputRef.current.value = "";
    onPhotoChange(null);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
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
              {uploading ? (
                <Editable eid="upload.uploading" fallback="Uploading to server…" />
              ) : photoUrl ? (
                <Editable eid="upload.uploadedNote" fallback="Saved — we'll use this for your design." />
              ) : (
                <Editable eid="upload.localNote" fallback="Saved on this device." />
              )}
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
