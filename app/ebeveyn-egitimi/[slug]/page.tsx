import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import Prose from "@/components/Prose";
import { COURSES, courseByKey } from "@/lib/catalog";
import { createClient, getMe } from "@/lib/supabase/server";
import { tl } from "@/lib/site";

export function generateStaticParams() { return COURSES.map((c) => ({ slug: c.key })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = courseByKey((await params).slug); return { title: c?.title ?? "Eğitim" };
}
const BG: Record<string, string> = { blush: "bg-blush", sky: "bg-sky", butter: "bg-butter", sage: "bg-sage" };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = courseByKey((await params).slug);
  if (!c) notFound();
  const me = await getMe().catch(() => null);
  let access = false;
  if (me) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("has_access", { p_key: c.key });
    access = !!data;
  }
  return (
    <>
      <section className={BG[c.color]}>
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div className="flex flex-col gap-5">
            <Link href="/ebeveyn-egitimi" className="text-sm font-bold text-ink hover:text-ink">← Tüm eğitimler</Link>
            <div className="flex gap-2"><span className="chip bg-bg/70 text-ink">{c.age}</span><span className="chip bg-bg/70 text-ink">{c.lessons.length} ders · {c.lessons.reduce((a, l) => a + l.minutes, 0)} dk</span></div>
            <h1>{c.title}</h1>
            <p className="text-xl text-ink"><b>Sorun:</b> {c.problem}</p>
            <p className="text-xl text-ink"><b>Hedef:</b> {c.promise}</p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {access ? (
                <span className="chip bg-ok text-white">Bu eğitime erişiminiz var</span>
              ) : me ? (
                <><span className="font-display text-4xl font-extrabold tabular-nums">{tl(c.price)}</span><Link href={`/odeme/${c.key}`} className="btn-primary">Satın al</Link></>
              ) : (
                <><Link href={`/kayit?sonra=/ebeveyn-egitimi/${c.key}`} className="btn-primary">Üye ol, fiyatı gör</Link><Link href={`/giris?sonra=/ebeveyn-egitimi/${c.key}`} className="btn-light">Giriş yap</Link></>
              )}
            </div>
          </div>
          <Photo id={c.photo} priority className="aspect-[4/3] rounded-[2.5rem]" />
        </div>
      </section>

      <section className="wrap grid gap-12 py-16 md:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl">Bu eğitimde öğrenecekleriniz</h2>
          <ul className="grid gap-3">{c.outcomes.map((o) => <li key={o} className="flex gap-3 text-lg"><span className="text-action">✓</span>{o}</li>)}</ul>
          {c.behaviorKey && (
            <div className="mt-4 rounded-3xl bg-paper p-6">
              <b className="font-display text-lg">Davranış programıyla birlikte</b>
              <p className="mt-1 text-muted">Eğitimi izlerken aynı davranış için ABC kaydı tutun; uygulama planınız kayıtlarınıza göre kişiselleşsin.</p>
              <Link href={me ? `/panel/davranis/yeni?b=${c.behaviorKey}` : "/davranis-programi"} className="mt-3 inline-block font-bold text-action">Programı başlat →</Link>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl">Dersler</h2>
          {c.lessons.map((l, i) => (
            <details key={l.title} className="group rounded-3xl border border-line p-6 open:bg-paper" open={access && i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="flex items-center gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-action font-display font-bold text-action-ink">{i + 1}</span><b className="font-display text-xl">{l.title}</b></span>
                <span className="shrink-0 text-sm text-muted">{l.minutes} dk {access ? "" : "🔒"}</span>
              </summary>
              {access ? (
                <div className="mt-5">
                  <div className="mb-4 grid aspect-video place-items-center rounded-2xl bg-ink/90 text-bg"><span className="font-semibold">Ders videosu buraya eklenecek</span></div>
                  <Prose text={l.body} className="text-lg" />
                </div>
              ) : (
                <p className="mt-4 text-muted">Ders içeriği eğitimi satın alan üyelere açılır.</p>
              )}
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
