import { Editable } from "@/components/editable/Editable";

interface Props {
  previewUrl?: string | null;
  color?: string;
  petName?: string;
  placement?: string;
}

// 诚实的"示例版式"预览：展示用户照片在成衣上的构图示意，
// 明确标注"非最终成品"，不伪装成 AI 生成的刺绣结果。
export function PreviewPlaceholder({ previewUrl, color = "#F3ECE0", petName, placement }: Props) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl2 border border-line">
      <div style={{ backgroundColor: color }} className="relative aspect-[4/5] w-full">
        {/* 成衣示意：居中圆形"刺绣区" */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-white/70 bg-white/30">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Your pet in the embroidery area"
                className="h-36 w-36 rounded-full object-cover"
              />
            ) : (
              <span className="px-4 text-center text-[12px] font-medium text-white/80">
                <Editable eid="preview.placeholder" fallback="Your pet photo appears here" />
              </span>
            )}
          </div>
          {petName ? (
            <span className="font-display text-lg font-semibold text-white drop-shadow">
              {petName}
            </span>
          ) : null}
          {placement ? (
            <span className="text-[11px] uppercase tracking-wider text-white/70">
              {placement.replace("-", " ")}
            </span>
          ) : null}
        </div>

        {/* 诚实标注 */}
        <div className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10.5px] font-medium text-cream">
          <Editable eid="preview.badge" fallback="Sample layout · not final product" />
        </div>
      </div>
    </div>
  );
}
