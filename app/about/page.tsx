import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";

export const metadata: Metadata = {
  title: "Our Story — Paw & Thread",
  description:
    "Paw & Thread was born from a simple idea: your pet is more than a pet. We turn their memory into something you can wear every day.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div>
      <section className="container-page pt-14 text-center">
        <span className="eyebrow">
          <Editable eid="about.eyebrow" fallback="Our Story" />
        </span>
        <h1 className="h-display mt-3 text-4xl sm:text-5xl">
          <Editable eid="about.title" fallback="Your pet is more than a pet." />
        </h1>
      </section>

      <section className="container-page section">
        <div className="mx-auto max-w-2xl space-y-6 text-[16.5px] leading-relaxed text-charcoal">
          <p>
            <Editable
              eid="about.p1"
              fallback="They're the one who greets you at the door, who steals the warm spot on the couch, who somehow becomes part of who you are. When you lose them — or just want to celebrate them — a photo on a phone isn't quite enough."
            />
          </p>
          <p>
            <Editable
              eid="about.p2"
              fallback="We started Paw & Thread to turn that memory into something you can wear. A pet photo, translated into careful embroidery and stitched onto a tee, crewneck or pair of socks you'll actually live in. Not a printed gag gift — a quiet, lasting keepsake."
            />
          </p>
          <p>
            <Editable
              eid="about.p3"
              fallback="Every piece is made to order by hand, matched to your garment and your pet's personality. It's slow on purpose. The result is something that feels less like a product and more like a part of your story."
            />
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
          <ImageSlot eid="about.made.img" ratio="4/5" tint="#E4DABF" fallbackLabel="Made By Hand" />
          <div>
            <h2 className="h-display text-3xl">
              <Editable eid="about.made.title" fallback="Made with care, not at scale" />
            </h2>
            <p className="mt-4 text-lg text-muted">
              <Editable
                eid="about.made.body"
                fallback="We keep production small and personal. Your photo is reviewed by a real person, your design is approved by you, and your piece is embroidered to last — wash after wash, year after year."
              />
            </p>
            <Link href="/how-it-works" className="btn-secondary mt-7">
              <Editable eid="about.made.cta" fallback="See How It Works" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
