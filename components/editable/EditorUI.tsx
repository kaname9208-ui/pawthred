"use client";

import { useEffect, useState } from "react";
import { useEdit } from "@/components/editable/EditProvider";

// 浮动编辑入口 + 底部编辑抽屉。文字字段在此编辑；图片字段直接在图上点选上传。
export function EditorUI() {
  const { editing, toggle, reset, exportJson, hasEdits, getText, setText, active, setActive } = useEdit();
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (active?.type === "text") {
      // 取当前值作为草稿（fallback 通过 Editable 已写入 override 或默认值，这里从 DOM 重新读取麻烦，改用存储）
      setDraft(getText(active.eid, ""));
    }
  }, [active, getText]);

  if (!editing) {
    return (
      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-[60] rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream shadow-lg hover:bg-charcoal"
      >
        ✏ Edit Site
      </button>
    );
  }

  return (
    <>
      {/* 顶部提示条 */}
      <div className="fixed left-0 right-0 top-0 z-[60] bg-warm text-center text-[13px] font-medium text-white py-1.5">
        Edit mode on — click any text or image to change it
      </div>

      {/* 右下角控制 */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2">
        <button
          onClick={exportJson}
          disabled={!hasEdits}
          className="rounded-full bg-paper px-4 py-2 text-[13px] font-medium text-ink shadow border border-line disabled:opacity-40"
        >
          ⬇ Export JSON
        </button>
        <button
          onClick={reset}
          className="rounded-full bg-paper px-4 py-2 text-[13px] font-medium text-ink shadow border border-line"
        >
          ↺ Reset
        </button>
        <button
          onClick={toggle}
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream shadow-lg"
        >
          ✓ Done
        </button>
      </div>

      {/* 底部编辑抽屉（文字） */}
      {active?.type === "text" && (
        <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-paper px-4 py-4 shadow-[0_-6px_24px_rgba(0,0,0,0.08)]">
          <div className="mx-auto max-w-3xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[12px] font-medium uppercase tracking-wider text-warm-dark">
                Editing: {active.eid}
              </span>
              <button
                onClick={() => setActive(null)}
                className="text-[13px] text-muted hover:text-ink"
              >
                Close
              </button>
            </div>
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full rounded-xl2 border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-ink/40"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setActive(null)}
                className="rounded-full px-4 py-2 text-[13px] font-medium text-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (active) setText(active.eid, draft);
                  setActive(null);
                }}
                className="rounded-full bg-ink px-5 py-2 text-[13px] font-medium text-cream"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 图片字段提示 */}
      {active?.type === "image" && (
        <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-paper px-4 py-4 text-center text-[13px] text-muted shadow-[0_-6px_24px_rgba(0,0,0,0.08)]">
          Click the image slot on the page (it now shows “Click to add your image”) to upload your photo, then use Remove to revert.
          <button onClick={() => setActive(null)} className="ml-3 text-ink font-medium">
            Close
          </button>
        </div>
      )}
    </>
  );
}
