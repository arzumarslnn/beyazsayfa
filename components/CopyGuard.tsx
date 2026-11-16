"use client";
import { useEffect, useState } from "react";

/** Kopyalama, sağ tık, sürükleme ve kayıt kısayollarını engeller (form alanları hariç). */
export default function CopyGuard() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const say = (m: string) => { setMsg(m); clearTimeout(t); t = setTimeout(() => setMsg(""), 2200); };
    const inField = (e: Event) => !!(e.target as HTMLElement | null)?.closest?.("input,textarea,select,[contenteditable='true']");
    const block = (m: string) => (e: Event) => { if (!inField(e)) { e.preventDefault(); say(m); } };
    const onCopy = block("Sitedeki içerikler korumalıdır.");
    const onMenu = block("Sağ tık bu sitede kapalıdır.");
    const onDrag = (e: Event) => { if (!inField(e)) e.preventDefault(); };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["c", "x", "s", "u", "p", "a"].includes(k) && !inField(e)) { e.preventDefault(); say("Sitedeki içerikler korumalıdır."); }
    };
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);
    document.addEventListener("contextmenu", onMenu);
    document.addEventListener("dragstart", onDrag);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      document.removeEventListener("contextmenu", onMenu);
      document.removeEventListener("dragstart", onDrag);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <div role="status" aria-live="polite" className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-bg shadow-lg transition ${msg ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      {msg}
    </div>
  );
}
