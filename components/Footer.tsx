import Link from "next/link";
import { siteConfig } from "@/lib/config/site.config";
import { EmailSubscribe } from "@/components/EmailSubscribe";
import { Editable } from "@/components/editable/Editable";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "T-Shirts", href: "/products?cat=t-shirts" },
      { label: "Crewnecks", href: "/products?cat=crewnecks" },
      { label: "Socks", href: "/products?cat=socks" },
      { label: "Best Sellers", href: "/products" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/faq" },
      { label: "Returns", href: "/faq" },
      { label: "Size Guide", href: "/faq" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
];

const legal = [
  { label: "Privacy Policy", href: "/faq" },
  { label: "Terms", href: "/faq" },
  { label: "Refund Policy", href: "/faq" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <div className="font-display text-xl font-semibold text-ink">
            <Editable eid="brand.name" fallback={siteConfig.brandName} />
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            <Editable eid="footer.tagline" fallback={siteConfig.tagline} />
          </p>
          <div className="mt-5">
            <div className="mb-2 text-[13px] font-semibold text-ink">
              <Editable eid="footer.emailOffer" fallback={siteConfig.emailOffer} />
            </div>
            <EmailSubscribe />
          </div>
          <div className="mt-5 flex gap-3 text-ink/70">
            <a href={siteConfig.social.instagram} aria-label="Instagram" className="hover:text-ink">
              <Editable eid="footer.social.ig" fallback="IG" />
            </a>
            <a href={siteConfig.social.tiktok} aria-label="TikTok" className="hover:text-ink">
              <Editable eid="footer.social.tt" fallback="TT" />
            </a>
            <a href={siteConfig.social.pinterest} aria-label="Pinterest" className="hover:text-ink">
              <Editable eid="footer.social.pin" fallback="PIN" />
            </a>
          </div>
        </div>

        {columns.map((col, ci) => (
          <div key={col.title}>
            <div className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-ink">
              <Editable eid={`footer.col.${ci}.title`} fallback={col.title} />
            </div>
            <ul className="space-y-2 text-sm text-muted">
              {col.links.map((l, li) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-ink">
                    <Editable eid={`footer.col.${ci}.${li}`} fallback={l.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-[12.5px] text-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()}{" "}
            <Editable eid="brand.name" fallback={siteConfig.brandName} />. All rights reserved.
          </span>
          <div className="flex gap-5">
            {legal.map((l, i) => (
              <Link key={l.label} href={l.href} className="hover:text-ink">
                <Editable eid={`footer.legal.${i}`} fallback={l.label} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
