import { valueProps } from "@/lib/data/content";
import { Editable } from "@/components/editable/Editable";

function MiniIcon({ name }: { name: string }) {
  const c = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#9A6F45",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "paw":
      return (
        <svg {...c}>
          <circle cx="6" cy="10" r="1.6" />
          <circle cx="10" cy="7" r="1.6" />
          <circle cx="14" cy="7" r="1.6" />
          <circle cx="18" cy="10" r="1.6" />
          <path d="M12 12c-2.5 0-4 2-4 4 0 1.5 1.5 2 4 2s4-.5 4-2c0-2-1.5-4-4-4z" />
        </svg>
      );
    case "thread":
      return (
        <svg {...c}>
          <path d="M5 4v8a3 3 0 0 0 3 3h8" />
          <path d="M19 20v-8a3 3 0 0 0-3-3H8" />
          <circle cx="12" cy="12" r="1.4" fill="#9A6F45" />
        </svg>
      );
    case "heart":
      return (
        <svg {...c}>
          <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z" />
        </svg>
      );
    default:
      return (
        <svg {...c}>
          <path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4z" />
        </svg>
      );
  }
}

export function ValueProps() {
  return (
    <section className="bg-paper">
      <div className="container-page section">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {valueProps.map((v, i) => (
            <div key={v.title} className="text-center sm:text-left">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-warm-soft">
                <MiniIcon name={v.icon} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink">
                <Editable eid={`value.${i}.title`} fallback={v.title} />
              </h3>
              <p className="mt-2 text-sm text-muted">
                <Editable eid={`value.${i}.text`} fallback={v.text} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
