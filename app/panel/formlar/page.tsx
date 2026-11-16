import Link from "next/link";
import PanelTitle, { Privacy } from "@/components/PanelTitle";
import { createClient, getMe } from "@/lib/supabase/server";
import { FORMS, WHO_LABEL, formByNo } from "@/lib/forms";
import { trDate } from "@/lib/site";

export default async function Page({ searchParams }: { searchParams: Promise<{ kaydedildi?: string }> }) {
  const me = (await getMe())!;
  const supabase = await createClient();
  const { data: mine } = await supabase.from("form_entries").select("id,form_no,created_at,student_id").eq("user_id", me.id).order("created_at", { ascending: false });
  const list = FORMS.filter((f) => f.who === me.role);
  const saved = Number((await searchParams).kaydedildi);
  const title = me.role === "yonetim" ? "Koç formları" : me.role === "veli" ? "Veli formlarım" : "Formlarım";
  return (
    <>
      <PanelTitle title={title} lead={me.role === "yonetim" ? "Öğrenci seçerek koç formlarını doldurun. Bu formları yalnızca yönetim görür." : "Formları istediğin zaman açıp doldurabilir ve kaydedebilirsin."} />
      {saved > 0 && <p className="mb-5 rounded-2xl bg-sage px-4 py-3 font-semibold">“{formByNo(saved)?.title}” kaydedildi.</p>}
      <Privacy>{me.role === "yonetim" ? "Koç formları öğrenci ve veliler tarafından görülmez." : me.role === "veli" ? "Kaydettiğiniz formları yalnızca siz ve koçunuz görebilir. Çocuğunuz göremez." : "Kaydettiğin formları yalnızca sen ve koçun görebilir. Velin göremez."}</Privacy>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((f) => {
          const done = (mine ?? []).filter((m) => m.form_no === f.no);
          return (
            <div key={f.no} className="card flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2"><span className="chip bg-paper text-ink">{WHO_LABEL[f.who]} · {f.no}</span>{done.length > 0 && <span className="chip bg-sage text-ink">{done.length} kayıt</span>}</div>
              <h2 className="text-xl">{f.title}</h2>
              <p className="text-muted">{f.intro}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                <Link href={`/panel/formlar/${f.no}`} className="btn-primary btn-sm">{done.length && !f.repeatable ? "Yeniden doldur" : "Doldur"}</Link>
                {done.slice(0, 3).map((d) => <Link key={d.id} href={`/panel/formlar/kayit/${d.id}`} className="btn-ghost btn-sm">{trDate(d.created_at)}</Link>)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
