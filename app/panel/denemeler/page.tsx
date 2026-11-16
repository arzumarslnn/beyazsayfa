import PanelTitle, { Empty } from "@/components/PanelTitle";
import ActionForm from "@/components/ActionForm";
import ShareToggle from "@/components/ShareToggle";
import LineChart from "@/components/LineChart";
import { Input, Check } from "@/components/Fields";
import { addDeneme, deleteDeneme } from "@/app/actions";
import { createClient, getMe } from "@/lib/supabase/server";
import { trDate } from "@/lib/site";

export default async function Page() {
  const me = (await getMe())!;
  const supabase = await createClient();
  const { data: list } = await supabase.from("denemeler").select("*").eq("user_id", me.id).order("exam_date", { ascending: true });
  const rows = list ?? [];
  const withNet = rows.filter((d) => d.net != null);
  return (
    <>
      <PanelTitle title="Deneme sonuçlarım" lead="Deneme eklemek tamamen isteğe bağlı. Eklediğin her denemeyi velinle paylaşıp paylaşmamak da senin kararın." />
      <div className="card md:p-8">
        <h2 className="mb-4 text-2xl">Deneme ekle</h2>
        <ActionForm action={addDeneme} submit="Kaydet" resetOnOk className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input name="name" label="Deneme adı" required placeholder="TYT Deneme 5" />
            <Input name="exam_date" label="Tarih" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            <Input name="net" label="Toplam net" inputMode="decimal" placeholder="68,25" />
          </div>
          <Input name="file" label="Sonuç belgesi" type="file" accept="image/*,.pdf" hint="İsteğe bağlı, en fazla 5 MB" />
          <Check name="share">Bu denemeyi velimle paylaş</Check>
        </ActionForm>
      </div>
      {withNet.length >= 2 && (
        <div className="card mt-6"><h2 className="mb-3 text-2xl">Net gelişimi</h2>
          <LineChart labels={withNet.map((d) => new Date(d.exam_date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }))} series={[{ name: "Toplam net", color: "rgb(var(--action))", values: withNet.map((d) => Number(d.net)) }]} />
        </div>
      )}
      <div className="mt-6 grid gap-3">
        {rows.length ? [...rows].reverse().map((d) => (
          <div key={d.id} className="card flex flex-wrap items-center justify-between gap-4">
            <div><b className="font-display text-xl">{d.name}</b><p className="text-muted">{trDate(d.exam_date)} · Net: <b className="tabular-nums text-ink">{d.net ?? "—"}</b>{d.file_path ? " · Belge eklendi" : ""}</p></div>
            <div className="flex flex-wrap items-center gap-3">
              <ShareToggle kind="deneme" id={d.id} shared={d.shared} hasParent={!!me.parent_id} compact />
              <form action={deleteDeneme.bind(null, d.id)}><button className="text-sm font-semibold text-muted hover:text-bad">Sil</button></form>
            </div>
          </div>
        )) : <Empty>Henüz deneme eklemedin.</Empty>}
      </div>
    </>
  );
}
