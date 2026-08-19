"use client";

import { useState } from "react";

export function EmailSubscribe({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
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
        <button type="submit" className="btn-primary shrink-0">
          Subscribe
        </button>
      </div>
      {done && (
        <p className="mt-2 text-[12.5px] text-warm-dark">
          Thanks! You are on the list.
        </p>
      )}
    </form>
  );
}
