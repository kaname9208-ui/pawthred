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

export function CrewneckSizeGuide() {
  return (
    <section className="mt-14 rounded-xl2 border border-line bg-paper p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-warm-dark">
            Crewneck Sweatshirt Size Guide
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            Find your relaxed embroidered crewneck fit
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Measurements are listed in centimeters and taken flat. For a classic
            oversized U.S. streetwear fit, choose your usual sweatshirt size. If
            you prefer a closer fit, size down.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-[13px] text-charcoal">
            <div className="rounded-lg bg-cream p-3">
              <div className="font-semibold text-ink">Best for gifting</div>
              <div className="mt-1 text-muted">Choose one size up for an easy cozy fit.</div>
            </div>
            <div className="rounded-lg bg-cream p-3">
              <div className="font-semibold text-ink">Custom embroidery</div>
              <div className="mt-1 text-muted">Chest placement is scaled to the garment size.</div>
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
