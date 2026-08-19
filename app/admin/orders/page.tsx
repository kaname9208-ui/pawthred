"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  slug?: string;
  name?: string;
  price?: number;
  qty?: number;
  options?: Record<string, string>;
  photoUrl?: string;
  category?: string;
}

interface Order {
  id?: string;
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
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  shipping?: number;
  total?: number;
  createdAt?: string;
  paidAt?: string;
  status?: "paid" | "pending";
}

const OPT_LABELS: Record<string, string> = {
  color: "Color",
  size: "Size",
  placement: "Placement",
  petName: "Name",
  pets: "Pets",
  fleece: "Fleece",
};

function formatUSD(n?: number) {
  return `$${(Number(n) || 0).toFixed(2)}`;
}

function fmtDate(iso?: string) {
  if (!iso) return "";
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

function safeItems(order: Order): OrderItem[] {
  return Array.isArray(order.items) ? order.items : [];
}

export default function AdminOrdersPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
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
      const r = await fetch("/api/orders");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Could not load orders.");
      setOrders(Array.isArray(d.orders) ? d.orders : []);
    } catch (err: any) {
      setLoadErr(err?.message || "Could not load orders.");
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
        <p className="mt-4 text-[12.5px] text-muted">
          View orders, customer details, and pet photos here.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page section">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="h-display text-3xl">Orders &amp; Customer Photos</h1>
          <p className="mt-1 text-[13px] text-muted">
            {orders.length} order{orders.length === 1 ? "" : "s"}
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

      {!loading && orders.length === 0 && (
        <div className="card p-10 text-center text-muted">
          No orders yet. New checkout attempts and paid orders will appear here.
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order, orderIndex) => {
          const items = safeItems(order);
          const address = formatAddress(order);
          return (
            <div key={order.id || orderIndex} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper px-5 py-3">
                <div className="text-[13px]">
                  <span className="font-semibold text-ink">{order.email || "(no email)"}</span>
                  <span className="ml-2 text-muted">{fmtDate(order.createdAt)}</span>
                </div>
                <div className="text-[13px] text-muted">
                  <span className={order.status === "paid" ? "font-semibold text-green-700" : "font-semibold text-warm-dark"}>
                    {order.status === "paid" ? "Paid" : "Pending"}
                  </span>
                  <span className="mx-2">-</span>
                  <span className="font-semibold text-ink">{formatUSD(order.total)}</span>
                </div>
              </div>

              {(order.customerName || order.phone || address || order.id) && (
                <div className="border-b border-line bg-cream px-5 py-3 text-[13px] text-charcoal">
                  {order.id && <div>Order ID: {order.id}</div>}
                  {order.customerName && <div>Name: {order.customerName}</div>}
                  {order.phone && <div>Phone: {order.phone}</div>}
                  {address && <div>Ship to: {address}</div>}
                </div>
              )}

              <div className="divide-y divide-line">
                {items.length === 0 && (
                  <div className="p-5 text-[13px] text-muted">
                    This order has no saved item details.
                  </div>
                )}
                {items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-4 p-5">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-paper">
                      {item.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.photoUrl}
                          alt="Customer pet photo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[11px] text-muted">
                          no photo
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-lg font-semibold text-ink">
                        {item.name || "Custom item"} x {item.qty || 1}
                      </div>
                      <div className="mt-1 text-[13px] text-muted">
                        {formatUSD((Number(item.price) || 0) * (Number(item.qty) || 1))}
                      </div>
                      {item.photoUrl && (
                        <a
                          href={item.photoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-block text-[12.5px] font-medium text-warm-dark hover:underline"
                        >
                          Open full photo
                        </a>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {Object.entries(item.options || {}).map(([k, v]) => (
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

              <div className="flex flex-wrap justify-end gap-4 border-t border-line bg-paper px-5 py-3 text-[13px] text-muted">
                <span>Subtotal {formatUSD(order.subtotal)}</span>
                {(Number(order.discount) || 0) > 0 && (
                  <span className="text-green-700">-{formatUSD(order.discount)}</span>
                )}
                <span>Shipping {(Number(order.shipping) || 0) > 0 ? formatUSD(order.shipping) : "Free"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
