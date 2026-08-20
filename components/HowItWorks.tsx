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

        {/* 2×2 image+text grid — alternating layout like reference */}
        <div className="grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-2">
          {steps.map((s) => (
            <div
              key={s.step}
              className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md ${
                s.imgLeft ? "sm:flex-row" : "sm:flex-row-reverse"
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
              <div className="flex flex-col justify-center p-6 sm:p-8 sm:w-1/2">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-warm-dark">
                  {s.step}
                </span>
                <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                  <Editable eid={`hiw.${s.id}.title`} fallback={s.title} />
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
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
