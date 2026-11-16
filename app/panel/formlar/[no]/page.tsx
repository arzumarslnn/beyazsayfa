import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ActionForm from "@/components/ActionForm";
import { DynField, Select } from "@/components/Fields";
import { Privacy } from "@/components/PanelTitle";
import { saveForm } from "@/app/actions";
import { createClient, getMe } from "@/lib/supabase/server";
import { formByNo, WHO_LABEL } from "@/lib/forms";

export default async function Page({ params, searchParams }: { params: Promise<{ no: string }>; searchParams: Promise<{ ogrenci?: string }> }) {
  const me = (await getMe())!;
  const f = formByNo(Number((await params).no));
  if (!f) notFound();
  if (f.who !== me.role && me.role !== "yonetim") redirect("/panel/formlar");
  let students: { id: string; full_name: string }[] = [];
  if (f.who === "yonetim") {
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("id,full_name").eq("role", "ogrenci").order("full_name");
    students = data ?? [];
  }
  const pre = (await searchParams).ogrenci;
  return (
    <div className="max-w-3xl">
      <Link href="/panel/formlar" className="text-sm font-bold text-muted hover:text-ink">← Formlar</Link>
      <span className="chip mt-5 bg-paper text-ink">{WHO_LABEL[f.who]} · {f.no}</span>
      <h1 className="mt-3 text-3xl md:text-4xl">{f.title}</h1>
      <p className="mb-6 mt-2 text-lg text-muted">{f.intro}</p>
      <Privacy>{f.who === "yonetim" ? "Bu form yalnızca yönetim tarafından görülür." : "Bu formu yalnızca sen ve koçun görebilir."}</Privacy>
      <div className="card mt-6 md:p-8">
        <ActionForm action={saveForm} submit="Kaydet" className="grid gap-5">
          <input type="hidden" name="_form" value={f.no} />
          {f.who === "yonetim" && (students.length
            ? <Select name="_student" label="Öğrenci" required options={[["", "Öğrenci seçin"], ...students.map((s) => [s.id, s.full_name] as [string, string])]} defaultValue={pre} />
            : <p className="rounded-2xl bg-blush p-4 font-semibold">Henüz kayıtlı öğrenci yok.</p>)}
          {f.fields.map((fl) => <DynField key={fl.k} f={fl} />)}
        </ActionForm>
      </div>
    </div>
  );
}
