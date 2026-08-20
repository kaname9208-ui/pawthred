import { list, put } from "@vercel/blob";

const SUBSCRIBERS_PATH = "subscribers/subscribers.json";

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  source?: string;
}

async function readRaw(): Promise<Subscriber[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return [];
  try {
    const { blobs } = await list({ token, prefix: SUBSCRIBERS_PATH });
    const found = blobs.find((b) => b.pathname === SUBSCRIBERS_PATH) ?? blobs[0];
    if (!found) return [];
    const res = await fetch(found.url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = (await res.json()) as Subscriber[];
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function readSubscribers(): Promise<Subscriber[]> {
  const all = await readRaw();
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addSubscriber(email: string, source = "footer"): Promise<Subscriber> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  const normalized = email.trim().toLowerCase();
  const current = await readRaw();
  const existing = current.find((s) => s.email.toLowerCase() === normalized);
  if (existing) return existing;
  const subscriber: Subscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: normalized,
    source,
    createdAt: new Date().toISOString(),
  };
  current.push(subscriber);
  await put(SUBSCRIBERS_PATH, JSON.stringify(current, null, 2), {
    access: "public",
    token,
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return subscriber;
}
