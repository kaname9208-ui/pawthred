import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_OPTS, makeToken } from "@/lib/auth/admin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    return NextResponse.json(
      { error: "Admin password is not configured. Add ADMIN_PASSWORD to your host environment variables." },
      { status: 500 }
    );
  }
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.password !== pw) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const token = makeToken();
  if (!token) {
    return NextResponse.json({ error: "Admin password is not configured." }, { status: 500 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, ADMIN_COOKIE_OPTS);
  return res;
}
