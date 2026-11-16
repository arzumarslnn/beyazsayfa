import Link from "next/link";
import PanelTitle, { Empty } from "@/components/PanelTitle";
import { createClient } from "@/lib/supabase/server";
import { behaviorByKey } from "@/lib/behaviors";
import { trDate } from "@/lib/site";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("behavior_programs").select("*, profiles(full_name)").order("created_at", { ascending: false });
  return (
    <>
      <PanelTitle title="Davranış programları" lead="Velilerin yürüttüğü programları görüntüleyebilir, koçluk görüşmelerinde birlikte değerlendirebilirsiniz." />
      {data?.length ? (
        <div className="grid gap-3">
          {data.map((p: any) => (
            <Link key={p.id} href={`/panel/davranis/${p.id}`} className="card flex flex-wrap items-center justify-between gap-3 hover:bg-paper">
              <div><b className="font-display text-xl">{behaviorByKey(p.behavior_key)?.title}</b> <span className="text-muted">· {p.child_name}</span><p className="text-sm text-muted">Veli: {p.profiles?.full_name} · {trDate(p.start_date)}</p></div>
              <span className="chip bg-paper text-ink">{p.status}</span>
            </Link>
          ))}
        </div>
      ) : <Empty>Henüz program yok.</Empty>}
    </>
  );
}
