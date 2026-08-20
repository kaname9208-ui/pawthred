"use client";

import { Editable } from "@/components/editable/Editable";
import { ImageSlot } from "@/components/editable/ImageSlot";

const steps = [
  {
    id: "step1",
    step: "Step One",
    title: "Upload your photo",
    text: "Choose your favorite pet photo. Clear, well-lit photos work best, and we can work with almost any angle.",
    imgLeft: false,
  },
  {
    id: "step2",
    step: "Step Two",
    title: "We create your design",
    text: "Our artist turns your photo into a custom embroidery design made to match your chosen item and color.",
    imgLeft: true,
  },
  {
    id: "step3",
    step: "Step Three",
    title: "You approve it",
    text: "Review your design before production. Small changes are easy, because we want it to feel just right.",
    imgLeft: true,
  },
  {
    id: "step4",
    step: "Step Four",
    title: "Wear your story",
    text: "Your custom piece is embroidered and shipped to your door, ready to become part of everyday life.",
    imgLeft: false,
  },
];

export function HowItWorks() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-12 text-center">
          <span className="eyebrow">
            <Editable eid="hiw.eyebrow" fallback="How It Works" />
          </span>
          <h2 className="h-display mt-3 text-3xl sm:text-4xl">
            <Editable eid="hiw.title" fallback="From photo to forever in 4 steps" />
          </h2>
        </div>

        {/* 2x2 image+text grid, kept compact on phones too. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-8 lg:gap-10">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`group flex min-w-0 overflow-hidden rounded-xl2 border border-line bg-white shadow-sm transition-shadow hover:shadow-md ${
                s.imgLeft ? "flex-col sm:flex-row" : "flex-col sm:flex-row-reverse"
              }`}
            >
              {/* Image */}
              <div className="relative w-full shrink-0 sm:w-1/2">
                <ImageSlot
                  eid={`hiw.${s.id}.img`}
                  ratio="1/1"
                  tint="#F3ECE0"
                  fallbackLabel={s.title}
                />
              </div>

              {/* Text */}
              <div className="flex min-w-0 flex-col justify-center p-3 sm:w-1/2 sm:p-8">
                <span className="mb-1 text-[10px] font-semibold uppercase text-warm-dark sm:text-xs">
                  {s.step}
                </span>
                <h3 className="font-display text-base font-bold leading-tight text-ink sm:text-2xl">
                  <Editable eid={`hiw.${s.id}.title`} fallback={s.title} />
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted sm:mt-3 sm:text-base">
                  <Editable eid={`hiw.${s.id}.text`} fallback={s.text} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
