import { NextRequest, NextResponse } from "next/server";
import { list, put, del } from "@vercel/blob";
import { isAuthed } from "@/lib/auth/admin";

export const runtime = "nodejs";

// 站点级编辑覆盖（文字 + 图片），存为 Vercel Blob 上的公开 JSON。
// 这是「已发布」内容的唯一真相来源：所有访客都读取它，只有管理员能写入。
const PATH = "site-edits.json";

type Overrides = {
  text: Record<string, string>;
  image: Record<string, string>;
};

function sanitizeRecord(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  return Object.fromEntries(
    Object.entries(input as Record<string, unknown>).filter(
      ([, value]) => typeof value === "string"
    )
  ) as Record<string, string>;
}

function sanitizeOverrides(input: Partial<Overrides> | unknown): Overrides {
  const value = input as Partial<Overrides> | undefined;
  return {
    text: sanitizeRecord(value?.text),
    image: sanitizeRecord(value?.image),
  };
}

async function readEdits(): Promise<Overrides> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return { text: {}, image: {} };
  try {
    const { blobs } = await list({ token, prefix: PATH });
    const found = blobs.find((b) => b.pathname === PATH);
    if (!found) return { text: {}, image: {} };
    const res = await fetch(found.url);
    if (!res.ok) return { text: {}, image: {} };
    const json = (await res.json()) as Partial<Overrides>;
    return sanitizeOverrides(json);
  } catch {
    return { text: {}, image: {} };
  }
}

// 公开读取：任何访客都能拿到当前已发布的编辑
export async function GET() {
  const edits = await readEdits();
  return NextResponse.json(edits, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=300" },
  });
}

// 写入：仅管理员（cookie 校验）
export async function POST(req: NextRequest) {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not configured." }, { status: 500 });
  }
  let body: Partial<Overrides>;
  try {
    body = (await req.json()) as Partial<Overrides>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const edits = sanitizeOverrides(body);
  try {
    // 先用固定路径删除旧文件（若存在），再写入，保证覆盖更新
    try {
      await del(PATH, { token });
    } catch {
      /* 不存在则忽略 */
    }
    await put(PATH, JSON.stringify(edits), {
      access: "public",
      token,
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Save edits error:", err);
    return NextResponse.json({ error: err?.message || "Save failed." }, { status: 500 });
  }
}
