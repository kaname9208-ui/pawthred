import type { Metadata } from "next";
import { ReviewWall } from "@/components/ReviewWall";
import { Editable } from "@/components/editable/Editable";
import { reviews } from "@/lib/data/content";
import { Stars } from "@/components/Stars";

export const metadata: Metadata = {
  title: "Customer Reviews — Paw & Thread",
  description:
    "Read what pet parents say about their custom embroidered apparel — embroidery quality, likeness, gifts and memorial pieces.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const total = reviews.reduce((s, r) => s + r.rating * 0 + 1, 0);
  return (
    <div className="container-page section">
      <div className="mb-10 text-center">
        <span className="eyebrow">
          <Editable eid="reviewspage.eyebrow" fallback="Reviews" />
        </span>
        <h1 className="h-display mt-3 text-4xl sm:text-5xl">
          <Editable eid="reviewspage.title" fallback="Loved by pet people" />
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2 text-muted">
          <Stars rating={Number(avg)} size={20} />
          <span className="text-[15px]">
            {avg} / 5 · based on {total.toLocaleString()} sample reviews
          </span>
        </div>
      </div>
      <ReviewWall reviews={reviews} />
    </div>
  );
}
