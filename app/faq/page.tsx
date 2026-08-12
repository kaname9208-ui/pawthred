import type { Metadata } from "next";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Editable } from "@/components/editable/Editable";
import { faqs } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "FAQ — Custom Pet Embroidery Questions",
  description:
    "Answers about photo requirements, multiple pets, preview, production and shipping times, changes, and our return policy.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="container-page section">
      <div className="mb-10 text-center">
        <span className="eyebrow">
          <Editable eid="faqpage.eyebrow" fallback="FAQ" />
        </span>
        <h1 className="h-display mt-3 text-4xl sm:text-5xl">
          <Editable eid="faqpage.title" fallback="Questions, answered" />
        </h1>
      </div>
      <div className="mx-auto max-w-3xl">
        <FAQAccordion items={faqs} />
      </div>
    </div>
  );
}
