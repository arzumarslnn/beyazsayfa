import Link from "next/link";
import { notFound } from "next/navigation";
import ActionForm from "@/components/ActionForm";
import LineChart from "@/components/LineChart";
import { Stat, Empty } from "@/components/PanelTitle";
import { Input, Select, Textarea, Scale, Check } from "@/components/Fields";
import { addAbc, upsertDaily, setProgramStatus, deleteAbc } from "@/app/actions";
import { createClient, getMe } from "@/lib/supabase/server";
import { ANTECEDENTS, CONSEQUENCES, FUNCTIONS, analyzeAbc, behaviorByKey, progress } from "@/lib/behaviors";
import { COURSES } from "@/lib/catalog";
import { trDate } from "@/lib/site";

function PlanBlock({ title, items, extra, tint }: { title: string; items: string[]; extra?: string[]; tint: string }) {
  return (
    <div className={`${tint} rounded-3xl p-6`}>
      <b className="font-display text-lg">{title}</b>
      <ul className="mt-2 grid gap-2">
        {items.map((x) => <li key={x} className="flex gap-2"><span>•</span><span>{x}</span></li>)}
        {extra?.map((x) => <li key={x} className="flex gap-2"><span>★</span><span>{x} <span className="chip ml-1 bg-bg/70 text-ink">kayıtlarınıza göre</span></span></li>)}
      </ul>
    </div>
  );
}

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ yeni?: string }> }) {
  const me = (await getMe())!;
  const { id } = await params;
  const supabase = await createClient();
  const { data: p } = await supabase.from("behavior_programs").select("*").eq("id", id).maybeSingle();
  if (!p) notFound();
  const [{ data: abc }, { data: daily }] = await Promise.all([
    supabase.from("abc_logs").select("*").eq("program_id", id).order("occurred_at", { ascending: false }),
    supabase.from("daily_logs").select("*").eq("program_id", id).order("day", { ascending: true }),
  ]);
  const b = behaviorByKey(p.behavior_key)!;
  const a = analyzeAbc(abc ?? []);
  const pr = progress(daily ?? []);
  const fn = a.fn ? FUNCTIONS[a.fn] : null;
  const course = COURSES.find((c) => c.behaviorKey === b.key);
  const owner = p.owner === me.id;
  const today = new Date(Date.now() + 3 * 36e5).toISOString().slice(0, 10);
  const todayLog = (daily ?? []).find((d) => d.day === today);

  // Son 28 gün grafiği
  const days: string[] = [];
  for (let i = 27; i >= 0; i--) days.push(new Date(Date.now() + 3 * 36e5 - i * 864e5).toISOString().slice(0, 10));
  const firstDay = (daily ?? [])[0]?.day;
  const shown = firstDay ? days.filter((d) => d >= firstDay) : [];
  const byDay = new Map((daily ?? []).map((d) => [d.day, d]));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href={me.role === "yonetim" ? "/panel/yonetim/programlar" : "/panel/davranis"} className="text-sm font-bold text-muted hover:text-ink">← Programlar</Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div><span className="eyebrow">{p.child_name}{p.child_age ? `, ${p.child_age} yaş` : ""} · {trDate(p.start_date)} başlangıç</span><h1 className="mt-2 text-3xl md:text-4xl">{b.title}</h1></div>
          {owner && (
            <div className="flex gap-2">
              {p.status === "aktif"
                ? <><form action={setProgramStatus.bind(null, id, "tamamlandi")}><button className="btn-ghost btn-sm">Tamamlandı olarak işaretle</button></form><form action={setProgramStatus.bind(null, id, "durduruldu")}><button className="btn-ghost btn-sm">Durdur</button></form></>
                : <form action={setProgramStatus.bind(null, id, "aktif")}><button className="btn-primary btn-sm">Yeniden başlat</button></form>}
            </div>
          )}
        </div>
      </div>

      {(await searchParams).yeni && (
        <div className="rounded-3xl bg-butter p-6">
          <b className="font-display text-xl">Programınız hazır. Şöyle ilerleyin:</b>
          <ol className="mt-2 grid list-decimal gap-1 pl-5">
            <li>İlk hafta davranış her olduğunda bir <b>ABC kaydı</b> ekleyin. Planı henüz değiştirmeyin, sadece gözlemleyin.</li>
            <li>Her akşam <b>günün kaydını</b> girin: kaç kez problem davranış, kaç kez olumlu davranış oldu?</li>
            <li>3 ABC kaydından sonra plan, kayıtlarınıza göre kişiselleşir. Uygulamaya başlayın ve grafiği izleyin.</li>
          </ol>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat n={pr.days} label="günlük kayıt" tint="bg-paper" />
        <Stat n={a.n} label="ABC kaydı" tint="bg-paper" />
        <Stat n={pr.change == null ? "—" : `${pr.change > 0 ? "+" : ""}${pr.change}%`} label="problem davranışta değişim" tint={pr.change != null && pr.change < 0 ? "bg-sage" : "bg-paper"} />
        <Stat n={pr.days ? `${pr.applied}/${pr.days}` : "—"} label="planın uygulandığı gün" tint="bg-paper" />
      </div>

      <div className="card">
        <h2 className="text-2xl">Gelişim</h2>
        {shown.length >= 2 ? (
          <>
            <LineChart labels={shown.map((d) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }))} series={[
              { name: "Problem davranış", color: "rgb(var(--accent))", values: shown.map((d) => byDay.get(d)?.problem_count ?? null) },
              { name: "Olumlu davranış", color: "rgb(var(--action))", values: shown.map((d) => byDay.get(d)?.positive_count ?? null) },
            ]} />
            {pr.change != null && <p className="mt-3 text-muted">İlk günlerde günde ortalama <b className="text-ink">{pr.base.toFixed(1)}</b> problem davranış vardı, son günlerde <b className="text-ink">{pr.now.toFixed(1)}</b>. Olumlu davranış {pr.posBase.toFixed(1)} → <b className="text-ink">{pr.posNow.toFixed(1)}</b>.</p>}
          </>
        ) : <p className="mt-2 text-muted">Grafik, en az iki günlük kayıttan sonra görünür.</p>}
      </div>

      {owner && p.status === "aktif" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="text-2xl">Günün kaydı</h2>
            <p className="mb-4 mt-1 text-muted">{todayLog ? "Bugünü kaydettiniz, isterseniz güncelleyebilirsiniz." : "Gün sonunda bir dakikanızı alır."}</p>
            <ActionForm action={upsertDaily} submit="Kaydet">
              <input type="hidden" name="program_id" value={id} />
              <Input name="day" label="Tarih" type="date" defaultValue={today} max={today} required />
              <div className="grid grid-cols-2 gap-4">
                <Input name="problem_count" label="Problem davranış sayısı" type="number" min={0} defaultValue={todayLog?.problem_count ?? 0} />
                <Input name="positive_count" label="Olumlu davranış sayısı" type="number" min={0} defaultValue={todayLog?.positive_count ?? 0} hint={`“${p.target_behavior}”`} />
              </div>
              <Scale name="parent_calm" label="Bugün ben ne kadar sakin kalabildim?" defaultValue={todayLog?.parent_calm ? String(todayLog.parent_calm) : undefined} />
              <Check name="plan_applied" defaultChecked={todayLog?.plan_applied}>Bugün plandaki adımları uyguladım</Check>
              <Textarea name="note" label="Not" rows={2} defaultValue={todayLog?.note ?? ""} />
            </ActionForm>
          </div>
          <div className="card">
            <h2 className="text-2xl">ABC kaydı ekle</h2>
            <p className="mb-4 mt-1 text-muted">Davranış olur olmaz ya da aynı gün içinde yazın.</p>
            <ActionForm action={addAbc} submit="Kaydı ekle" resetOnOk>
              <input type="hidden" name="program_id" value={id} />
              <div className="grid grid-cols-2 gap-4">
                <Input name="date" label="Tarih" type="date" defaultValue={today} max={today} />
                <Input name="time" label="Saat" type="time" />
              </div>
              <Input name="setting" label="Nerede, kimlerle?" placeholder="Salonda, kardeşiyle" />
              <Select name="antecedent" label="A · Hemen önce ne oldu?" required options={[["", "Seçin"], ...ANTECEDENTS.map((x) => [x.k, x.l] as [string, string])]} />
              <Textarea name="behavior" label="B · Çocuk tam olarak ne yaptı?" required rows={2} />
              <Select name="consequence" label="C · Hemen ardından ne oldu?" required options={[["", "Seçin"], ...CONSEQUENCES.map((x) => [x.k, x.l] as [string, string])]} />
              <div className="grid grid-cols-2 gap-4">
                <Select name="intensity" label="Şiddeti" options={[["", "—"], ["1", "1 · çok hafif"], ["2", "2"], ["3", "3 · orta"], ["4", "4"], ["5", "5 · çok şiddetli"]]} />
                <Input name="duration_min" label="Süresi (dk)" type="number" min={0} />
              </div>
            </ActionForm>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-2xl">Kayıtlarınız ne söylüyor?</h2>
        {a.n < 3 ? (
          <p className="mt-2 text-muted">En az 3 ABC kaydından sonra burada davranışın olası işlevini ve örüntüleri göreceksiniz. Şu an {a.n} kayıt var.</p>
        ) : (
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            {fn && (
              <div className="rounded-3xl bg-butter p-6 lg:col-span-2">
                <span className="eyebrow text-ink">Olası işlev</span>
                <h3 className="mt-1">{fn.name}</h3>
                <p className="mt-2 max-w-prose">{fn.explain}</p>
                <p className="mt-2 text-sm text-ink">Bu bir ön değerlendirmedir; kesin bir tanı değildir. Koçunuzla birlikte değerlendirebilirsiniz.</p>
              </div>
            )}
            <div><b>En sık öncüller</b><ul className="mt-2 grid gap-1.5">{a.ant.slice(0, 3).map((x) => <li key={x.label} className="flex justify-between gap-3 rounded-xl bg-paper px-3 py-2"><span>{x.label}</span><b className="tabular-nums">{x.n}</b></li>)}</ul></div>
            <div><b>En sık sonuçlar</b><ul className="mt-2 grid gap-1.5">{a.con.slice(0, 3).map((x) => <li key={x.label} className="flex justify-between gap-3 rounded-xl bg-paper px-3 py-2"><span>{x.label}</span><b className="tabular-nums">{x.n}</b></li>)}</ul></div>
            <div><b>Günün hangi saatinde?</b><p className="mt-2">{a.times.map(([t, n]) => `${t}: ${n}`).join(" · ")}</p></div>
            <div><b>Sonuçlarınız</b><p className="mt-2">{a.n} kaydın <b>{a.risky}</b> tanesinde davranış, farkında olmadan güçlendirilmiş olabilir (istenen verildi, görev ertelendi, uzun konuşma ya da bağırma). <b>{a.good}</b> kayıtta plana uygun bir tepki verdiniz.</p></div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="text-2xl">Uygulama planınız</h2><span className="text-muted">Hedef: <b className="text-ink">{p.target_behavior}</b></span></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <PlanBlock title="1. Önleme: davranıştan önce" items={b.prevent} extra={fn?.prevent} tint="bg-sky" />
          <PlanBlock title="2. Öğretme: yerine ne yapacak?" items={b.teach} tint="bg-sage" />
          <PlanBlock title="3. Pekiştirme: olumlu davranışı büyütmek" items={b.reinforce} tint="bg-butter" />
          <PlanBlock title="4. Davranış olduğunda" items={b.respond} extra={fn?.respond} tint="bg-blush" />
        </div>
        {course && <p className="mt-5 text-muted">Bu planın her adımı <Link href={`/ebeveyn-egitimi/${course.key}`} className="font-bold text-action">{course.title}</Link> eğitiminde ayrıntılı anlatılıyor.</p>}
      </div>

      <div className="card">
        <h2 className="text-2xl">ABC kayıtları</h2>
        {abc?.length ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead><tr className="border-b border-line text-xs uppercase tracking-wide text-muted"><th className="py-2 pr-3">Ne zaman</th><th className="py-2 pr-3">A · Önce</th><th className="py-2 pr-3">B · Davranış</th><th className="py-2 pr-3">C · Sonra</th><th className="py-2 pr-3">Şiddet</th><th /></tr></thead>
              <tbody>
                {abc.map((l) => (
                  <tr key={l.id} className="border-b border-line align-top">
                    <td className="py-3 pr-3 text-muted">{new Date(l.occurred_at).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" })}{l.setting ? <><br />{l.setting}</> : null}</td>
                    <td className="py-3 pr-3">{ANTECEDENTS.find((x) => x.k === l.antecedent)?.l}</td>
                    <td className="py-3 pr-3">{l.behavior}</td>
                    <td className="py-3 pr-3">{CONSEQUENCES.find((x) => x.k === l.consequence)?.l}</td>
                    <td className="py-3 pr-3 tabular-nums">{l.intensity ?? "—"}</td>
                    <td className="py-3">{owner && <form action={deleteAbc.bind(null, l.id, id)}><button className="text-sm text-muted hover:text-bad">Sil</button></form>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="mt-3"><Empty>Henüz ABC kaydı yok.</Empty></div>}
      </div>
    </div>
  );
}
