"use client";

import { useEffect, useState } from "react";
import type { Product, Choice } from "@/lib/types";
import Link from "next/link";

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "color"
  );
}

// 屏幕吸色笔：用浏览器原生 EyeDropper API（Chrome / Edge 支持）。
// 不支持时回退到 <input type="color"> 取色器 + 手动填色值。
async function eyedrop(setHex: (h: string) => void) {
  const w = window as any;
  if (w.EyeDropper) {
    try {
      const res = await new w.EyeDropper().open();
      setHex(res.sRGBHex);
    } catch {
      /* 用户取消，忽略 */
    }
  } else {
    alert(
      "你的浏览器暂不支持“屏幕吸色”（需 Chrome 或 Edge）。\n可直接用左侧的取色器选色，或手动填入色值（如 #AABBCC）。"
    );
  }
}

function isHex(v: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

export default function ColorManager() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [slug, setSlug] = useState("");
  const [msg, setMsg] = useState("");

  const selected = products.find((p) => p.slug === slug);
  const colorOpt = selected?.options.find((o) => o.id === "color");
  const choices: Choice[] = colorOpt?.choices ?? [];

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/check");
        const j = await r.json().catch(() => ({ authed: false }));
        if (j.authed) {
          await load();
          setAuthed(true);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function load() {
    const r = await fetch("/api/admin/products");
    const j = await r.json();
    const list: Product[] = j.products ?? [];
    setProducts(list);
    if (list.length && !slug) setSlug(list[0].slug);
  }

  async function login() {
    setBusy(true);
    setPwErr(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        setAuthed(true);
        setPw("");
        await load();
      } else {
        setPwErr(true);
      }
    } finally {
      setBusy(false);
    }
  }

  // 修改某个颜色字段（label / value / swatch）
  function updateChoice(idx: number, field: keyof Choice, value: string) {
    setMsg("");
    setProducts((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        const opt = p.options.find((o) => o.id === "color");
        if (!opt || !opt.choices) return p;
        const newChoices = opt.choices.map((c, i) =>
          i === idx ? { ...c, [field]: value } : c
        );
        return {
          ...p,
          options: p.options.map((o) =>
            o.id === "color" ? { ...o, choices: newChoices } : o
          ),
        };
      })
    );
  }

  function removeChoice(idx: number) {
    setMsg("");
    setProducts((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        const opt = p.options.find((o) => o.id === "color");
        if (!opt || !opt.choices) return p;
        const newChoices = opt.choices.filter((_, i) => i !== idx);
        return {
          ...p,
          options: p.options.map((o) =>
            o.id === "color" ? { ...o, choices: newChoices } : o
          ),
        };
      })
    );
  }

  function addChoice() {
    setMsg("");
    setProducts((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p;
        const opt = p.options.find((o) => o.id === "color");
        if (!opt) return p;
        const existing = opt.choices ?? [];
        const fresh: Choice = {
          value: `custom-${existing.length + 1}`,
          label: "New Color",
          swatch: "#CCCCCC",
        };
        return {
          ...p,
          options: p.options.map((o) =>
            o.id === "color" ? { ...o, choices: [...existing, fresh] } : o
          ),
        };
      })
    );
  }

  async function save() {
    const p = products.find((x) => x.slug === slug);
    if (!p) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (!res.ok) throw new Error("Save failed");
      setMsg("✓ Saved — your color changes are live for everyone.");
    } catch {
      setMsg("✗ Could not save. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="container-page section text-center text-muted">Loading…</div>
    );
  }

  if (!authed) {
    return (
      <div className="container-page section max-w-md">
        <h1 className="h-display text-3xl">Color Manager</h1>
        <p className="mt-3 text-muted">Enter your admin password to manage product colors.</p>
        <div className="mt-6 flex gap-2">
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setPwErr(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Admin password"
            className="flex-1 rounded-xl2 border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-ink/40"
          />
          <button
            onClick={login}
            disabled={busy || !pw}
            className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-cream disabled:opacity-40"
          >
            {busy ? "…" : "Enter"}
          </button>
        </div>
        {pwErr && <p className="mt-2 text-[12px] text-red-600">Wrong password.</p>}
        <Link href="/" className="mt-6 inline-block text-[13px] text-muted hover:text-ink">
          ← Back to site
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page section">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h-display text-3xl">Color Manager</h1>
          <p className="mt-2 max-w-xl text-[14px] text-muted">
            给每个商品增删颜色、改名字或吸色。点 🎯 用屏幕吸色笔取色（Chrome / Edge），
            或用左侧取色器。改完点 Save 即全网生效。
          </p>
        </div>
        <Link href="/" className="text-[13px] text-muted hover:text-ink">
          ← Back to site
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="text-[14px] font-medium text-ink">Product:</label>
        <select
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setMsg("");
          }}
          className="rounded-xl2 border border-line bg-paper px-4 py-2 text-sm outline-none focus:border-ink/40"
        >
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-3">
        {choices.map((c, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-3 rounded-xl2 border border-line bg-paper p-4"
          >
            <span
              className="h-10 w-10 shrink-0 rounded-full border border-line"
              style={{ backgroundColor: c.swatch || "#cccccc" }}
            />
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wide text-muted">Name</span>
              <input
                value={c.label}
                onChange={(e) => updateChoice(i, "label", e.target.value)}
                className="w-36 rounded-lg border border-line bg-cream px-3 py-1.5 text-sm outline-none focus:border-ink/40"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wide text-muted">Value (id)</span>
              <input
                value={c.value}
                onChange={(e) => updateChoice(i, "value", e.target.value)}
                className="w-32 rounded-lg border border-line bg-cream px-3 py-1.5 text-sm outline-none focus:border-ink/40"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wide text-muted">Hex</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={isHex(c.swatch || "") ? c.swatch : "#cccccc"}
                  onChange={(e) => updateChoice(i, "swatch", e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded border border-line bg-transparent"
                  title="Pick a color"
                />
                <input
                  value={c.swatch || ""}
                  onChange={(e) => updateChoice(i, "swatch", e.target.value)}
                  placeholder="#AABBCC"
                  className="w-24 rounded-lg border border-line bg-cream px-3 py-1.5 text-sm outline-none focus:border-ink/40"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => eyedrop((h) => updateChoice(i, "swatch", h))}
              className="rounded-full border border-line bg-paper px-3 py-2 text-[13px] font-medium text-ink hover:border-ink/40"
              title="用屏幕吸色笔取色"
            >
              🎯 吸色
            </button>
            <button
              type="button"
              onClick={() => removeChoice(i)}
              className="ml-auto rounded-full border border-line px-3 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={addChoice}
          className="rounded-full border border-line bg-paper px-4 py-2.5 text-[13px] font-medium text-ink hover:border-ink/40"
        >
          + Add color
        </button>
        <button
          onClick={save}
          disabled={busy}
          className="rounded-full bg-ink px-6 py-2.5 text-[14px] font-medium text-cream disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        {msg && <span className="text-[13px] text-muted">{msg}</span>}
      </div>

      <p className="mt-8 max-w-xl text-[12px] leading-relaxed text-muted">
        小提示：Value(id) 用于存放该颜色的图片。改名（Name）不会影响已上传的图；但若改动
        Value(id) 或删除某颜色，该颜色已上传的图会断开（需重新上传）。新增颜色后记得去商品页
        把对应图片传上去。
      </p>
    </div>
  );
}
