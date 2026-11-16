"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { TESTS, score, dominant, type TestKey } from "@/lib/tests";
import { saveTestResult } from "@/app/actions";
import ScoreBars from "./ScoreBars";
import Analysis from "./Analysis";

export const PENDING_KEY = "beyazsayfa-bekleyen-test";

export default function TestRunner({ test, role }: { test: TestKey; role: string | null }) {
  const T = TESTS[test];
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(T.questions.length).fill(""));
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  const choose = (v: string) => {
    const a = [...answers]; a[i] = v; setAnswers(a);
    if (i < T.questions.length - 1) { setI(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else finish(a);
  };
  const finish = (a: string[]) => {
    if (role === "ogrenci") {
      start(async () => {
        const r = await saveTestResult(test, a);
        if (r.id) router.push(`/testler/sonuc/${r.id}?yeni=1`);
        else { setErr("Sonuç kaydedilemedi, aşağıda görebilirsin."); setDone(true); }
      });
    } else {
      if (!role) { try { localStorage.setItem(PENDING_KEY, JSON.stringify({ test, answers: a })); } catch {} }
      setDone(true);
    }
  };

  if (pending) return <p className="py-20 text-center text-lg font-semibold">Sonucun hazırlanıyor…</p>;

  if (done) {
    const sc = score(test, answers);
    const d = T.types[dominant(sc)];
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3"><span className="eyebrow">{T.title} · Sonuç</span><h1 className="text-4xl md:text-5xl">Baskın profilin: {d.name}</h1></div>
        {err && <p className="rounded-2xl bg-blush p-4 font-semibold">{err}</p>}
        <div className="card"><ScoreBars test={test} scores={sc} /></div>
        {role ? (
          <>
            <Analysis test={test} scores={sc} forParent={role === "veli"} />
            {role !== "ogrenci" && <p className="rounded-2xl bg-paper p-5 text-muted">Bu sonuç kaydedilmedi. Test sonuçları öğrenci hesabıyla çözüldüğünde kaydedilir ve öğrenci isterse velisiyle paylaşılır.</p>}
          </>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-3xl">
              <div className="blurred" aria-hidden="true"><Analysis test={test} scores={sc} /></div>
              <div className="absolute inset-0 grid place-items-center bg-bg/40 p-6">
                <div className="max-w-md rounded-3xl bg-bg p-7 text-center shadow-xl">
                  <h3>Ayrıntılı analizin hazır</h3>
                  <p className="mt-2 text-muted">Güçlü yönlerini, zorlanabileceğin alanları, sana uygun çalışma yollarını ve veline önerileri görmek için ücretsiz üye ol. Sonucun kaybolmaz, üye olunca otomatik kaydedilir.</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <Link href="/kayit?rol=ogrenci&sonra=/panel" className="btn-primary">Ücretsiz üye ol</Link>
                    <Link href="/giris?sonra=/panel" className="btn-ghost">Giriş yap</Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <button type="button" onClick={() => { setAnswers(Array(T.questions.length).fill("")); setI(0); setDone(false); }} className="btn-ghost self-start">Testi yeniden çöz</button>
      </div>
    );
  }

  const q = T.questions[i];
  const pct = Math.round((i / T.questions.length) * 100);
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link href="/testler" className="text-sm font-bold text-muted hover:text-ink">← Testler</Link>
      <div className="flex flex-col gap-2"><span className="eyebrow">{T.title}</span>
        <div className="flex justify-between text-sm font-semibold text-muted"><span>Soru {i + 1} / {T.questions.length}</span><span>%{pct}</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-paper"><i className="block h-full rounded-full bg-action transition-all" style={{ width: `${pct}%` }} /></div>
      </div>
      <h2 className="text-3xl md:text-4xl">{q.q}</h2>
      <div className="grid gap-3">
        {q.o.map(([label, v]) => (
          <button key={label} type="button" onClick={() => choose(v)}
            className={`rounded-2xl border-2 p-4 text-left text-lg font-semibold transition hover:border-action ${answers[i] === v ? "border-action bg-sage" : "border-line bg-bg"}`}>{label}</button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="btn-ghost btn-sm">Önceki soru</button>
        <span className="text-sm text-muted">Doğru ya da yanlış cevap yok.</span>
      </div>
    </div>
  );
}

/** Üye olmadan çözülmüş testi, öğrenci giriş yaptığında kaydeder. */
export function PendingTestSaver() {
  const router = useRouter();
  useEffect(() => {
    let raw: string | null = null;
    try { raw = localStorage.getItem(PENDING_KEY); } catch {}
    if (!raw) return;
    try { localStorage.removeItem(PENDING_KEY); } catch {}
    const { test, answers } = JSON.parse(raw);
    saveTestResult(test, answers).then((r) => { if (r.id) router.push(`/testler/sonuc/${r.id}?yeni=1`); });
  }, [router]);
  return null;
}
