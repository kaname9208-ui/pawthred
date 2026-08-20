import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth/admin";
import { addSubscriber, readSubscribers } from "@/lib/data/subscribers";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const subscribers = await readSubscribers();
  return NextResponse.json({ subscribers });
}

export async function POST(req: NextRequest) {
  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const email = String(body.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  try {
    const subscriber = await addSubscriber(email, body.source || "footer");
    return NextResponse.json({ ok: true, subscriber });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Could not save email." },
      { status: 500 }
    );
  }
}
