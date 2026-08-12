"use client";

import { useState } from "react";
import { Editable } from "@/components/editable/Editable";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="card space-y-4 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[13px] font-medium text-ink">
            <Editable eid="contact.form.name" fallback="Name" />
          </label>
          <input
            required
            className="w-full rounded-xl2 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink/40"
          />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-ink">
            <Editable eid="contact.form.email" fallback="Email" />
          </label>
          <input
            required
            type="email"
            className="w-full rounded-xl2 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink/40"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-medium text-ink">
          <Editable eid="contact.form.order" fallback="Order number (optional)" />
        </label>
        <input className="w-full rounded-xl2 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink/40" />
      </div>
      <div>
        <label className="mb-1 block text-[13px] font-medium text-ink">
          <Editable eid="contact.form.message" fallback="Message" />
        </label>
        <textarea
          required
          rows={4}
          className="w-full rounded-xl2 border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink/40"
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        <Editable eid="contact.form.submit" fallback="Send Message" />
      </button>
      {sent && (
        <p className="text-[13px] font-medium text-green-700">
          <Editable
            eid="contact.form.sentNote"
            fallback="Thanks! This is a demo form — no message was actually sent. We'll connect a real inbox when you add an email service."
          />
        </p>
      )}
    </form>
  );
}
