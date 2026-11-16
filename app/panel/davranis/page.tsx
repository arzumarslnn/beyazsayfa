import Link from "next/link";
import PanelTitle, { Empty } from "@/components/PanelTitle";
import { createClient, getMe } from "@/lib/supabase/server";
import { behaviorByKey } from "@/lib/behaviors";
import { trDate } from "@/lib/site";
const ST = { aktif: ["Aktif", "bg-sage"], tamamlandi: ["Tamamlandı", "bg-sky"], durduruldu: ["Durduruldu", "bg-paper"] } as const;

export default async function Page() {
  const me = (await getMe())!;
  const supabase = await createClient();
  const { data: programs } = await supabase.from("behavior_programs").select("*").eq("owner", me.id).order("created_at", { ascending: false });
  return (
    <>
      <PanelTitle title="Davranış programı" lead="Bir davranış seçin, ABC kaydı tutun, size özel planı uygulayın ve gelişimi izleyin.">
        <Link href="/panel/davranis/yeni" className="btn-primary">Yeni program</Link>
      </PanelTitle>
      {programs?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {programs.map((p) => { const b = behaviorByKey(p.behavior_key); const [l, bg] = ST[p.status as keyof typeof ST];
            return (
              <Link key={p.id} href={`/panel/davranis/${p.id}`} className="card flex flex-col gap-2 transition hover:-translate-y-0.5">
                <div className="flex items-center justify-between"><span className={`chip ${bg} text-ink`}>{l}</span><span className="text-sm text-muted">{trDate(p.start_date)}</span></div>
                <h2 className="text-2xl">{b?.title}</h2>
                <p className="text-muted">{p.child_name}{p.child_age ? `, ${p.child_age} yaş` : ""}</p>
                <p className="text-[15px]"><b>Hedef:</b> {p.target_behavior}</p>
              </Link>
            ); })}
        </div>
      ) : <Empty>Henüz bir programınız yok. <Link href="/panel/davranis/yeni" className="font-bold text-action">İlk programı başlatın →</Link></Empty>}
    </>
  );
}
