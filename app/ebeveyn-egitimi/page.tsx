import Link from "next/link";
import PageHead from "@/components/PageHead";
import Photo from "@/components/Photo";
import { COURSES } from "@/lib/catalog";
import { getMe } from "@/lib/supabase/server";
import { tl } from "@/lib/site";
export const metadata = { title: "Ebeveynler İçin Davranış Eğitimi" };
const BG: Record<string, string> = { blush: "bg-blush", sky: "bg-sky", butter: "bg-butter", sage: "bg-sage" };

export default async function Page() {
  const me = await getMe().catch(() => null);
  return (
    <>
      <PageHead eyebrow="Ebeveynler için davranış eğitimi" title="Çocuğunuzu anlamak öğrenilebilir" photo="ebeveyn"
        lead="Her eğitim tek bir soruna odaklanır: kısa dersler, evde hemen deneyeceğiniz uygulamalar ve ilerlemenizi takip edeceğiniz davranış programı. Kontrol etmeyi değil; anlamayı, olumlu davranışı geliştirmeyi ve problem davranışı azaltmayı öğreniyoruz." />
      <section className="wrap py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <Link key={c.key} href={`/ebeveyn-egitimi/${c.key}`} className={`group flex flex-col overflow-hidden rounded-[2rem] ${BG[c.color]}`}>
              <Photo id={c.photo} className="aspect-[16/10]" tint={BG[c.color]} sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="flex flex-1 flex-col gap-3 p-7">
                <div className="flex items-center gap-2"><span className="chip bg-bg/70 text-ink">{c.age}</span><span className="chip bg-bg/70 text-ink">{c.lessons.length} ders</span></div>
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
      </section>
      <section className="wrap">
        <div className="grid gap-8 rounded-[2.5rem] bg-paper p-8 md:grid-cols-3 md:p-12">
          {[["Kısa dersler", "Her ders 8–14 dakika. Çocuk uyuduktan sonra bile bitirilebilir."], ["Evde uygulama", "Her dersin sonunda o hafta deneyeceğiniz tek bir uygulama."], ["Ölçülebilir ilerleme", "Davranış programıyla değişimi kendi gözünüzle, grafikte görün."]].map(([t, d]) => (
            <div key={t}><h3 className="text-xl">{t}</h3><p className="mt-2 text-muted">{d}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
