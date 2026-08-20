import Link from "next/link";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";

export function GiftStory() {
  return (
    <section className="bg-paper">
      <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <ImageSlot
          eid="gift.img"
          ratio="4/5"
          tint="#E4DABF"
          fallbackLabel="A Gift They'll Never Forget"
          fallbackSrc="/hero/hero-main-hoodie.webp"
        />
        <div>
          <span className="eyebrow">
            <Editable eid="gift.eyebrow" fallback="For The Ones Who Matter" />
          </span>
          <h2 className="h-display mt-3 text-3xl sm:text-4xl">
            <Editable eid="gift.title" fallback="The gift people actually cry over" />
          </h2>
          <p className="mt-5 text-lg text-muted">
            <Editable
              eid="gift.p1"
              fallback="Birthdays. Christmas. Valentine's. Or just because. A custom embroidered piece of their pet is the kind of gift that stops the room — personal, lasting, and impossible to find in a store."
            />
          </p>
          <p className="mt-4 text-lg text-muted">
            <Editable
              eid="gift.p2"
              fallback="And for those we've lost, it's a quiet way to keep them close."
            />
          </p>
          <Link href="/products" className="btn-primary mt-8">
            <Editable eid="gift.cta" fallback="Shop Gift Ideas" />
          </Link>
        </div>
      </div>
    </section>
  );
}
