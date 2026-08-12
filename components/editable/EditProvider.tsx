"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "paw-thread-edits-v1";

type Overrides = {
  text: Record<string, string>;
  image: Record<string, string>; // eid -> dataURL
};

type Active = { type: "text" | "image"; eid: string } | null;

interface EditCtx {
  editing: boolean;
  toggle: () => void;
  reset: () => void;
  exportJson: () => void;
  hasEdits: boolean;
  getText: (eid: string, fallback: string) => string;
  setText: (eid: string, value: string) => void;
  getImage: (eid: string) => string | null;
  setImage: (eid: string, dataUrl: string) => void;
  removeImage: (eid: string) => void;
  active: Active;
  setActive: (a: Active) => void;
}

const Ctx = createContext<EditCtx | null>(null);

export function EditProvider({ children }: { children: React.ReactNode }) {
  const [editing, setEditing] = useState(false);
  const [overrides, setOverrides] = useState<Overrides>({ text: {}, image: {} });
  const [active, setActive] = useState<Active>(null);
  const [loaded, setLoaded] = useState(false);

  // 初次从 localStorage 载入（仅客户端）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOverrides(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // 变更后写回 localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      /* quota — 忽略 */
    }
  }, [overrides, loaded]);

  const toggle = useCallback(() => {
    setEditing((v) => {
      if (v) setActive(null);
      return !v;
    });
  }, []);

  const setText = useCallback((eid: string, value: string) => {
    setOverrides((o) => ({ ...o, text: { ...o.text, [eid]: value } }));
  }, []);

  const setImage = useCallback((eid: string, dataUrl: string) => {
    setOverrides((o) => ({ ...o, image: { ...o.image, [eid]: dataUrl } }));
  }, []);

  const removeImage = useCallback((eid: string) => {
    setOverrides((o) => {
      const img = { ...o.image };
      delete img[eid];
      return { ...o, image: img };
    });
  }, []);

  const reset = useCallback(() => {
    if (!confirm("Reset all your edits to the original content?")) return;
    setOverrides({ text: {}, image: {} });
    setActive(null);
  }, []);

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(overrides, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paw-thread-edits.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [overrides]);

  const value = useMemo<EditCtx>(
    () => ({
      editing,
      toggle,
      reset,
      exportJson,
      hasEdits: Object.keys(overrides.text).length + Object.keys(overrides.image).length > 0,
      getText: (eid, fallback) => overrides.text[eid] ?? fallback,
      setText,
      getImage: (eid) => overrides.image[eid] ?? null,
      setImage,
      removeImage,
      active,
      setActive,
    }),
    [editing, overrides, active, toggle, reset, exportJson, setText, setImage, removeImage]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEdit() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEdit must be used within EditProvider");
  return ctx;
}
