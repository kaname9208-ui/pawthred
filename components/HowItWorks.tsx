import { howItWorks } from "@/lib/data/content";
import { Editable } from "@/components/editable/Editable";

function StepIcon({ name }: { name: string }) {
  const c = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#1A1A1A",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "upload")
    return (
      <svg {...c}>
        <path d="M12 16V4m0 0L8 8m4-4l4 4" />
        <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </svg>
    );
  if (name === "brush")
    return (
      <svg {...c}>
        <path d="M4 20s1-4 4-4 3-5 6-8c1.5-1.5 4-2 4-2s-.5 2.5-2 4-8 4-8 6-4 4-4 4z" />
      </svg>
    );
  if (name === "check")
    return (
      <svg {...c}>
        <path d="M5 12l4 4 10-10" />
      </svg>
    );
  return (
    <svg {...c}>
      <path d="M8 3l-2 4 3 1 2-4zM16 8l-2 4 3 1 2-4zM12 14l-2 4 3 1 2-4z" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function HowItWorks() {
  return (
    <section className="container-page section">
      <div className="mb-12 text-center">
        <span className="eyebrow">
          <Editable eid="hiw.eyebrow" fallback="How It Works" />
        </span>
        <h2 className="h-display mt-3 text-3xl sm:text-4xl">
          <Editable eid="hiw.title" fallback="From photo to forever in 4 steps" />
        </h2>
      </div>

      <div className="mx-auto mb-12 grid max-w-3xl grid-cols-3 items-center gap-3 text-center text-[12px] font-medium uppercase tracking-wider text-muted">
        <div className="rounded-xl2 border border-line bg-paper py-6">
          <Editable eid="hiw.flow1" fallback="Pet Photo" />
        </div>
        <div className="text-warm-dark">→</div>
        <div className="rounded-xl2 border border-line bg-paper py-6">
          <Editable eid="hiw.flow2" fallback="Digital Embroidery" />
        </div>
        <div className="text-warm-dark">→</div>
        <div className="rounded-xl2 border border-line bg-paper py-6">
          <Editable eid="hiw.flow3" fallback="Your Apparel" />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {howItWorks.map((s, i) => (
          <div key={s.step} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream">
              <StepIcon name={s.icon} />
            </div>
            <div className="mb-1 text-xs font-semibold text-warm-dark">STEP {s.step}</div>
            <h3 className="font-display text-lg font-semibold text-ink">
              <Editable eid={`hiw.${i}.title`} fallback={s.title} />
            </h3>
            <p className="mt-2 text-sm text-muted">
              <Editable eid={`hiw.${i}.text`} fallback={s.text} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
