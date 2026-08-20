"use client";

import { useState } from "react";

export function EmailSubscribe({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        if (!email.includes("@")) return;
        setBusy(true);
        try {
          const res = await fetch("/api/subscribers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data.error || "Could not save email.");
          setDone(true);
          setEmail("");
        } catch (err: any) {
          setError(err?.message || "Could not save email.");
        } finally {
          setBusy(false);
        }
      }}
      className="w-full"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink/40"
        />
        <button type="submit" disabled={busy} className="btn-primary shrink-0 disabled:opacity-50">
          {busy ? "Saving..." : "Subscribe"}
        </button>
      </div>
      {done && (
        <p className="mt-2 text-[12.5px] text-warm-dark">
          Thanks! You are on the list.
        </p>
      )}
      {error && <p className="mt-2 text-[12.5px] text-red-600">{error}</p>}
    </form>
  );
}
