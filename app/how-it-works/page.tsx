import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorks } from "@/components/HowItWorks";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";

export const metadata: Metadata = {
  title: "How It Works — Custom Pet Embroidery in 4 Steps",
  description:
    "Upload your pet photo, we create the design, you approve it, and we embroider and ship your custom apparel. Simple, personal, made to order.",
  alternates: { canonical: "/how-it-works" },
};

const photoTips = [
  "Use natural light — avoid heavy filters or flash.",
  "Get close and eye-level with your pet's face.",
  "Show ears, eyes and chest for the best crop.",
  "Avoid blurry or top-down photos.",
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="container-page pt-14 text-center">
        <span className="eyebrow">
          <Editable eid="hiw.page.eyebrow" fallback="How It Works" />
        </span>
        <h1 className="h-display mt-3 text-4xl sm:text-5xl">
          <Editable eid="hiw.page.title" fallback="Your story, stitched" />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          <Editable
            eid="hiw.page.subtitle"
            fallback="Four simple steps from a photo on your phone to a piece you'll wear for years."
          />
        </p>
      </section>

      <HowItWorks />

      {/* Photo guidance */}
      <section className="container-page section">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ImageSlot
            eid="hiw.photo.img"
            ratio="4/5"
            tint="#E9E2D6"
            fallbackLabel="A Great Pet Photo"
            fallbackSrc="/how-it-works/good-photo.webp"
          />
          <div>
            <span className="eyebrow">
              <Editable eid="hiw.photo.eyebrow" fallback="Photo Tips" />
            </span>
            <h2 className="h-display mt-3 text-3xl">
              <Editable eid="hiw.photo.title" fallback="What makes a good photo?" />
            </h2>
            <ul className="mt-5 space-y-3 text-[15px] text-muted">
              {photoTips.map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 text-warm-dark">✓</span>
                  <span>
                    <Editable eid={`hiw.tip.${i}`} fallback={t} />
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] text-muted">
              <Editable
                eid="hiw.photo.note"
                fallback="We accept almost all photos. If something won't work for embroidery, our team reaches out to help you choose a better one before we start."
              />
            </p>
            <Link href="/products" className="btn-primary mt-7">
              <Editable eid="hiw.photo.cta" fallback="Start Your Custom Piece" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
