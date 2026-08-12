import { Editable } from "@/components/editable/Editable";

interface Props {
  previewUrl?: string | null;
  color?: string;
  petName?: string;
  placement?: string;
  category?: string;
}

// 各放置位置在画布(400x500 = 4:5)中的百分比坐标，以及刺绣贴片大小。
const TOP_POS: Record<string, { x: number; y: number; size: number }> = {
  "left-chest": { x: 38, y: 33, size: 27 },
  center: { x: 50, y: 47, size: 27 },
  sleeve: { x: 17, y: 33, size: 21 },
};

const SOCK_POS: Record<string, { x: number; y: number; size: number }> = {
  "left-chest": { x: 50, y: 54, size: 24 },
  center: { x: 50, y: 40, size: 24 },
  sleeve: { x: 50, y: 70, size: 24 },
};

function posFor(category: string | undefined, placement?: string) {
  const table = category === "socks" ? SOCK_POS : TOP_POS;
  return table[placement || "center"] || table.center;
}

// 成衣模拟预览：按所选颜色画出衣服版型，并把宠物照按"刺绣放置位置"摆到对应坐标。
// 明确标注为 mock-up（非最终成品），不伪装成 AI 生成的刺绣结果。
export function PreviewPlaceholder({
  previewUrl,
  color = "#F3ECE0",
  petName,
  placement,
  category,
}: Props) {
  const pos = posFor(category, placement);
  const isSock = category === "socks";

  return (
    <div className="relative w-full overflow-hidden rounded-xl2 border border-line bg-paper">
      <div className="relative aspect-[4/5] w-full">
        {/* 衣服版型 */}
        <svg
          viewBox="0 0 400 500"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {isSock ? <SockPath color={color} /> : <TeePath color={color} />}
        </svg>

        {/* 刺绣贴片（按 placement 定位） */}
        <div
          className="absolute"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${pos.size}%`,
            transform: "translate(-50%, -50%)",
            aspectRatio: "1 / 1",
          }}
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-white/85 bg-white/35 shadow-md">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Pet embroidery preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-2 text-center text-[10px] font-medium text-white/85">
                <Editable eid="preview.placeholder" fallback="Your pet" />
              </span>
            )}
          </div>
        </div>

        {/* 宠物名字 */}
        {petName ? (
          <div
            className="absolute"
            style={{
              left: `${pos.x}%`,
              top: `calc(${pos.y}% + ${(pos.size / 2) + 3}%)`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-ink shadow">
              {petName}
            </span>
          </div>
        ) : null}

        {/* 诚实标注 */}
        <div className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10.5px] font-medium text-cream">
          <Editable eid="preview.badge" fallback="Preview mock-up · not final product" />
        </div>
      </div>
    </div>
  );
}

function TeePath({ color }: { color: string }) {
  return (
    <>
      <path
        d="M165,72 C182,92 218,92 235,72 L305,96 L366,142 L340,206 L292,176 L292,462 L108,462 L108,176 L60,206 L34,142 L95,96 Z"
        fill={color}
        stroke="#00000022"
        strokeWidth="2"
      />
      {/* 领口细节 */}
      <path
        d="M165,72 C182,92 218,92 235,72"
        fill="none"
        stroke="#00000022"
        strokeWidth="3"
      />
    </>
  );
}

function SockPath({ color }: { color: string }) {
  return (
    <path
      d="M160,70 L240,70 L240,300 C240,340 250,380 300,410 L300,470 L160,470 L160,410 C160,380 150,350 150,320 L150,300 Z"
      fill={color}
      stroke="#00000022"
      strokeWidth="2"
    />
  );
}
