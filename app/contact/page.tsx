import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/config/site.config";
import { Editable } from "@/components/editable/Editable";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about your custom pet embroidery order? Reach the Paw & Thread team — we're happy to help.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-page section">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <span className="eyebrow">
            <Editable eid="contact.eyebrow" fallback="Contact" />
          </span>
          <h1 className="h-display mt-3 text-4xl sm:text-5xl">
            <Editable eid="contact.title" fallback="We're here to help" />
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            <Editable
              eid="contact.intro"
              fallback="Order questions, photo help, or just want to say hi — send us a note and we'll get back to you quickly."
            />
          </p>
          <div className="mt-8 space-y-4 text-[15px] text-charcoal">
            <div>
              <div className="font-semibold text-ink">
                <Editable eid="contact.emailLabel" fallback="Email" />
              </div>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-warm-dark hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
            </div>
            <div>
              <div className="font-semibold text-ink">
                <Editable eid="contact.hoursLabel" fallback="Support hours" />
              </div>
              <div className="text-muted">
                <Editable eid="contact.hoursValue" fallback="Mon–Fri, 9am–6pm ET" />
              </div>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
