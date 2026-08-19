import Image from "next/image";
import Link from "next/link";
import { Editable } from "@/components/editable/Editable";

export function Hero() {
  return (
    <section className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-14">
      <div className="animate-fadeup">
        <span className="eyebrow">
          <Editable eid="hero.eyebrow" fallback="Custom Pet Embroidery" />
        </span>
        <h1 className="h-display mt-4 text-4xl sm:text-5xl lg:text-6xl">
          <Editable eid="hero.title" fallback="Your Pet. Your Story. Embroidered." />
        </h1>
        <p className="mt-5 max-w-md text-lg text-muted">
          <Editable
            eid="hero.subtitle"
            fallback="Turn your favorite pet photo into a timeless piece you'll love to wear."
          />
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="btn-primary">
            <Editable eid="hero.cta1" fallback="Create Yours" />
          </Link>
          <Link href="/how-it-works" className="btn-secondary">
            <Editable eid="hero.cta2" fallback="See How It Works" />
          </Link>
        </div>
        <p className="mt-5 text-[13px] text-muted">
          <Editable eid="hero.note" fallback="Free Shipping on Orders $100+ · Made to order in the USA" />
        </p>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-xl2">
        <Image
          src="/hero/hero-main-hoodie.png"
          alt="Custom embroidered pet hoodie with two dogs"
          fill
          sizes="(max-width: 1024px) 100vw, 48vw"
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
