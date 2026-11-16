import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ScoreBars from "@/components/ScoreBars";
import Analysis from "@/components/Analysis";
import ShareToggle from "@/components/ShareToggle";
import { createClient, getMe } from "@/lib/supabase/server";
import { TESTS, type TestKey } from "@/lib/tests";
import { trDate } from "@/lib/site";
export const metadata = { title: "Test sonucu" };

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ yeni?: string }> }) {
  const me = await getMe();
  if (!me) redirect("/giris");
  const { id } = await params;
  const supabase = await createClient();
  const { data: r } = await supabase.from("test_results").select("*, profiles(full_name)").eq("id", id).maybeSingle();
  if (!r) notFound();
  const T = TESTS[r.test as TestKey];
  const own = r.user_id === me.id;
  const isNew = (await searchParams).yeni;
  return (
    <section className="wrap flex max-w-4xl flex-col gap-8 py-12">
      <Link href={me.role === "veli" ? "/panel/cocugum" : me.role === "yonetim" ? "/panel/yonetim/ogrenciler" : "/panel/testlerim"} className="text-sm font-bold text-muted hover:text-ink">← Panele dön</Link>
      <div className="flex flex-col gap-2">
        <span className="eyebrow">{T.title} · {trDate(r.created_at)}</span>
        <h1 className="text-4xl md:text-5xl">{own ? (isNew ? `Tebrikler ${me.full_name.split(" ")[0]}, analizin hazır` : "Analizin") : `${(r as any).profiles?.full_name ?? "Öğrenci"} için analiz`}</h1>
      </div>
      <div className="card"><ScoreBars test={r.test} scores={r.scores} /></div>
      {own && (
        <div className="rounded-3xl bg-paper p-6">
          <b className="font-display text-lg">Bu sonucu velinle paylaşmak ister misin?</b>
          <p className="mb-4 mt-1 text-muted">Paylaşırsan aynı analiz veline e-postayla gider ve WhatsApp'tan da gönderebilirsin. Karar senin.</p>
          <ShareToggle kind="test" id={r.id} shared={r.shared} hasParent={!!me.parent_id} />
        </div>
      )}
      <Analysis test={r.test} scores={r.scores} forParent={me.role === "veli"} />
    </section>
  );
}
