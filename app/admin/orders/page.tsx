"use client";

import { useEffect, useState } from "react";
import { Editable } from "@/components/editable/Editable";

interface OrderItem {
  slug: string;
  name: string;
  price: number;
  qty: number;
  options: Record<string, string>;
  photoUrl?: string;
  category?: string;
}

interface Order {
  id: string;
  sessionId?: string;
  paymentIntentId?: string;
  email?: string;
  customerName?: string;
  phone?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  createdAt: string;
  paidAt?: string;
  status: "paid" | "pending";
}

const OPT_LABELS: Record<string, string> = {
  color: "Color",
  size: "Size",
  placement: "Placement",
  petName: "Name",
  pets: "Pets",
  fleece: "Fleece",
};

function formatUSD(n: number) {
  return `$${Number(n).toFixed(2)}`;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatAddress(order: Order) {
  const a = order.shippingAddress;
  if (!a) return "";
  return [a.line1, a.line2, a.city, a.state, a.postalCode, a.country]
    .filter(Boolean)
    .join(", ");
}

export default function AdminOrdersPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

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
    try {
      const r = await fetch("/api/orders");
      const d = await r.json();
      if (r.ok) setOrders(d.orders || []);
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
    return <div className="container-page section text-muted">Loading…</div>;
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
        <p className="mt-4 text-[12.5px] text-muted">
          This is your seller portal — view orders and customer pet photos here.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page section">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="h-display text-3xl">Orders &amp; Customer Photos</h1>
          <p className="mt-1 text-[13px] text-muted">
            {orders.length} order{orders.length === 1 ? "" : "s"} · photos are uploaded by customers
          </p>
        </div>
        <button onClick={load} className="rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-medium text-ink shadow">
          ↻ Refresh
        </button>
      </div>

      {loading && <p className="text-muted">Loading…</p>}

      {!loading && orders.length === 0 && (
        <div className="card p-10 text-center text-muted">
          No orders yet. When a customer checks out, their order and pet photo will appear here.
        </div>
      )}

      <div className="space-y-5">
        {orders.map((o) => (
          <div key={o.id} className="card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper px-5 py-3">
              <div className="text-[13px]">
                <span className="font-semibold text-ink">{o.email || "(no email)"}</span>
                <span className="ml-2 text-muted">{fmtDate(o.createdAt)}</span>
              </div>
              <div className="text-[13px] text-muted">
                {o.status === "paid" ? "✓ Paid" : "Pending"} ·{" "}
                <span className="font-semibold text-ink">{formatUSD(o.total)}</span>
              </div>
            </div>

            {(o.customerName || o.phone || formatAddress(o)) && (
              <div className="border-b border-line bg-cream px-5 py-3 text-[13px] text-charcoal">
                {o.customerName && <div>Name: {o.customerName}</div>}
                {o.phone && <div>Phone: {o.phone}</div>}
                {formatAddress(o) && <div>Ship to: {formatAddress(o)}</div>}
              </div>
            )}

            <div className="divide-y divide-line">
              {o.items.map((it, i) => (
                <div key={i} className="flex gap-4 p-5">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-paper">
                    {it.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.photoUrl} alt="Customer pet photo" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] text-muted">
                        no photo
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg font-semibold text-ink">
                      {it.name} × {it.qty}
                    </div>
                    <div className="mt-1 text-[13px] text-muted">
                      {formatUSD(it.price * it.qty)}
                    </div>
                    {it.photoUrl && (
                      <a
                        href={it.photoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-[12.5px] font-medium text-warm-dark hover:underline"
                      >
                        Open full photo ↗
                      </a>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.entries(it.options || {}).map(([k, v]) => (
                        <span
                          key={k}
                          className="rounded-full bg-paper px-2.5 py-1 text-[11.5px] text-charcoal"
                        >
                          {OPT_LABELS[k] || k}: {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 border-t border-line bg-paper px-5 py-3 text-[13px] text-muted">
              <span>Subtotal {formatUSD(o.subtotal)}</span>
              {o.discount > 0 && <span className="text-green-700">−{formatUSD(o.discount)}</span>}
              <span>Shipping {o.shipping > 0 ? formatUSD(o.shipping) : "Free"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
