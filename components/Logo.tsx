import { SITE } from "@/lib/site";
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect x="5" y="3" width="22" height="28" rx="5" fill={light ? "rgb(var(--bg))" : "rgb(var(--bg))"} stroke="rgb(var(--ink))" strokeWidth="2.5" />
        <path d="M27 3v7a3 3 0 0 0 3 3h0" fill="none" stroke="rgb(var(--ink))" strokeWidth="2.5" />
        <circle cx="16" cy="17" r="4.5" fill="rgb(var(--accent))" />
      </svg>
      <span className={`font-display text-2xl font-extrabold tracking-tight ${light ? "text-bg" : "text-ink"}`}>{SITE.name.toLowerCase()}</span>
    </span>
  );
}
