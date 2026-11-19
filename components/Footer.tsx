import Link from "next/link";
import Logo from "./Logo";
import { SITE } from "@/lib/site";

export default function Footer() {
  const col = "flex flex-col gap-2 text-[15px]";
  return (
    <footer className="mt-24 bg-ink text-bg">
      <div className="wrap grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo light />
          <p className="max-w-sm text-bg/70">{SITE.slogan} Öğrencilere koçluk yapıyor, ebeveynlere çocuklarının davranışlarını kendi başlarına değiştirmeyi öğretiyoruz.</p>
        </div>
        <div className={col}>
          <b className="mb-1 font-display text-lg">Programlar</b>
          <Link href="/ogrenci-koclugu" className="text-bg/70 hover:text-bg">Öğrenci koçluğu</Link>
          <Link href="/ebeveyn-egitimi" className="text-bg/70 hover:text-bg">Ebeveyn davranış eğitimi</Link>
          <Link href="/davranis-programi" className="text-bg/70 hover:text-bg">Davranış programı</Link>
          <Link href="/testler" className="text-bg/70 hover:text-bg">Mizaç ve öğrenme testleri</Link>
        </div>
        <div className={col}>
          <b className="mb-1 font-display text-lg">Beyazsayfa</b>
          <Link href="/hakkimizda" className="text-bg/70 hover:text-bg">Hakkımızda</Link>
          <Link href="/deneyimler" className="text-bg/70 hover:text-bg">Deneyimler</Link>
          <Link href="/blog" className="text-bg/70 hover:text-bg">Blog</Link>
          <Link href="/iletisim" className="text-bg/70 hover:text-bg">İletişim ve randevu</Link>
        </div>
        <div className={col}>
          <b className="mb-1 font-display text-lg">İletişim</b>
          <span className="text-bg/70">{SITE.email}</span>
          <span className="text-bg/70">{SITE.phone}</span>
          <span className="text-bg/70">{SITE.address}</span>
        </div>
      </div>
      <div className="border-t border-bg/15">
        <div className="wrap flex flex-wrap gap-x-6 gap-y-2 py-6 text-sm text-bg/60">
          <span>© {new Date().getFullYear()} {SITE.name}. Tüm içerikler korumalıdır.</span>
          <Link href="/yasal/kvkk" className="hover:text-bg">KVKK aydınlatma metni</Link>
          <Link href="/yasal/gizlilik" className="hover:text-bg">Gizlilik ve çerez politikası</Link>
          <Link href="/yasal/mesafeli-satis" className="hover:text-bg">Mesafeli satış sözleşmesi</Link>
          <Link href="/yasal/iade" className="hover:text-bg">İptal ve iade koşulları</Link>
        </div>
      </div>
    </footer>
  );
}
