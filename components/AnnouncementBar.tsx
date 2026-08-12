import { siteConfig } from "@/lib/config/site.config";
import { Editable } from "@/components/editable/Editable";

export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-[12.5px] font-medium tracking-wide text-cream">
      <Editable eid="announcement" fallback={siteConfig.announcement} />
    </div>
  );
}
