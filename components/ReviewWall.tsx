import type { Review } from "@/lib/types";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";
import { Stars } from "@/components/Stars";

export function ReviewWall({
  reviews,
  showDemoNote = true,
}: {
  reviews: Review[];
  showDemoNote?: boolean;
}) {
  return (
    <div>
      {showDemoNote && (
        <p className="mb-6 inline-block rounded-full bg-warm-soft px-3 py-1 text-[12px] font-medium text-warm-dark">
          <Editable
            eid="review.demoNote"
            fallback="Demo reviews — sample content, not real customer testimonials"
          />
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.id} className="card flex flex-col p-6">
            <div className="flex items-center gap-2">
              <Stars rating={r.rating} size={15} />
              <span className="text-[12px] font-medium text-warm-dark">
                <Editable eid="review.verified" fallback="Verified Buyer" />
              </span>
            </div>
            <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-charcoal">
              “<Editable eid={`review.${r.id}.text`} fallback={r.text} />”
            </blockquote>
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
              <ImageSlot
                eid={`review.${r.id}.avatar`}
                ratio="1/1"
                tint={r.tint}
                fallbackLabel={r.author}
                rounded
                className="h-11 w-11 shrink-0"
              />
              <div>
                <div className="text-[14px] font-semibold text-ink">
                  <Editable eid={`review.${r.id}.author`} fallback={r.author} />
                </div>
                <div className="text-[12px] text-muted">
                  <Editable eid={`review.${r.id}.meta`} fallback={`${r.pet} · ${r.location}`} />
                </div>
              </div>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
