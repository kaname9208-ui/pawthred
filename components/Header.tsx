"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { siteConfig } from "@/lib/config/site.config";
import { Editable } from "@/components/editable/Editable";
import { cn } from "@/lib/format";

function Icon({ name }: { name: "search" | "account" | "cart" | "menu" | "close" }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "search")
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" />
      </svg>
    );
  if (name === "account")
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </svg>
    );
  if (name === "cart")
    return (
      <svg {...common}>
        <path d="M6 7h12l-1 13H7L6 7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    );
  if (name === "menu")
    return (
      <svg {...common}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <button
          className="md:hidden p-2 -ml-2 text-ink"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>

        <Link href="/" className="flex items-center" aria-label={siteConfig.brandName}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/pawthred-wordmark.png"
            alt={siteConfig.brandName}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-charcoal">
          {siteConfig.nav.map((n, i) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-ink">
              <Editable eid={`nav.${i}`} fallback={n.label} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="hidden sm:inline-flex p-2 text-ink/80 hover:text-ink" aria-label="Search">
            <Icon name="search" />
          </button>
          <button className="hidden sm:inline-flex p-2 text-ink/80 hover:text-ink" aria-label="Account">
            <Icon name="account" />
          </button>
          <Link href="/cart" className="relative p-2 text-ink/80 hover:text-ink" aria-label="Cart">
            <Icon name="cart" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-warm px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className={cn("md:hidden overflow-hidden border-t border-line bg-cream transition-all", open ? "max-h-96" : "max-h-0")}>
        <nav className="container-page flex flex-col py-3 text-[14px] font-medium">
          {siteConfig.nav.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="border-b border-line/60 py-3 text-charcoal last:border-0"
            >
              <Editable eid={`nav.${i}`} fallback={n.label} />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
