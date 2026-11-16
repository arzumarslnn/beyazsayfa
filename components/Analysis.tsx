import { MIZAC, OGRENME, dominant, type TestKey } from "@/lib/tests";

export default function Analysis({ test, scores, forParent = false }: { test: TestKey; scores: Record<string, number>; forParent?: boolean }) {
  const d = dominant(scores);
  if (test === "mizac") {
    const t = MIZAC[d];
    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-3xl">Baskın mizaç: {t.name} <span className="text-muted">({t.alt})</span></h2>
        <p className="max-w-prose text-lg">{t.genel}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {[["Güçlü yönler", t.guclu, "bg-sage"], ["Zorlanabileceği alanlar", t.zor, "bg-blush"], ["Uygun çalışma yolları", t.calisma, "bg-sky"]].map(([h, items, bg]) => (
            <div key={h as string} className={`${bg} rounded-3xl p-6`}><b className="font-display text-lg">{h as string}</b>
              <ul className="mt-2 grid list-disc gap-1 pl-5">{(items as string[]).map((x) => <li key={x}>{x}</li>)}</ul></div>
          ))}
        </div>
        <div className={`rounded-3xl ${forParent ? "bg-butter" : "bg-paper"} p-6`}><b className="font-display text-lg">Veliye öneriler</b>
          <ul className="mt-2 grid list-disc gap-1 pl-5">{t.veli.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>
    );
  }
  const t = OGRENME[d];
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl">Öğrenme stili: {t.name}</h2>
      <p className="max-w-prose text-lg">{t.genel}</p>
      <div className="rounded-3xl bg-sky p-6"><b className="font-display text-lg">Çalışma önerileri</b><ul className="mt-2 grid list-disc gap-1 pl-5">{t.tips.map((x) => <li key={x}>{x}</li>)}</ul></div>
      <div className={`rounded-3xl ${forParent ? "bg-butter" : "bg-paper"} p-6`}><b className="font-display text-lg">Veliye öneri</b><p className="mt-1">{t.veli}</p></div>
    </div>
  );
}
