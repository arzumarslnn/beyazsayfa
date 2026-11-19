import Link from "next/link";
import PageHead from "@/components/PageHead";
import { TESTS } from "@/lib/tests";
import { TEST_PRODUCT } from "@/lib/catalog";
import { createClient, getMe } from "@/lib/supabase/server";
import { tl } from "@/lib/site";
export const metadata = { title: "Mizaç ve Öğrenme Stili Testleri" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await getMe().catch(() => null);
  let access = false;
  if (me) {
    const supabase = await createClient();
    access = !!(await supabase.rpc("has_access", { p_key: "testler" })).data;
  }
  return (
    <>
      <PageHead eyebrow="Testler · Üyelere özel" title="Mizaç ve öğrenme stili testleri" photo="testler"
        lead="Öğrencinin mizacını ve en iyi nasıl öğrendiğini ortaya koyan iki test. Testler satın alan üyelerimize ve koçluk paketi alan ailelere açıktır; öğrenci testi kendi hesabıyla çözer, isterse sonucu velisiyle paylaşır." />
      <section className="wrap grid gap-6 py-16 md:grid-cols-2">
        {(Object.entries(TESTS) as [keyof typeof TESTS, (typeof TESTS)[keyof typeof TESTS]][]).map(([k, t], i) => (
          <div key={k} className={`${i ? "bg-sky" : "bg-sage"} flex flex-col gap-4 rounded-[2rem] p-8 md:p-10`}>
            <h2 className="text-3xl md:text-4xl">{t.title}</h2>
            <p className="text-lg text-ink">{t.desc}</p>
            <div className="flex gap-2"><span className="chip bg-paper/80 text-ink">{t.questions.length} soru</span><span className="chip bg-paper/80 text-ink">{t.minutes}</span></div>
            {access
              ? <Link href={`/testler/${k}`} className="btn-primary mt-2 self-start">{me?.role === "ogrenci" ? "Teste başla" : "Testi incele"}</Link>
              : <span className="chip mt-2 self-start bg-ink text-paper">🔒 Satın alınca açılır</span>}
          </div>
        ))}
      </section>
      <section className="wrap">
        <div className="grid gap-8 rounded-[2.5rem] bg-paper p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
          <div>
            <h2 className="text-3xl">{TEST_PRODUCT.title}</h2>
            <p className="mt-2 text-lg text-muted">{TEST_PRODUCT.summary}</p>
            <ul className="mt-4 grid gap-2">{TEST_PRODUCT.items.map((x) => <li key={x} className="flex gap-2"><span className="text-leaf">✓</span>{x}</li>)}</ul>
            <p className="mt-4 text-sm text-muted">Keşif, Gelişim ve Aile Programı koçluk paketlerine dahildir. Veli satın aldığında, hesabına bağlı öğrenci testleri kendi hesabıyla çözebilir.</p>
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-3xl bg-butter p-7">
            {access ? (
              <>
                <b className="font-display text-2xl">Testlere erişiminiz var</b>
                {me?.role === "veli" ? <p>Çocuğunuz testleri kendi öğrenci hesabıyla çözer. Paylaştığı sonuçları <Link href="/panel/cocugum" className="font-bold underline">panelinizde</Link> görürsünüz.</p>
                  : <Link href="/testler/mizac" className="btn-primary self-start">Mizaç testiyle başla</Link>}
              </>
            ) : me ? (
              <>
                <span className="font-display text-4xl font-extrabold tabular-nums">{tl(TEST_PRODUCT.price)}</span>
                <Link href="/odeme/testler" className="btn-primary self-start">Satın al</Link>
              </>
            ) : (
              <>
                <b className="font-display text-2xl">Testler üyelere özel</b>
                <p>Fiyatı görmek ve satın almak için ücretsiz üye olun ya da giriş yapın.</p>
                <div className="flex flex-wrap gap-3"><Link href="/kayit?sonra=/testler" className="btn-primary">Üye ol</Link><Link href="/giris?sonra=/testler" className="btn-light">Giriş yap</Link></div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
