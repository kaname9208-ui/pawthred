const rows = [
  ["S", "47", "66", "47", "23", "160-165 cm", "88-110 lb"],
  ["M", "49", "68", "49", "23", "165-170 cm", "110-143 lb"],
  ["L", "51", "70", "51", "24", "170-175 cm", "143-165 lb"],
  ["XL", "54", "72", "54", "24", "175-180 cm", "165-187 lb"],
  ["2XL", "57", "74", "57", "25", "180-185 cm", "187-209 lb"],
  ["3XL", "60", "76", "60", "25", "185-190 cm", "209-253 lb"],
  ["4XL", "62", "77", "62", "26", "185-190 cm", "253-276 lb"],
  ["5XL", "64", "78", "64", "26", "185-190 cm", "276-298 lb"],
];

const careItems = [
  ["Material", "100% cotton with custom pet embroidery."],
  ["Care", "Machine washable. Turn inside out before washing to protect the embroidery."],
  ["Fit", "Unisex fit. Choose your usual size for a classic fit, or size up for a looser oversized look."],
];

export function TShirtSizeGuide() {
  return (
    <section className="mt-14 rounded-xl2 border border-line bg-paper p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-warm-dark">
            T-Shirt Size Guide
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            Pick your everyday custom embroidered tee fit
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            This custom pet embroidered T-shirt is made from 100% cotton for a
            breathable everyday feel. Measurements are listed in centimeters and
            taken flat, so allow a 1-2 cm difference.
          </p>
          <div className="mt-5 space-y-3 text-[13px] text-charcoal">
            {careItems.map(([title, copy]) => (
              <div key={title} className="rounded-lg bg-cream p-3">
                <div className="font-semibold text-ink">{title}</div>
                <div className="mt-1 text-muted">{copy}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl2 border border-line bg-cream">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <thead className="bg-ink text-cream">
              <tr>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Chest</th>
                <th className="px-4 py-3 font-semibold">Length</th>
                <th className="px-4 py-3 font-semibold">Shoulder</th>
                <th className="px-4 py-3 font-semibold">Sleeve</th>
                <th className="px-4 py-3 font-semibold">Suggested Height</th>
                <th className="px-4 py-3 font-semibold">Suggested Weight</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  {row.map((cell, index) => (
                    <td key={index} className="px-4 py-3">
                      {index === 0 ? (
                        <span className="font-semibold text-ink">{cell}</span>
                      ) : index >= 5 ? (
                        cell
                      ) : (
                        `${cell} cm`
                      )}
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
