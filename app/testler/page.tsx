import Link from "next/link";
import PageHead from "@/components/PageHead";
import { TESTS } from "@/lib/tests";
export const metadata = { title: "Mizaç ve Öğrenme Stili Testleri" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Testler" title="Kendini tanımak için iki kısa test" photo="testler"
        lead="Testleri herkes çözebilir ve özet sonucunu hemen görür. Ayrıntılı analiz, sonucun kaydedilmesi ve velinin bilgilendirilmesi üye öğrencilere açıktır." />
      <section className="wrap grid gap-6 py-20 md:grid-cols-2">
        {(Object.entries(TESTS) as [keyof typeof TESTS, (typeof TESTS)[keyof typeof TESTS]][]).map(([k, t], i) => (
          <div key={k} className={`${i ? "bg-sky" : "bg-blush"} flex flex-col gap-4 rounded-[2rem] p-8 md:p-10`}>
            <h2 className="text-3xl md:text-4xl">{t.title}</h2>
            <p className="text-lg text-ink/80">{t.desc}</p>
            <div className="flex gap-2"><span className="chip bg-bg/70 text-ink">{t.questions.length} soru</span><span className="chip bg-bg/70 text-ink">{t.minutes}</span></div>
            <Link href={`/testler/${k}`} className="btn-primary mt-2 self-start">Teste başla</Link>
          </div>
        ))}
      </section>
      <section className="wrap">
        <div className="rounded-[2rem] bg-paper p-8 md:p-10">
          <h3>Sonuçlar veliye nasıl ulaşır?</h3>
          <p className="mt-2 max-w-prose text-lg text-muted">Üye öğrenci testi bitirdiğinde “Velimle paylaş” derse aynı analiz veliye e-postayla gider, WhatsApp mesajı da tek dokunuşla gönderilmeye hazır olur. Sonuç veli panelinde de görünür. Paylaşıp paylaşmamak öğrencinin kararıdır.</p>
        </div>
      </section>
    </>
  );
}
