"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Overrides = {
  text: Record<string, string>;
  image: Record<string, string>; // eid -> blob URL
};

type Active = { type: "text" | "image"; eid: string } | null;

interface EditCtx {
  editing: boolean;
  authed: boolean;
  loading: boolean;
  showLogin: boolean;
  setShowLogin: (b: boolean) => void;
  toggle: () => void;
  login: (pw: string) => Promise<boolean>;
  logout: () => void;
  reset: () => void;
  exportJson: () => void;
  hasEdits: boolean;
  getText: (eid: string, fallback: string) => string;
  setText: (eid: string, value: string) => void;
  getImage: (eid: string) => string | null;
  setImage: (eid: string, url: string) => void;
  removeImage: (eid: string) => void;
  uploadImage: (file: File) => Promise<string>;
  publish: () => Promise<boolean>;
  active: Active;
  setActive: (a: Active) => void;
}

const Ctx = createContext<EditCtx | null>(null);

function sanitizeRecord(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  return Object.fromEntries(
    Object.entries(input as Record<string, unknown>).filter(
      ([, value]) => typeof value === "string"
    )
  ) as Record<string, string>;
}

function sanitizeOverrides(input: any): Overrides {
  return {
    text: sanitizeRecord(input?.text),
    image: sanitizeRecord(input?.image),
  };
}

export function EditProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({ text: {}, image: {} });
  const [editing, setEditing] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Active>(null);

  // 用 ref 持有最新值，避免在回调闭包里拿到旧 state
  const overridesRef = useRef(overrides);
  overridesRef.current = overrides;
  const authedRef = useRef(authed);
  authedRef.current = authed;

  // 初次加载：鉴权状态 + 已发布的云端编辑（所有访客可见）
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [authRes, editsRes] = await Promise.all([
          fetch("/api/admin/check"),
          fetch("/api/edits"),
        ]);
        const auth = await authRes.json().catch(() => ({ authed: false }));
        const edits = await editsRes.json().catch(() => ({ text: {}, image: {} }));
        if (cancelled) return;
        setAuthed(!!auth.authed);
        setOverrides(sanitizeOverrides(edits));
      } catch {
        /* 离线/失败时不阻塞页面 */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 发布当前编辑到云端（仅管理员）
  const publish = useCallback(async (): Promise<boolean> => {
    if (!authedRef.current) return false;
    try {
      const res = await fetch("/api/edits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(overridesRef.current),
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  // 上传图片到云端，返回公开 URL；失败时抛出可读错误。
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    if (!authedRef.current) throw new Error("Not logged in as admin.");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/edits/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      const url = data.url as string | undefined;
      if (!url) throw new Error("Server did not return an image URL.");
      return url;
    } catch (err: any) {
      console.error("Upload failed:", err);
      throw err;
    }
  }, []);

  const setText = useCallback((eid: string, value: string) => {
    setOverrides((o) => ({ ...o, text: { ...o.text, [eid]: value } }));
  }, []);

  const setImage = useCallback((eid: string, url: string) => {
    setOverrides((o) => ({ ...o, image: { ...o.image, [eid]: url } }));
  }, []);

  const removeImage = useCallback((eid: string) => {
    setOverrides((o) => {
      const img = { ...o.image };
      delete img[eid];
      return { ...o, image: img };
    });
  }, []);

  const login = useCallback(async (pw: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) return false;
      setAuthed(true);
      setShowLogin(false);
      setEditing(true);
      // 重新拉取最新已发布编辑（可能别的设备改过）
      const editsRes = await fetch("/api/edits");
      const edits = await editsRes.json().catch(() => ({ text: {}, image: {} }));
      setOverrides(sanitizeOverrides(edits));
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setAuthed(false);
    setEditing(false);
    setActive(null);
  }, []);

  // 进入/退出编辑。退出时自动发布。
  const toggle = useCallback(() => {
    if (editing) {
      setActive(null);
      setEditing(false);
      void publish();
      return;
    }
    if (authedRef.current) {
      setEditing(true);
    } else {
      setShowLogin(true);
    }
  }, [editing, publish]);

  const reset = useCallback(() => {
    if (!confirm("Reset all your edits to the original content?")) return;
    setOverrides({ text: {}, image: {} });
    setActive(null);
    void publish();
  }, [publish]);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(overridesRef.current, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paw-thread-edits.json";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const value = useMemo<EditCtx>(
    () => ({
      editing,
      authed,
      loading,
      showLogin,
      setShowLogin,
      toggle,
      login,
      logout,
      reset,
      exportJson,
      hasEdits:
        Object.keys(overrides.text).length + Object.keys(overrides.image).length > 0,
      getText: (eid, fallback) =>
        typeof overrides.text[eid] === "string" ? overrides.text[eid] : fallback,
      setText,
      getImage: (eid) =>
        typeof overrides.image[eid] === "string" ? overrides.image[eid] : null,
      setImage,
      removeImage,
      uploadImage,
      publish,
      active,
      setActive,
    }),
    [
      editing,
      authed,
      loading,
      showLogin,
      toggle,
      login,
      logout,
      reset,
      exportJson,
      setText,
      setImage,
      removeImage,
      uploadImage,
      publish,
      overrides,
      active,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEdit() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEdit must be used within EditProvider");
  return ctx;
}
