"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <div className="xl:hidden">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobil-menu"
        className="rounded-full border-2 border-line px-4 py-2 text-sm font-bold">{open ? "Kapat" : "Menü"}</button>
      {open && (
        <nav id="mobil-menu" className="absolute inset-x-0 top-[72px] border-b border-line bg-bg px-5 pb-6 pt-2 shadow-xl">
          {items.map((n) => (
            <Link key={n.href} href={n.href} className="block border-b border-line py-3.5 font-display text-xl font-bold">{n.label}</Link>
          ))}
          <Link href="/giris" className="block py-3.5 font-semibold text-muted">Giriş yap</Link>
        </nav>
      )}
    </div>
  );
}
