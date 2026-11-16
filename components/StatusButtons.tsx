"use client";
import { useTransition } from "react";
export default function StatusButtons({ options, current, onSet }: { options: string[]; current: string; onSet: (s: string) => Promise<void> }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button key={o} type="button" disabled={pending} onClick={() => start(() => onSet(o))}
          className={`chip ${current === o ? "bg-ink text-bg" : "bg-paper text-ink hover:bg-line"}`}>{o}</button>
      ))}
    </div>
  );
}
