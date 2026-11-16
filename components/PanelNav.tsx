"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PanelNav({ items }: { items: { href: string; label: string; badge?: number }[] }) {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible" aria-label="Panel menüsü">
      {items.map((n) => {
        const on = n.href === "/panel" ? path === "/panel" : path.startsWith(n.href);
        return (
          <Link key={n.href} href={n.href} className={`flex shrink-0 items-center justify-between gap-2 rounded-2xl px-4 py-2.5 font-semibold ${on ? "bg-ink text-bg" : "hover:bg-paper"}`}>
            {n.label}
            {!!n.badge && <span className="chip bg-accent text-white">{n.badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
