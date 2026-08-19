const rows = [
  ["XS", "48", "42", "62", "57"],
  ["S", "51", "44", "65", "58.5"],
  ["M", "54", "46", "68", "60"],
  ["L", "58", "49", "71", "61.5"],
  ["XL", "61", "52", "74", "63"],
  ["2XL", "63", "55", "76", "64.5"],
  ["3XL", "67", "58", "78", "66"],
  ["4XL", "69", "61", "80", "67.5"],
];

const copy = {
  crewneck: {
    eyebrow: "Crewneck Sweatshirt Size Guide",
    heading: "Find your relaxed embroidered crewneck fit",
    intro:
      "This custom pet embroidered crewneck is made with an 80% cotton blend for soft structure and everyday warmth. Measurements are listed in centimeters and taken flat, so allow a 1-2 cm difference.",
    material: "80% cotton blend with custom pet embroidery.",
    care: "Machine washable. Turn inside out before washing to help protect the embroidery and fabric surface.",
    fit: "Unisex relaxed fit. Choose your usual sweatshirt size, or size up for a cozier oversized look.",
  },
  hoodie: {
    eyebrow: "Hoodie Size Guide",
    heading: "Choose your cozy embroidered hoodie fit",
    intro:
      "This custom pet embroidered hoodie is made with an 80% cotton blend for a soft, cozy feel with enough structure for daily wear. Measurements are listed in centimeters and taken flat, so allow a 1-2 cm difference.",
    material: "80% cotton blend with custom pet embroidery and a pullover hoodie shape.",
    care: "Machine washable. Turn inside out before washing to protect the embroidered artwork.",
    fit: "Unisex fit. Choose your usual size for an easy hoodie fit, or size up if you like it roomy.",
  },
};

export function CrewneckSizeGuide({ variant = "crewneck" }: { variant?: "crewneck" | "hoodie" }) {
  const content = copy[variant];
  return (
    <section className="mt-14 rounded-xl2 border border-line bg-paper p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-warm-dark">
            {content.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            {content.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {content.intro}
          </p>
          <div className="mt-5 space-y-3 text-[13px] text-charcoal">
            <div className="rounded-lg bg-cream p-3">
              <div className="font-semibold text-ink">Material</div>
              <div className="mt-1 text-muted">{content.material}</div>
            </div>
            <div className="rounded-lg bg-cream p-3">
              <div className="font-semibold text-ink">Care</div>
              <div className="mt-1 text-muted">{content.care}</div>
            </div>
            <div className="rounded-lg bg-cream p-3">
              <div className="font-semibold text-ink">Fit</div>
              <div className="mt-1 text-muted">{content.fit}</div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl2 border border-line bg-cream">
          <table className="w-full min-w-[620px] border-collapse text-left text-[13px]">
            <thead className="bg-ink text-cream">
              <tr>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Bust</th>
                <th className="px-4 py-3 font-semibold">Shoulder</th>
                <th className="px-4 py-3 font-semibold">Length</th>
                <th className="px-4 py-3 font-semibold">Sleeve</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  {row.map((cell, index) => (
                    <td key={index} className="px-4 py-3">
                      {index === 0 ? <span className="font-semibold text-ink">{cell}</span> : `${cell} cm`}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
