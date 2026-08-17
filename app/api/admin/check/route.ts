import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth/admin";

export const runtime = "nodejs";

// GET /api/admin/check —— 返回当前请求是否处于管理员登录态，供前端编辑器决定
// 是否允许进入编辑模式 / 显示登录框。
export async function GET() {
  return NextResponse.json({ authed: isAuthed() });
}
