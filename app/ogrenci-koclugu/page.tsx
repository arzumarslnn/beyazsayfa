import Link from "next/link";
import PageHead from "@/components/PageHead";
import { PROCESS, formByNo, WHO_LABEL } from "@/lib/forms";
import { PACKAGES } from "@/lib/catalog";
import { getMe } from "@/lib/supabase/server";
import { tl } from "@/lib/site";
export const metadata = { title: "Öğrenci Koçluğu ve Eğitim Danışmanlığı" };

const WHO_BG = { ogrenci: "bg-blush", veli: "bg-sky", yonetim: "bg-paper" } as const;

export default async function Page() {
  const me = await getMe().catch(() => null);
  return (
    <>
      <PageHead eyebrow="Öğrenci koçluğu ve eğitim danışmanlığı" title="Kendi yolunu bulan öğrenciler" photo="kocluk"
        lead="Hedef koymaktan haftalık takibe, mizaca uygun çalışma düzeninden meslek seçimine kadar her adımda yanındayız. Aile de bu yolculuğun bir parçası.">
        <div className="flex flex-wrap gap-3"><Link href="/iletisim" className="btn-primary">Ön görüşme iste</Link><a href="#paketler" className="btn-ghost">Paketler</a></div>
      </PageHead>

      <section className="wrap py-20">
        <div className="mb-12 flex flex-col gap-3 md:max-w-2xl">
          <span className="eyebrow">Süreç nasıl işler?</span>
          <h2>Yedi adımda, birlikte ilerleyen bir süreç</h2>
          <p className="lead">Yapılan her çalışma bir forma ve bir amaca bağlıdır. Böylece öğrenci, veli ve koç nerede olduğumuzu her an bilir.</p>
        </div>
        <ol className="grid gap-5">
          {PROCESS.map((s, i) => (
            <li key={s.t} className="grid gap-4 rounded-3xl border border-line p-6 md:grid-cols-[80px_1fr_1.1fr] md:items-start md:p-8">
              <span className="font-display text-5xl font-extrabold text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{s.t}</h3><p className="mt-2 text-muted">{s.d}</p></div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {s.forms.map((n) => { const f = formByNo(n)!; return (
                  <span key={n} className={`chip ${WHO_BG[f.who]} text-ink`}>{f.no}. {f.title}</span>
                ); })}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
          <span><i className="mr-1.5 inline-block h-3 w-3 rounded-full bg-blush align-middle" />{WHO_LABEL.ogrenci}</span>
          <span><i className="mr-1.5 inline-block h-3 w-3 rounded-full bg-sky align-middle" />{WHO_LABEL.veli}</span>
          <span><i className="mr-1.5 inline-block h-3 w-3 rounded-full border border-line bg-paper align-middle" />{WHO_LABEL.yonetim} (yalnızca koç görür)</span>
        </p>
      </section>

      <section id="paketler" className="scroll-mt-24 bg-paper py-20">
        <div className="wrap">
          <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
            <span className="eyebrow">Paketler</span>
            <h2>Size uygun programı birlikte seçelim</h2>
            {!me && <p className="lead">Fiyatları görmek ve online satın almak için ücretsiz üye olun.</p>}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((p) => (
              <div key={p.key} className={`flex flex-col gap-5 rounded-[2rem] bg-bg p-8 ${p.featured ? "ring-2 ring-action" : "border border-line"}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-3xl">{p.title}</h3>
                  <span className={`chip ${p.featured ? "bg-action text-action-ink" : "bg-paper text-ink"}`}>{p.featured ? "En çok tercih edilen" : p.duration}</span>
                </div>
                <p className="text-muted">{p.summary}</p>
                <ul className="grid gap-2">{p.items.map((x) => <li key={x} className="flex gap-2"><span className="text-action">✓</span>{x}</li>)}</ul>
                <div className="mt-auto flex flex-col gap-3 pt-2">
                  {me ? (
                    <>
                      <div><span className="font-display text-4xl font-extrabold tabular-nums">{tl(p.price)}</span><span className="text-muted"> / {p.duration}</span></div>
                      <Link href={`/odeme/${p.key}`} className={p.featured ? "btn-primary" : "btn-ghost"}>Satın al</Link>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3"><span className="blurred font-display text-4xl font-extrabold" aria-hidden="true">₺00.000</span><span className="chip bg-ink text-bg">Üyelere özel</span></div>
                      <Link href="/kayit" className={p.featured ? "btn-primary" : "btn-ghost"}>Üye ol, fiyatı gör</Link>
                    </>
                  )}
                  <Link href="/iletisim" className="text-center text-sm font-semibold text-muted hover:text-ink">Önce ücretsiz görüşmek istiyorum</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
