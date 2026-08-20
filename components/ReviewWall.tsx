import type { Review } from "@/lib/types";
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
      <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
        {reviews.map((r) => (
          <figure key={r.id} className="card flex min-w-0 flex-col p-2 sm:p-4 lg:p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
              <Stars rating={r.rating} size={12} />
              <span className="text-[9.5px] font-medium leading-tight text-warm-dark sm:text-[12px]">
                <Editable eid="review.verified" fallback="Verified Buyer" />
              </span>
            </div>
            <blockquote className="mt-2 line-clamp-4 flex-1 overflow-hidden text-[11px] leading-snug text-charcoal sm:mt-3 sm:text-[13px] sm:leading-relaxed lg:mt-4 lg:text-[14.5px]">
              “<Editable eid={`review.${r.id}.text`} fallback={r.text} />”
            </blockquote>
            <div className="mt-3 min-w-0 border-t border-line pt-2 sm:mt-4 sm:pt-3 lg:mt-5 lg:pt-4">
              <div className="min-w-0">
                <div className="truncate text-[11px] font-semibold leading-tight text-ink sm:text-[13px] lg:text-[14px]">
                  <Editable eid={`review.${r.id}.author`} fallback={r.author} />
                </div>
                <div className="mt-0.5 line-clamp-2 overflow-hidden text-[9.5px] leading-tight text-muted sm:text-[11px] lg:text-[12px]">
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
