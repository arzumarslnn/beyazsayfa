import Link from "next/link";
import PanelTitle, { Empty } from "@/components/PanelTitle";
import { createClient } from "@/lib/supabase/server";
import { FORMS, formByNo, WHO_LABEL } from "@/lib/forms";
import { trDate } from "@/lib/site";

export default async function Page({ searchParams }: { searchParams: Promise<{ form?: string }> }) {
  const supabase = await createClient();
  const sel = Number((await searchParams).form) || null;
  let q = supabase.from("form_entries").select("id,form_no,created_at,owner:profiles!form_entries_user_id_fkey(full_name,role),student:profiles!form_entries_student_id_fkey(full_name)").order("created_at", { ascending: false }).limit(200);
  if (sel) q = q.eq("form_no", sel);
  const { data } = await q;
  return (
    <>
      <PanelTitle title="Doldurulan formlar" lead="Yönetim tüm formları görür. Öğrenci ve veli yalnızca kendi doldurduklarını görür." />
      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/panel/yonetim/formlar" className={`chip ${!sel ? "bg-ink text-bg" : "bg-paper text-ink"}`}>Tümü</Link>
        {FORMS.map((f) => <Link key={f.no} href={`/panel/yonetim/formlar?form=${f.no}`} className={`chip ${sel === f.no ? "bg-ink text-bg" : "bg-paper text-ink"}`}>{f.no}</Link>)}
      </div>
      {data?.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead><tr className="border-b border-line text-xs uppercase tracking-wide text-muted"><th className="py-2 pr-3">Tarih</th><th className="py-2 pr-3">Form</th><th className="py-2 pr-3">Dolduran</th><th className="py-2 pr-3">Tür</th><th /></tr></thead>
            <tbody>{data.map((e: any) => { const f = formByNo(e.form_no)!; return (
              <tr key={e.id} className="border-b border-line">
                <td className="py-3 pr-3 text-muted">{trDate(e.created_at)}</td>
                <td className="py-3 pr-3">{f.no}. {f.title}</td>
                <td className="py-3 pr-3">{e.owner?.full_name}{e.student?.full_name ? <span className="text-muted"> → {e.student.full_name}</span> : null}</td>
                <td className="py-3 pr-3"><span className="chip bg-paper text-ink">{WHO_LABEL[f.who]}</span></td>
                <td className="py-3"><Link href={`/panel/formlar/kayit/${e.id}`} className="btn-ghost btn-sm">Aç</Link></td>
              </tr>); })}</tbody>
          </table>
        </div>
      ) : <Empty>Kayıt yok.</Empty>}
    </>
  );
}
