"use client";

import { useRef, useState } from "react";
import { Editable } from "@/components/editable/Editable";

export interface UploadedPhoto {
  name: string;
  previewUrl: string;
  photoUrl?: string;
}

interface Props {
  maxPhotos?: number;
  onPhotoChange: (photos: UploadedPhoto[]) => void;
}

const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function PhotoUploader({ maxPhotos = 3, onPhotoChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(next: UploadedPhoto[]) {
    setPhotos(next);
    onPhotoChange(next);
  }

  async function uploadToServer(file: File): Promise<string | undefined> {
    const form = new FormData();
    form.append("file", file);
    form.append("sessionId", `draft-${Math.random().toString(36).slice(2, 10)}`);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error || "Upload failed.");
      return data.url as string;
    } catch {
      return undefined;
    }
  }

  async function handleFiles(files?: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, Math.max(0, maxPhotos - photos.length));
    if (selected.length === 0) {
      setError(`You can upload up to ${maxPhotos} photos.`);
      return;
    }
    const invalid = selected.find((file) => !OK_TYPES.includes(file.type));
    if (invalid) {
      setError("Please upload JPG, PNG, WEBP, or GIF images.");
      return;
    }

    setError(null);
    const localPhotos = selected.map((file) => ({
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));
    const startIndex = photos.length;
    const withPreviews = [...photos, ...localPhotos];
    update(withPreviews);

    setUploading(true);
    const uploaded = await Promise.all(selected.map(uploadToServer));
    setUploading(false);

    update(
      withPreviews.map((photo, index) =>
        index >= startIndex
          ? { ...photo, photoUrl: uploaded[index - startIndex] }
          : photo
      )
    );

    if (uploaded.some((url) => !url)) {
      setError("Some photos did not upload. You can still check out, but we may need you to resend them.");
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(index: number) {
    const target = photos[index];
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    update(photos.filter((_, i) => i !== index));
  }

  const canAdd = photos.length < maxPhotos;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {photos.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl2 border-2 border-dashed border-line bg-paper px-6 py-10 text-center transition-colors hover:border-warm"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9A6F45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 16V4m0 0L8 8m4-4l4 4" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
          </svg>
          <span className="text-sm font-medium text-ink">
            <Editable eid="upload.title" fallback="Upload Pet Photos" />
          </span>
          <span className="text-[12.5px] text-muted">JPG · PNG · WEBP · up to {maxPhotos}</span>
        </button>
      ) : (
        <div className="rounded-xl2 border border-line bg-paper p-3">
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div key={photo.previewUrl} className="relative overflow-hidden rounded-lg border border-line bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.previewUrl} alt={photo.name} className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute right-1 top-1 rounded-full bg-ink/80 px-2 py-0.5 text-[11px] text-cream"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-[12.5px] text-muted">
              {uploading ? "Uploading..." : `${photos.length}/${maxPhotos} photos saved`}
            </div>
            {canAdd && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-[13px] font-medium text-warm-dark hover:underline"
              >
                Add another
              </button>
            )}
          </div>
        </div>
      )}

      <p className="mt-2 text-[12.5px] text-muted">
        <Editable eid="upload.tip" fallback="Best results come from clear, well-lit photos." />
      </p>
      {error && <p className="mt-1 text-[12.5px] text-red-600">{error}</p>}
    </div>
  );
}
