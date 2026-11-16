import Link from "next/link";
import PanelTitle, { Empty } from "@/components/PanelTitle";
import ScoreBars from "@/components/ScoreBars";
import ShareToggle from "@/components/ShareToggle";
import { createClient, getMe } from "@/lib/supabase/server";
import { TESTS, type TestKey } from "@/lib/tests";
import { trDate } from "@/lib/site";

export default async function Page() {
  const me = (await getMe())!;
  const supabase = await createClient();
  const { data: res } = await supabase.from("test_results").select("*").eq("user_id", me.id).order("created_at", { ascending: false });
  return (
    <>
      <PanelTitle title="Test sonuçlarım" lead="Her sonucu velinle paylaşıp paylaşmamaya sen karar verirsin.">
        <div className="flex gap-2"><Link href="/testler/mizac" className="btn-primary btn-sm">Mizaç testi</Link><Link href="/testler/ogrenme" className="btn-ghost btn-sm">Öğrenme testi</Link></div>
      </PanelTitle>
      {res?.length ? (
        <div className="grid gap-5">
          {res.map((r) => (
            <div key={r.id} className="card flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-2xl">{TESTS[r.test as TestKey].title}</h2><span className="text-muted">{trDate(r.created_at)}</span></div>
              <ScoreBars test={r.test} scores={r.scores} />
              <div className="flex flex-wrap items-start justify-between gap-4 border-t border-line pt-4">
                <ShareToggle kind="test" id={r.id} shared={r.shared} hasParent={!!me.parent_id} compact />
                <Link href={`/testler/sonuc/${r.id}`} className="btn-ghost btn-sm">Ayrıntılı analiz</Link>
              </div>
            </div>
          ))}
        </div>
      ) : <Empty>Henüz test çözmedin. Mizaç testiyle başlamaya ne dersin?</Empty>}
    </>
  );
}
