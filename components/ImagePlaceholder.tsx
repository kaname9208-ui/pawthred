import { cn } from "@/lib/format";

interface Props {
  /** 比例，如 "4/5" 或 "1/1" */
  ratio?: string;
  /** 占位主色 */
  tint?: string;
  label?: string;
  className?: string;
  rounded?: boolean;
}

// 统一的占位图系统：无真实图片时也能保持版式稳定，比例统一不跳动。
// 未来替换为真实产品图时，只需把本组件换成 <img>/<Image> 即可。
export function ImagePlaceholder({
  ratio = "4/5",
  tint = "#EDE6DA",
  label,
  className,
  rounded = true,
}: Props) {
  const [w, h] = ratio.split("/").map(Number);
  const pad = h && w ? (h / w) * 100 : 100;
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        rounded && "rounded-xl2",
        className
      )}
      style={{ backgroundColor: tint, paddingTop: `${pad}%` }}
      aria-label={label ? `Placeholder image: ${label}` : "Placeholder image"}
      role="img"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="opacity-40">
          <path
            d="M3 16l5-5 4 4 3-3 6 6M3 5h18v14H3z"
            stroke="#1A1A1A"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="8.5" cy="9" r="1.6" fill="#1A1A1A" />
        </svg>
        {label ? (
          <span className="px-3 text-[11px] font-medium uppercase tracking-wider text-ink/45">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
