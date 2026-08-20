import { ugcPosts } from "@/lib/data/content";
import { ImageSlot } from "@/components/editable/ImageSlot";
import { Editable } from "@/components/editable/Editable";

export function UGCWall() {
  return (
    <section className="container-page section">
      <div className="mb-10 text-center">
        <span className="eyebrow">
          <Editable eid="ugc.eyebrow" fallback="Made for Pet People" />
        </span>
        <h2 className="h-display mt-3 text-3xl sm:text-4xl">
          <Editable eid="ugc.title" fallback="Worn, loved, tagged" />
        </h2>
        <p className="mt-3 text-muted">
          <Editable
            eid="ugc.subtitle"
            fallback="Real customers, real pets — shared from Instagram & TikTok."
          />
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-6">
        {ugcPosts.map((p, i) => (
          <div key={p.handle} className="space-y-2">
            <ImageSlot
              eid={`ugc.${i}.img`}
              ratio={p.ratio}
              tint={p.tint}
              fallbackLabel={p.handle}
              fallbackSrc={p.src}
            />
            <div className="text-center text-[12px] font-medium text-muted">
              <Editable eid={`ugc.${i}.handle`} fallback={p.handle} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
