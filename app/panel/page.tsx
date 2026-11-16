import Link from "next/link";
import PanelTitle, { Stat, Privacy, Empty } from "@/components/PanelTitle";
import { createClient, getMe } from "@/lib/supabase/server";
import { behaviorByKey, progress } from "@/lib/behaviors";
import { formByNo } from "@/lib/forms";
import { TESTS, type TestKey } from "@/lib/tests";
import { tl, trDate } from "@/lib/site";

export default async function Page() {
  const me = (await getMe())!;
  const supabase = await createClient();
  const first = me.full_name.split(" ")[0] || "";

  if (me.role === "ogrenci") {
    const [{ data: res }, { data: forms }, { count: dn }] = await Promise.all([
      supabase.from("test_results").select("test").eq("user_id", me.id),
      supabase.from("form_entries").select("form_no").eq("user_id", me.id),
      supabase.from("denemeler").select("id", { count: "exact", head: true }).eq("user_id", me.id),
    ]);
    const hasT = (t: string) => res?.some((r) => r.test === t);
    const hasF = (n: number) => forms?.some((f) => f.form_no === n);
    const steps: [boolean, string, string][] = [
      [!!hasT("mizac"), "Mizaç testini çöz", "/testler/mizac"],
      [!!hasT("ogrenme"), "Öğrenme stili testini çöz", "/testler/ogrenme"],
      [!!hasF(3), "İlk Öğrenci Görüşme Formu'nu doldur", "/panel/formlar/3"],
      [!!hasF(5), "Hedef Belirleme Formu'nu doldur", "/panel/formlar/5"],
      [!!hasF(9), "Meslek Yönelim Formu'nu doldur", "/panel/formlar/9"],
      [!!me.parent_id, "Hesabını velinle bağla (isteğe bağlı)", "/panel/hesap"],
    ];
    return (
      <>
        <PanelTitle title={`Merhaba ${first}`} lead="Burası senin alanın. Neyi velinle paylaşacağına sen karar verirsin." />
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat n={res?.length ?? 0} label="test sonucu" tint="bg-blush" />
          <Stat n={forms?.length ?? 0} label="doldurulan form" tint="bg-sky" />
          <Stat n={dn ?? 0} label="deneme kaydı" tint="bg-butter" />
        </div>
        <div className="card mt-6">
          <h2 className="text-2xl">Sıradaki adımların</h2>
          <ul className="mt-4 grid gap-2">
            {steps.map(([done, t, href]) => (
              <li key={t} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
                <span className={`font-semibold ${done ? "text-muted line-through" : ""}`}>{done ? "✓" : "○"} {t}</span>
                {done ? <span className="chip bg-sage text-ink">Tamam</span> : <Link href={href} className="btn-primary btn-sm">Başla</Link>}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6"><Privacy>Doldurduğun formları yalnızca sen ve koçun görür. Velin göremez.</Privacy></div>
      </>
    );
  }

  if (me.role === "veli") {
    const since = new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10);
    const [{ data: programs }, { data: daily }, { data: child }, { count: unread }, { data: orders }] = await Promise.all([
      supabase.from("behavior_programs").select("*").eq("owner", me.id).eq("status", "aktif").order("created_at", { ascending: false }),
      supabase.from("daily_logs").select("program_id,day,problem_count,positive_count,plan_applied").eq("owner", me.id).gte("day", since),
      supabase.from("profiles").select("id,full_name").eq("parent_id", me.id),
      supabase.from("messages").select("id", { count: "exact", head: true }).eq("to_user", me.id).eq("read", false),
      supabase.from("orders").select("product_title").eq("user_id", me.id).eq("status", "odendi"),
    ]);
    const today = new Date().toISOString().slice(0, 10);
    return (
      <>
        <PanelTitle title={`Hoş geldiniz ${first}`} lead="Bugün evde nasıl geçti? Günlük kaydınız bir dakikanızı alır." />
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat n={programs?.length ?? 0} label="aktif davranış programı" tint="bg-sage" />
          <Stat n={unread ?? 0} label="okunmamış bildirim" tint="bg-blush" />
          <Stat n={orders?.length ?? 0} label="eğitim" tint="bg-butter" />
        </div>
        <div className="card mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl">Davranış programlarınız</h2><Link href="/panel/davranis/yeni" className="btn-primary btn-sm">Yeni program</Link></div>
          {programs?.length ? (
            <ul className="mt-4 grid gap-3">
              {programs.map((p) => {
                const b = behaviorByKey(p.behavior_key);
                const d = (daily ?? []).filter((x) => x.program_id === p.id);
                const pr = progress(d);
                const doneToday = d.some((x) => x.day === today);
                return (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-4">
                    <div><b className="font-display text-lg">{b?.title}</b> <span className="text-muted">· {p.child_name}</span>
                      <p className="text-sm text-muted">Son 14 günde {pr.days} günlük kayıt{pr.change != null ? ` · değişim %${pr.change > 0 ? "+" : ""}${pr.change}` : ""}</p></div>
                    <Link href={`/panel/davranis/${p.id}`} className={doneToday ? "btn-ghost btn-sm" : "btn-primary btn-sm"}>{doneToday ? "Programı aç" : "Bugünü kaydet"}</Link>
                  </li>
                );
              })}
            </ul>
          ) : <div className="mt-4"><Empty>Henüz bir programınız yok. Sizi en çok zorlayan bir davranışla başlayın.</Empty></div>}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="card">
            <h2 className="text-2xl">Çocuğunuz</h2>
            {child?.length ? <p className="mt-2">{child.map((c) => c.full_name).join(", ")} hesabınıza bağlı. <Link href="/panel/cocugum" className="font-bold text-action">Paylaştıklarını gör →</Link></p>
              : <p className="mt-2 text-muted">Hesabınıza bağlı öğrenci yok. Çocuğunuz üye olurken sizin e-postanızı yazarsa ya da kendi hesabından sizi eklerse bağlantı kurulur.</p>}
          </div>
          <div className="card">
            <h2 className="text-2xl">Formlarınız</h2>
            <p className="mt-2 text-muted">Veli Ön Bilgilendirme Formu, koçumuzun sizi ve çocuğunuzu tanımasına yardımcı olur.</p>
            <Link href="/panel/formlar" className="mt-3 inline-block font-bold text-action">Formlara git →</Link>
          </div>
        </div>
      </>
    );
  }

  // Yönetim
  const [{ count: ogr }, { count: veli }, { count: appts }, { data: paid }, { data: recentForms }, { data: recentTests }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "ogrenci"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "veli"),
    supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "Yeni"),
    supabase.from("orders").select("amount").eq("status", "odendi"),
    supabase.from("form_entries").select("id,form_no,created_at,profiles!form_entries_user_id_fkey(full_name)").order("created_at", { ascending: false }).limit(6),
    supabase.from("test_results").select("id,test,created_at,profiles(full_name)").order("created_at", { ascending: false }).limit(6),
  ]);
  const feed = [
    ...(recentForms ?? []).map((f: any) => ({ d: f.created_at, t: `${f.profiles?.full_name ?? "?"} · ${formByNo(f.form_no)?.title}`, href: `/panel/formlar/kayit/${f.id}` })),
    ...(recentTests ?? []).map((r: any) => ({ d: r.created_at, t: `${r.profiles?.full_name ?? "?"} · ${TESTS[r.test as TestKey].title}`, href: `/testler/sonuc/${r.id}` })),
  ].sort((a, b) => b.d.localeCompare(a.d)).slice(0, 8);
  return (
    <>
      <PanelTitle title="Genel bakış" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat n={ogr ?? 0} label="öğrenci" tint="bg-blush" />
        <Stat n={veli ?? 0} label="veli" tint="bg-sky" />
        <Stat n={appts ?? 0} label="yeni randevu talebi" tint="bg-butter" />
        <Stat n={tl((paid ?? []).reduce((a, o) => a + Number(o.amount), 0))} label={`${paid?.length ?? 0} ödenmiş sipariş`} tint="bg-sage" />
      </div>
      <div className="card mt-6">
        <h2 className="text-2xl">Son hareketler</h2>
        {feed.length ? (
          <ul className="mt-4 divide-y divide-line">
            {feed.map((x) => (<li key={x.href} className="flex flex-wrap justify-between gap-2 py-3"><Link href={x.href} className="font-semibold hover:underline">{x.t}</Link><span className="text-sm text-muted">{trDate(x.d)}</span></li>))}
          </ul>
        ) : <p className="mt-3 text-muted">Henüz hareket yok.</p>}
      </div>
    </>
  );
}
