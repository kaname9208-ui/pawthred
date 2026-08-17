import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthed } from "@/lib/auth/admin";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// POST /api/admin/upload —— 后台上传商品图片到 Blob（public，供前台展示）
export async function POST(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not configured." }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file received." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Please upload a JPG, PNG, WEBP or GIF image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").replace(/[^a-zA-Z0-9]/g, "");
  const pathname = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  try {
    const blob = await put(pathname, file, { access: "public", token });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err: any) {
    console.error("Admin upload error:", err);
    return NextResponse.json({ error: err?.message || "Upload failed." }, { status: 500 });
  }
}
