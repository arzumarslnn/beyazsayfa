import Link from "next/link";
import PanelTitle, { Empty } from "@/components/PanelTitle";
import { createClient } from "@/lib/supabase/server";
import { MIZAC, OGRENME } from "@/lib/tests";

export default async function Page() {
  const supabase = await createClient();
  const [{ data: students }, { data: parents }, { data: tests }, { data: forms }] = await Promise.all([
    supabase.from("profiles").select("id,full_name,email,grade,parent_id,created_at").eq("role", "ogrenci").order("full_name"),
    supabase.from("profiles").select("id,full_name,phone").eq("role", "veli"),
    supabase.from("test_results").select("id,user_id,test,dominant,created_at").order("created_at", { ascending: false }),
    supabase.from("form_entries").select("form_no,user_id,student_id,data,created_at").in("form_no", [2, 7, 10, 14]).order("created_at", { ascending: false }),
  ]);
  const latest = (pred: (f: any) => boolean) => (forms ?? []).find(pred);
  const rows = (students ?? []).map((s) => {
    const p = (parents ?? []).find((x) => x.id === s.parent_id);
    const mz = (tests ?? []).find((t) => t.user_id === s.id && t.test === "mizac");
    const og = (tests ?? []).find((t) => t.user_id === s.id && t.test === "ogrenme");
    const f10 = latest((f) => f.form_no === 10 && f.user_id === s.id);
    const f14 = p ? latest((f) => f.form_no === 14 && f.user_id === p.id) : null;
    const f7 = latest((f) => f.form_no === 7 && f.student_id === s.id);
    const f2 = p ? latest((f) => f.form_no === 2 && f.user_id === p.id) : null;
    return { s, p, mz, og, f10, f14, f7, f2 };
  });
  const sc = (v?: string) => (v ? `${v}/5` : "—");
  return (
    <>
      <PanelTitle title="Öğrenciler ve üçlü takip" lead="Öğrenci, veli ve koçun aynı süreci kendi gözünden nasıl puanladığını yan yana görün. Puanlar formlardan otomatik gelir." />
      {rows.length ? (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-[15px]">
              <thead><tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-3">Öğrenci</th><th className="py-2 pr-3">Veli</th><th className="py-2 pr-3">Mizaç</th><th className="py-2 pr-3">Öğrenme</th>
                <th className="py-2 pr-3">Öğrenci: koç / aile iletişimi</th><th className="py-2 pr-3">Veli: memnuniyet</th><th className="py-2 pr-3">Koç: plana uyum</th><th />
              </tr></thead>
              <tbody>
                {rows.map(({ s, p, mz, og, f10, f14, f7 }) => (
                  <tr key={s.id} className="border-b border-line align-top">
                    <td className="py-3 pr-3"><b>{s.full_name}</b><br /><span className="text-sm text-muted">{s.grade}</span></td>
                    <td className="py-3 pr-3">{p ? <>{p.full_name}<br /><span className="text-sm text-muted">{p.phone}</span></> : <span className="text-muted">Bağlı değil</span>}</td>
                    <td className="py-3 pr-3">{mz ? <Link href={`/testler/sonuc/${mz.id}`} className="underline">{MIZAC[mz.dominant]?.name}</Link> : "—"}</td>
                    <td className="py-3 pr-3">{og ? <Link href={`/testler/sonuc/${og.id}`} className="underline">{OGRENME[og.dominant]?.name}</Link> : "—"}</td>
                    <td className="py-3 pr-3 tabular-nums">{sc(f10?.data?.koc)} / {sc(f10?.data?.aile)}</td>
                    <td className="py-3 pr-3 tabular-nums">{sc(f14?.data?.memnuniyet)}</td>
                    <td className="py-3 pr-3 tabular-nums">{sc(f7?.data?.uyum)}</td>
                    <td className="py-3"><Link href={`/panel/formlar/4?ogrenci=${s.id}`} className="btn-ghost btn-sm whitespace-nowrap">Not ekle</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="mb-4 mt-12 text-2xl">Öğrenci mizacı ve veli beklentisi uyum analizi</h2>
          <div className="grid gap-4">
            {rows.filter((r) => r.mz || r.f2).map(({ s, mz, f2 }) => (
              <div key={s.id} className="grid gap-3 md:grid-cols-2">
                <div className="rounded-3xl bg-blush p-6"><b className="font-display text-lg">{s.full_name}</b>
                  {mz ? <><p className="mt-1 font-semibold">Baskın mizaç: {MIZAC[mz.dominant]?.name}</p><p className="mt-1 text-ink">{MIZAC[mz.dominant]?.genel}</p><p className="mt-2 text-sm"><b>Aileye öneri:</b> {MIZAC[mz.dominant]?.veli[0]}</p></> : <p className="mt-1 text-muted">Mizaç testi yok.</p>}</div>
                <div className="rounded-3xl bg-sky p-6"><b className="font-display text-lg">Veli beklentisi</b>
                  {f2 ? <><p className="mt-1">{f2.data?.beklenti}</p><p className="mt-2 text-sm"><b>Endişe:</b> {f2.data?.endise}</p><p className="mt-1 text-sm"><b>Çocuğu üç kelimeyle:</b> {f2.data?.uc_kelime || "—"}</p></> : <p className="mt-1 text-muted">Veli Ön Bilgilendirme Formu yok.</p>}</div>
              </div>
            ))}
          </div>
        </>
      ) : <Empty>Henüz kayıtlı öğrenci yok.</Empty>}
    </>
  );
}
