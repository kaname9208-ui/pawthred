"use client";

import { useEffect, useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  source?: string;
}

function fmtDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminSubscribersPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => {
        setAuthed(!!d.authed);
        if (d.authed) load();
      })
      .catch(() => setAuthed(false));
  }, []);

  async function load() {
    setLoading(true);
    setLoadErr(null);
    try {
      const r = await fetch("/api/subscribers");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not load subscribers.");
      setSubscribers(Array.isArray(d.subscribers) ? d.subscribers : []);
    } catch (err: any) {
      setLoadErr(err?.message || "Could not load subscribers.");
    } finally {
      setLoading(false);
    }
  }

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr(null);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const d = await r.json();
    if (r.ok && d.ok) {
      setAuthed(true);
      load();
    } else {
      setLoginErr(d.error || "Login failed.");
    }
  }

  if (authed === null) {
    return <div className="container-page section text-muted">Loading...</div>;
  }

  if (!authed) {
    return (
      <div className="container-page section max-w-sm">
        <h1 className="h-display mb-6 text-3xl">Seller Login</h1>
        <form onSubmit={doLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl2 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink/40"
          />
          {loginErr && <p className="text-[13px] text-red-600">{loginErr}</p>}
          <button type="submit" className="btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-page section">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="h-display text-3xl">Email Subscribers</h1>
          <p className="mt-1 text-[13px] text-muted">
            {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-medium text-ink shadow"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-muted">Loading...</p>}
      {loadErr && <div className="mb-5 rounded-xl2 bg-red-50 p-4 text-[13px] text-red-700">{loadErr}</div>}

      {!loading && subscribers.length === 0 && (
        <div className="card p-10 text-center text-muted">No email subscribers yet.</div>
      )}

      <div className="overflow-hidden rounded-xl2 border border-line bg-white">
        {subscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 last:border-b-0"
          >
            <a href={`mailto:${subscriber.email}`} className="font-semibold text-ink underline-offset-2 hover:underline">
              {subscriber.email}
            </a>
            <div className="text-[13px] text-muted">
              {subscriber.source || "footer"} · {fmtDate(subscriber.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
