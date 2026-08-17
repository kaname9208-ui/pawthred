import { createHash } from "crypto";
import { cookies } from "next/headers";

// 极简后台鉴权：用环境变量 ADMIN_PASSWORD 做口令，登录后下发一个
// 由口令派生的 token cookie（httpOnly）。每次后台请求重新用环境变量核算，
// 无需数据库。注意：这是 MVP 方案，正式上线建议配合更强的会话管理。

export const ADMIN_COOKIE = "paw_admin";

function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHash("sha256").update(`pawthred-admin:${pw}`).digest("hex");
}

export function isAuthed(): boolean {
  const exp = expectedToken();
  if (!exp) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return token === exp;
}

export function makeToken(): string | null {
  return expectedToken();
}

export const ADMIN_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 天
  secure: process.env.NODE_ENV === "production",
};
