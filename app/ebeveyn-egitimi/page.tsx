import Link from "next/link";
import PageHead from "@/components/PageHead";
import Photo from "@/components/Photo";
import { PACKAGE_COURSES, TOPIC_COURSES } from "@/lib/catalog";
import { getMe } from "@/lib/supabase/server";
import { tl } from "@/lib/site";
export const metadata = { title: "Ebeveyn Davranış Eğitimi" };
const BG: Record<string, string> = { blush: "bg-blush", sky: "bg-sky", butter: "bg-butter", sage: "bg-sage" };

export default async function Page() {
  const me = await getMe().catch(() => null);
  return (
    <>
      <PageHead eyebrow="Ebeveyn davranış eğitimi" title="Çocuğunuzun davranışını siz değiştirin" photo="ebeveyn"
        lead="Biz çocukların davranışlarını düzeltmiyoruz. Ebeveynlere, çocuklarının davranışlarını tanımayı ve davranış bilimine dayanan tekniklerle kendi başlarına değiştirmeyi öğretiyoruz. Kısa dersler, evde uygulamalar ve ilerlemenizi gösteren Davranış Programı bir arada." />

      <section className="wrap py-20">
        <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
          <span className="eyebrow">Eğitim paketleri</span>
          <h2>Hazırlıktan uygulamaya üç paket</h2>
          <p className="lead">Önce kendinizi ve evinizi hazırlayın, sonra davranışı tanıyıp teknikleri öğrenin. İkisini birden isteyenler için Tam Paket.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {PACKAGE_COURSES.map((c, i) => (
            <div key={c.key} className={`flex flex-col gap-5 rounded-[2rem] bg-paper p-8 ${c.badge ? "ring-[3px] ring-action" : "border border-line"}`}>
              <div className="flex items-center justify-between gap-3">
                <span className={`chip ${BG[c.color]} text-ink`}>{c.includes ? "1 + 2" : `${i + 1}. paket`}</span>
                {c.badge && <span className="chip bg-action text-action-ink">{c.badge}</span>}
              </div>
              <h3 className="text-3xl">{c.title}</h3>
              <p className="text-muted">{c.promise}</p>
              <ul className="grid gap-2">{c.outcomes.map((o) => <li key={o} className="flex gap-2"><span className="text-leaf">✓</span>{o}</li>)}</ul>
              <p className="text-sm text-muted">{c.lessons.length} ders · {c.lessons.reduce((a, l) => a + l.minutes, 0)} dakika</p>
              <div className="mt-auto flex flex-col gap-3">
                {me ? <span className="font-display text-4xl font-extrabold tabular-nums">{tl(c.price)}</span>
                  : <div className="flex items-center gap-3"><span className="blurred font-display text-4xl font-extrabold" aria-hidden="true">₺0.000</span><span className="chip bg-ink text-paper">Üyelere özel</span></div>}
                <Link href={`/ebeveyn-egitimi/${c.key}`} className={c.badge ? "btn-primary" : "btn-ghost"}>İncele</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-20">
        <div className="wrap">
          <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
            <span className="eyebrow">Konu bazlı eğitimler</span>
            <h2>Belirli bir davranışla mı uğraşıyorsunuz?</h2>
            <p className="lead">Tek bir soruna odaklanan kısa eğitimler. Her biri o davranışı değiştirmek için size neler yapabileceğinizi adım adım öğretir.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TOPIC_COURSES.map((c) => (
              <Link key={c.key} href={`/ebeveyn-egitimi/${c.key}`} className={`group flex flex-col overflow-hidden rounded-[2rem] ${BG[c.color]}`}>
                <Photo id={c.photo} className="aspect-[16/10]" tint={BG[c.color]} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="flex flex-1 flex-col gap-3 p-7">
                  <div className="flex items-center gap-2"><span className="chip bg-paper/80 text-ink">{c.age}</span><span className="chip bg-paper/80 text-ink">{c.lessons.length} ders</span></div>
                  <h3 className="text-2xl">{c.title}</h3>
                  <p className="text-ink">{c.problem}</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    {me ? <span className="font-display text-2xl font-extrabold tabular-nums">{tl(c.price)}</span> : <span className="text-sm font-bold text-ink">Fiyat üyelere özel</span>}
                    <span className="font-bold">İncele <span className="inline-block transition group-hover:translate-x-1">→</span></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap pt-20">
        <div className="grid gap-8 rounded-[2.5rem] bg-sky p-8 md:grid-cols-3 md:p-12">
          {[["Siz öğrenirsiniz", "Teknikleri ebeveyn olarak siz öğrenir, evde siz uygularsınız. Çocuğunuzla doğrudan biz çalışmayız."], ["Kısa dersler, evde uygulama", "Her ders 9–14 dakika ve sonunda o hafta deneyeceğiniz tek bir uygulama var."], ["Ölçülebilir ilerleme", "Davranış Programı'ndaki kayıt ve grafiklerle değişimi kendi gözünüzle görürsünüz."]].map(([t, d]) => (
            <div key={t}><h3 className="text-xl">{t}</h3><p className="mt-2 text-ink">{d}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
