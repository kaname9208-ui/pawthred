"use client";

import { useEffect, useState } from "react";
import { useEdit } from "@/components/editable/EditProvider";

// 浮动编辑入口 + 登录框 + 底部编辑抽屉。
// 文字字段在此编辑；图片字段直接在图上点选上传（已接云端）。
export function EditorUI() {
  const {
    editing,
    authed,
    showLogin,
    setShowLogin,
    toggle,
    login,
    logout,
    reset,
    exportJson,
    hasEdits,
    getText,
    setText,
    publish,
    active,
    setActive,
  } = useEdit();

  const [draft, setDraft] = useState("");
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (active?.type === "text") {
      setDraft(getText(active.eid, ""));
    }
  }, [active, getText]);

  async function handleLogin() {
    setBusy(true);
    setPwError(false);
    const ok = await login(pw);
    setBusy(false);
    if (ok) {
      setPw("");
    } else {
      setPwError(true);
    }
  }

  async function handleDone() {
    setBusy(true);
    await publish();
    setBusy(false);
    setActive(null);
  }

  // 未登录 → 显示登录框
  if (showLogin) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-paper px-4 py-4 shadow-[0_-6px_24px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setPwError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin password"
            className="flex-1 rounded-xl2 border border-line bg-cream px-4 py-2.5 text-sm outline-none focus:border-ink/40"
          />
          <button
            onClick={handleLogin}
            disabled={busy || !pw}
            className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-white disabled:opacity-40"
          >
            {busy ? "…" : "Login"}
          </button>
          <button onClick={() => setShowLogin(false)} className="px-3 text-[13px] text-muted">
            Cancel
          </button>
        </div>
        {pwError && (
          <p className="mx-auto mt-1 max-w-md text-center text-[12px] text-red-600">
            Wrong password.
          </p>
        )}
      </div>
    );
  }

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
      <div className="fixed left-0 right-0 top-0 z-[60] bg-warm py-1.5 text-center text-[13px] font-medium text-white">
        Edit mode on — click any text or image to change it (saved to the live site)
      </div>

      {/* 右下角控制 */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-2">
        <button
          onClick={exportJson}
          disabled={!hasEdits}
          className="rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-medium text-ink shadow disabled:opacity-40"
        >
          ⬇ Export JSON
        </button>
        <button
          onClick={reset}
          className="rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-medium text-ink shadow"
        >
          ↺ Reset
        </button>
        <button
          onClick={handleDone}
          disabled={busy}
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream shadow-lg disabled:opacity-50"
        >
          ✓ Publish &amp; Done
        </button>
        {authed && (
          <button
            onClick={logout}
            className="text-[12px] text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Log out
          </button>
        )}
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
          Click the image slot on the page (it now shows “Click to add your image”) to upload your photo — it saves to the live site for everyone.
          <button onClick={() => setActive(null)} className="ml-3 font-medium text-ink">
            Close
          </button>
        </div>
      )}
    </>
  );
}
