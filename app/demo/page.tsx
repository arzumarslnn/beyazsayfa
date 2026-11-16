import { notFound } from "next/navigation";
import { demoLogin } from "@/app/actions";
import { demoEnabled } from "@/lib/demo";
export const metadata = { title: "Demo giriş" };
export const dynamic = "force-dynamic";

const ROLES = [
  { role: "veli", tint: "bg-blush", who: "Ayşe Yılmaz", title: "Veli olarak gir",
    see: ["5 yaşındaki Can için 20 günlük öfke nöbeti programı: ABC kayıtları, analiz ve gelişim grafiği", "Elif'in paylaştığı mizaç sonucu ve denemeler", "Satın alınmış bir eğitimin dersleri", "Veli formları ve bildirimler"] },
  { role: "ogrenci", tint: "bg-sky", who: "Elif Yılmaz, 10. sınıf", title: "Öğrenci olarak gir",
    see: ["Mizaç ve öğrenme testi sonuçları, velimle paylaş düğmesi", "Doldurulmuş hedef, haftalık takip ve meslek yönelim formları", "Deneme sonuçları ve net grafiği"] },
  { role: "yonetim", tint: "bg-butter", who: "Selin Demir, koç", title: "Yönetici olarak gir",
    see: ["Öğrenci–veli–koç üçlü takip tablosu ve uyum analizi", "Bütün formlar ve koç formları", "Randevu talepleri, siparişler, blog ve deneyim yönetimi"] },
] as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ hata?: string }> }) {
  if (!demoEnabled()) notFound();
  const err = (await searchParams).hata;
  return (
    <section className="wrap py-14">
      <div className="mb-10 flex max-w-2xl flex-col gap-4">
        <span className="eyebrow">Demo</span>
        <h1 className="text-4xl md:text-5xl">Üye olmadan siteyi deneyin</h1>
        <p className="lead">Bir rol seçin, örnek verilerle dolu bir hesaba tek tıkla girin. Bu hesaplar ortak kullanılır; yaptığınız değişiklikleri başkaları da görebilir.</p>
        {err && <p className="rounded-2xl bg-blush px-4 py-3 font-semibold">Demo hesaba girilemedi. Biraz sonra tekrar deneyin.</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {ROLES.map((r) => (
          <form key={r.role} action={demoLogin.bind(null, r.role)} className={`${r.tint} flex flex-col gap-4 rounded-[2rem] p-8`}>
            <span className="chip self-start bg-bg/70 text-ink">{r.who}</span>
            <h2 className="text-3xl">{r.title}</h2>
            <ul className="grid gap-2">{r.see.map((s) => <li key={s} className="flex gap-2"><span>✓</span><span>{s}</span></li>)}</ul>
            <button className="btn-primary mt-auto">Giriş yap</button>
          </form>
        ))}
      </div>
    </section>
  );
}
