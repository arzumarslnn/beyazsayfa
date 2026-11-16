import Link from "next/link";
import PanelTitle, { Empty, Privacy } from "@/components/PanelTitle";
import ScoreBars from "@/components/ScoreBars";
import { createClient, getMe } from "@/lib/supabase/server";
import { TESTS, type TestKey } from "@/lib/tests";
import { trDate } from "@/lib/site";

export default async function Page() {
  const me = (await getMe())!;
  const supabase = await createClient();
  const { data: kids } = await supabase.from("profiles").select("id,full_name,grade").eq("parent_id", me.id);
  if (!kids?.length) return (<><PanelTitle title="Çocuğumun paylaştıkları" /><Empty>Hesabınıza bağlı öğrenci yok. Çocuğunuz kendi panelindeki “Hesabım” sayfasından sizin e-postanızı ({me.email}) yazarak bağlantı kurabilir.</Empty></>);
  const ids = kids.map((k) => k.id);
  const [{ data: tests }, { data: dn }] = await Promise.all([
    supabase.from("test_results").select("*").in("user_id", ids).eq("shared", true).order("created_at", { ascending: false }),
    supabase.from("denemeler").select("*").in("user_id", ids).eq("shared", true).order("exam_date", { ascending: false }),
  ]);
  return (
    <>
      <PanelTitle title="Çocuğumun paylaştıkları" lead="Burada yalnızca çocuğunuzun sizinle paylaşmayı seçtiği sonuçlar görünür." />
      <Privacy>Çocuğunuzun doldurduğu formlar gizlidir; yalnızca çocuğunuz ve koçu görebilir.</Privacy>
      {kids.map((k) => {
        const t = (tests ?? []).filter((x) => x.user_id === k.id);
        const d = (dn ?? []).filter((x) => x.user_id === k.id);
        return (
          <section key={k.id} className="mt-8 flex flex-col gap-4">
            <h2 className="text-2xl">{k.full_name} <span className="text-muted">{k.grade}</span></h2>
            {t.length ? t.map((r) => (
              <div key={r.id} className="card flex flex-col gap-4">
                <div className="flex flex-wrap justify-between gap-2"><b className="font-display text-xl">{TESTS[r.test as TestKey].title}</b><span className="text-muted">{trDate(r.created_at)}</span></div>
                <ScoreBars test={r.test} scores={r.scores} />
                <Link href={`/testler/sonuc/${r.id}`} className="btn-ghost btn-sm self-start">Analizi ve veli önerilerini gör</Link>
              </div>
            )) : <Empty>Paylaşılan test sonucu yok.</Empty>}
            {d.length > 0 && (
              <div className="card"><b className="font-display text-xl">Paylaşılan denemeler</b>
                <ul className="mt-3 divide-y divide-line">{d.map((x) => <li key={x.id} className="flex justify-between gap-3 py-2.5"><span>{x.name} <span className="text-muted">· {trDate(x.exam_date)}</span></span><b className="tabular-nums">{x.net ?? "—"} net</b></li>)}</ul>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
