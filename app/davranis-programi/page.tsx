import Link from "next/link";
import PageHead from "@/components/PageHead";
import SampleChart from "@/components/SampleChart";
import { BEHAVIORS, FUNCTIONS } from "@/lib/behaviors";
import { getMe } from "@/lib/supabase/server";
export const metadata = { title: "Davranış Programı" };
const BG: Record<string, string> = { blush: "bg-blush", sky: "bg-sky", butter: "bg-butter", sage: "bg-sage" };

export default async function Page() {
  const me = await getMe().catch(() => null);
  const start = me ? "/panel/davranis/yeni" : "/kayit?sonra=/panel/davranis/yeni";
  return (
    <>
      <PageHead eyebrow="Ebeveyn davranış programı" title="Davranışı seç, kaydet, değiştir"
        lead="Davranış bilimine dayanan ABC yöntemiyle çocuğunuzun davranışını anlayın. Kayıtlarınız size özel bir uygulama planına, günlük kayıtlarınız ise gelişimi gösteren bir grafiğe dönüşür. Üyelere ücretsizdir.">
        <div className="flex flex-wrap gap-3"><Link href={start} className="btn-primary">Programı başlat</Link><a href="#nasil" className="btn-ghost">Nasıl çalışır?</a></div>
      </PageHead>

      <section id="nasil" className="wrap scroll-mt-24 py-20">
        <div className="mb-12 flex flex-col gap-3 md:max-w-2xl"><span className="eyebrow">ABC yöntemi</span><h2>Her davranışın bir öncesi ve bir sonrası vardır</h2>
          <p className="lead">Davranışı değiştirmenin yolu, onu tetikleyen durumu ve davranışın çocuğa ne kazandırdığını görmekten geçer.</p></div>
        <div className="grid gap-5 md:grid-cols-3">
          {[["A", "Öncül", "Davranıştan hemen önce ne oldu?", "Ekranı kapatmasını istedim.", "bg-sky"], ["B", "Davranış", "Çocuk tam olarak ne yaptı?", "Bağırdı, tableti yere attı.", "bg-blush"], ["C", "Sonuç", "Hemen ardından ne oldu?", "Sakinleşsin diye 10 dakika daha verdim.", "bg-butter"]].map(([l, t, q, ex, bg]) => (
            <div key={l} className={`${bg} rounded-[2rem] p-7`}>
              <span className="font-display text-6xl font-extrabold">{l}</span>
              <h3 className="mt-2">{t}</h3><p className="mt-1 text-ink">{q}</p>
              <p className="mt-4 rounded-2xl bg-bg/70 p-4 text-[15px]"><b>Örnek:</b> {ex}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-prose text-lg text-muted">Bu örnekte çocuk, bağırınca ekran süresinin uzadığını öğreniyor. Program birkaç kayıttan sonra bu tür örüntüleri sizin için bulur ve davranışın olası işlevini gösterir: <b className="text-ink">{Object.values(FUNCTIONS).map((f) => f.name.toLowerCase()).join(", ")}</b>.</p>
      </section>

      <section className="bg-paper py-20">
        <div className="wrap grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <span className="eyebrow">Gelişimi görün</span><h2>Her gün bir dakikalık kayıt, haftalar sonra net bir tablo</h2>
            <p className="lead">Gün sonunda kaç kez problem davranış, kaç kez olumlu davranış gördüğünüzü işaretleyin. Grafik ilk haftanızla son haftanızı karşılaştırır.</p>
            <ul className="grid gap-2 text-lg">{["Kişisel uygulama planı", "Önleme, öğretme, pekiştirme adımları", "Davranış olduğunda ne yapacağınız", "Haftalık değişim yüzdesi"].map((x) => <li key={x} className="flex gap-2"><span className="text-action">✓</span>{x}</li>)}</ul>
          </div>
          <div className="rounded-[2rem] bg-bg p-6 shadow-sm"><span className="chip bg-sage text-ink">Örnek görünüm</span><SampleChart /></div>
        </div>
      </section>

      <section className="wrap py-20">
        <div className="mb-10 flex flex-col gap-3"><span className="eyebrow">Programdaki davranışlar</span><h2>Hangisiyle başlamak istersiniz?</h2></div>
        <div className="grid gap-5 md:grid-cols-2">
          {BEHAVIORS.map((b) => (
            <div key={b.key} id={b.key} className={`${BG[b.color]} scroll-mt-24 rounded-[2rem] p-7`}>
              <div className="flex flex-wrap items-center justify-between gap-2"><h3>{b.title}</h3><span className="chip bg-bg/70 text-ink">{b.age}</span></div>
              <p className="mt-2 text-ink">Sık duyduğumuz cümleler: {b.examples.map((e) => `“${e}”`).join(", ")}</p>
              <p className="mt-4 rounded-2xl bg-bg/70 p-4"><b>Hedef davranış:</b> {b.target}</p>
              <Link href={me ? `/panel/davranis/yeni?b=${b.key}` : `/kayit?sonra=/panel/davranis/yeni?b=${b.key}`} className="mt-4 inline-block font-bold">Bu davranışla başla →</Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
