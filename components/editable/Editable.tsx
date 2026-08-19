"use client";

import { useEdit } from "@/components/editable/EditProvider";
import { cn } from "@/lib/format";

interface Props {
  eid: string;
  fallback: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

// 可点击编辑的文字块。编辑模式下点击即选中该字段，由 EditorUI 抽屉编辑。
export function Editable({ eid, fallback, as = "span", className }: Props) {
  const { editing, getText, active, setActive } = useEdit();
  const value = getText(eid, fallback);
  const text = typeof value === "string" ? value : fallback;
  const isActive = editing && active?.type === "text" && active.eid === eid;

  const Tag = as as any;

  return (
    <Tag
      className={cn(
        className,
        editing && "cursor-pointer transition-shadow",
        editing && !isActive && "hover:outline hover:outline-2 hover:outline-dashed hover:outline-warm/60",
        isActive && "outline outline-2 outline-dashed outline-warm rounded-sm"
      )}
      onClick={
        editing
          ? (e: React.MouseEvent) => {
              e.stopPropagation();
              setActive({ type: "text", eid });
            }
          : undefined
      }
      data-editable={eid}
    >
      {text}
    </Tag>
  );
}
