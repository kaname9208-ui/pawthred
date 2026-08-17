import Image from "next/image";
import { Editable } from "@/components/editable/Editable";

const steps = [
  {
    step: "第一步",
    title: "上传您的照片",
    text: "选择你最喜欢的宠物照片。清晰、光线充足的镜头效果最佳——我们几乎接受所有镜头。",
    img: "/how-it-works/step1-upload-photo.png",
    imgAlt: "Customer uploads their pet photo",
    imgLeft: false,
  },
  {
    step: "第二步",
    title: "我们为您设计",
    text: "我们的艺术家会将您的照片改编成定制刺绣设计，与您的服装和颜色相匹配。",
    img: "/how-it-works/step2-design.png",
    imgAlt: "Digital embroidery design of pet portrait",
    imgLeft: true,
  },
  {
    step: "第三步",
    title: "你批准了",
    text: "在生产前检查你的设计。变动很容易——我们希望它恰到好处。",
    img: "/how-it-works/step3-approve.png",
    imgAlt: "Close-up of embroidered pet patch",
    imgLeft: true,
  },
  {
    step: "第四步",
    title: "穿上你的故事",
    text: "您的定制作品会被刺绣并寄送到家门口，准备成为日常生活的一部分。",
    img: "/how-it-works/step4-wear.png",
    imgAlt: "Person wearing apparel with embroidered pet",
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
              <div className="relative aspect-square w-full shrink-0 sm:w-1/2">
                <Image
                  src={s.img}
                  alt={s.imgAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center p-6 sm:p-8 sm:w-1/2">
                <span className="mb-1 text-xs font-semibold uppercase tracking-wider text-warm-dark">
                  {s.step}
                </span>
                <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                  <Editable eid={`hiw.${s.step}.title`} fallback={s.title} />
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  <Editable eid={`hiw.${s.step}.text`} fallback={s.text} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
