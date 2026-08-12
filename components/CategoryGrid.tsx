import Link from "next/link";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";
import { categorySections } from "@/lib/data/content";

export function CategoryGrid() {
  return (
    <section className="container-page section">
      <div className="mb-10 text-center">
        <span className="eyebrow">
          <Editable eid="cat.eyebrow" fallback="Shop By Category" />
        </span>
        <h2 className="h-display mt-3 text-3xl sm:text-4xl">
          <Editable eid="cat.title" fallback="Find their perfect piece" />
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {categorySections.map((c, i) => (
          <Link key={c.slug} href={c.href} className="group block">
            <ImageSlot eid={`cat.${c.slug}.img`} ratio="4/5" tint={c.tint} fallbackLabel={c.title} className="transition-transform group-hover:-translate-y-1" />
            <div className="mt-4">
              <h3 className="font-display text-lg font-semibold text-ink">
                <Editable eid={`cat.${i}.title`} fallback={c.title} />
              </h3>
              <p className="text-sm text-muted">
                <Editable eid={`cat.${i}.blurb`} fallback={c.blurb} />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
