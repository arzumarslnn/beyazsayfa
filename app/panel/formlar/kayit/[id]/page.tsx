import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, getMe } from "@/lib/supabase/server";
import { formByNo, WHO_LABEL } from "@/lib/forms";
import { trDate } from "@/lib/site";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const me = (await getMe())!;
  const supabase = await createClient();
  const { data: e } = await supabase.from("form_entries").select("*, owner:profiles!form_entries_user_id_fkey(full_name), student:profiles!form_entries_student_id_fkey(full_name)").eq("id", (await params).id).maybeSingle();
  if (!e) notFound();
  const f = formByNo(e.form_no)!;
  return (
    <div className="max-w-3xl">
      <Link href={me.role === "yonetim" ? "/panel/yonetim/formlar" : "/panel/formlar"} className="text-sm font-bold text-muted hover:text-ink">← Geri</Link>
      <span className="chip mt-5 bg-paper text-ink">{WHO_LABEL[f.who]} · {f.no}</span>
      <h1 className="mt-3 text-3xl md:text-4xl">{f.title}</h1>
      <p className="mt-2 text-muted">{trDate(e.created_at)} · Dolduran: {(e as any).owner?.full_name}{(e as any).student?.full_name ? ` · Öğrenci: ${(e as any).student.full_name}` : ""}</p>
      <dl className="card mt-6 grid gap-5 md:p-8">
        {f.fields.map((fl) => (
          <div key={fl.k}><dt className="font-bold">{fl.label}</dt><dd className="mt-1 whitespace-pre-wrap text-ink">{e.data?.[fl.k] ? (fl.type === "scale" ? `${e.data[fl.k]} / 5` : e.data[fl.k]) : "—"}</dd></div>
        ))}
      </dl>
    </div>
  );
}
