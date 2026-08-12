import { trustBadges } from "@/lib/data/content";
import { Editable } from "@/components/editable/Editable";

function TrustIcon({ name }: { name: string }) {
  const c = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#9A6F45",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "shield")
    return (
      <svg {...c}>
        <path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  if (name === "lock")
    return (
      <svg {...c}>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  if (name === "truck")
    return (
      <svg {...c}>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    );
  return (
    <svg {...c}>
      <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
    </svg>
  );
}

export function TrustBadges() {
  return (
    <section className="bg-paper">
      <div className="container-page grid grid-cols-2 gap-6 py-12 sm:grid-cols-4">
        {trustBadges.map((t, i) => (
          <div
            key={t.title}
            className="flex flex-col items-center text-center sm:items-start sm:text-left"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-warm-soft">
              <TrustIcon name={t.icon} />
            </div>
            <div className="font-semibold text-ink">
              <Editable eid={`trust.${i}.title`} fallback={t.title} />
            </div>
            <div className="mt-1 text-[13px] text-muted">
              <Editable eid={`trust.${i}.text`} fallback={t.text} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
