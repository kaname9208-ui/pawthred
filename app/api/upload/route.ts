import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// 服务端用 BLOB_READ_WRITE_TOKEN 把顾客宠物照存进 Vercel Blob（private）。
// token 只存在于服务器，绝不暴露给浏览器。
export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024; // 12MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Storage is not configured. Add BLOB_READ_WRITE_TOKEN to your host's environment variables (Vercel Project Settings → Environment Variables).",
      },
      { status: 500 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = form.get("file");
  const sessionId = (form.get("sessionId") as string) || "unknown";
  const email = (form.get("email") as string) || "";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file received." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, WEBP or GIF image." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 12MB)." }, { status: 400 });
  }

  const safeName = (file.name || "pet-photo").replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `orders/${sessionId}/${Date.now()}-${safeName}`;

  try {
    const blob = await put(pathname, file, {
      access: "private",
      token,
      metadata: email ? { email, sessionId } : { sessionId },
    });
    return NextResponse.json({ ok: true, url: blob.url, pathname: blob.pathname });
  } catch (err: any) {
    console.error("Blob upload error:", err);
    return NextResponse.json({ error: err?.message || "Upload failed." }, { status: 500 });
  }
}
