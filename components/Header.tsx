import Link from "next/link";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { getMe } from "@/lib/supabase/server";

export const NAV = [
  { href: "/ogrenci-koclugu", label: "Öğrenci Koçluğu" },
  { href: "/ebeveyn-egitimi", label: "Davranış Eğitimi" },
  { href: "/davranis-programi", label: "Davranış Programı" },
  { href: "/testler", label: "Testler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

export default async function Header() {
  const me = await getMe().catch(() => null);
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
      <div className="wrap flex h-[72px] items-center gap-6">
        <Link href="/" aria-label="Ana sayfa"><Logo /></Link>
        <nav className="ml-auto hidden items-center gap-0.5 xl:flex" aria-label="Ana menü">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-semibold hover:bg-paper">{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 xl:ml-2">
          {me ? (
            <Link href="/panel" className="btn-primary btn-sm">Panelim</Link>
          ) : (
            <>
              <Link href="/giris" className="hidden rounded-full px-3 py-2 text-[15px] font-semibold hover:bg-paper sm:block">Giriş</Link>
              <Link href="/kayit" className="btn-primary btn-sm">Üye ol</Link>
            </>
          )}
          <MobileMenu items={NAV} />
        </div>
      </div>
    </header>
  );
}
