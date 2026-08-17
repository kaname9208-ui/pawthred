"use client";

import { useState } from "react";

export function PetPhotoUpload({ sessionId }: { sessionId: string | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleUpload() {
    if (!file) {
      setStatus("error");
      setMsg("Please choose a photo first.");
      return;
    }
    setStatus("uploading");
    setMsg("Uploading your pet's photo…");

    const fd = new FormData();
    fd.append("file", file);
    if (sessionId) fd.append("sessionId", sessionId);
    if (email) fd.append("email", email);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setStatus("done");
      setMsg("Got it! We'll start stitching your pet's portrait. 🧵");
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.message || "Upload failed. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mb-2 text-2xl">✅</div>
        <p className="font-medium text-green-800">{msg}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-6 max-w-md card p-6 text-left">
      <h2 className="font-display text-lg font-semibold text-ink">Upload your pet&apos;s photo</h2>
      <p className="mt-1 text-[13.5px] text-muted">
        We need a clear photo of your pet to embroider it. It&apos;s stored privately — only our
        team can see it.
      </p>

      <label className="mt-4 block text-[13px] font-medium text-ink">
        Pet photo
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-[13px] text-muted file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-warm-soft file:px-4 file:py-2 file:text-warm-dark"
        />
      </label>

      <label className="mt-3 block text-[13px] font-medium text-ink">
        Email (so we can match your order)
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 block w-full rounded-lg border border-line bg-white px-3 py-2 text-[13px] text-ink outline-none focus:border-warm"
        />
      </label>

      <button
        type="button"
        onClick={handleUpload}
        disabled={status === "uploading"}
        className="btn-primary mt-4 w-full disabled:opacity-60"
      >
        {status === "uploading" ? "Uploading…" : "Upload photo"}
      </button>

      {status === "error" && <p className="mt-2 text-[13px] text-red-600">{msg}</p>}
    </div>
  );
}
