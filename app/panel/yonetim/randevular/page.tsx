import PanelTitle, { Empty } from "@/components/PanelTitle";
import StatusButtons from "@/components/StatusButtons";
import ActionForm from "@/components/ActionForm";
import { Input } from "@/components/Fields";
import { setAppointmentStatus, addSlotBlock, deleteSlotBlock } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { toWaNumber, trDate } from "@/lib/site";
import { istanbulToday } from "@/lib/slots";

export default async function Page() {
  const supabase = await createClient();
  const today = istanbulToday();
  const [{ data }, { data: blocks }] = await Promise.all([
    supabase.from("appointments").select("*").order("pref_date", { ascending: true, nullsFirst: false }).order("slot_time").limit(300),
    supabase.from("slot_blocks").select("*").gte("day", today).order("day"),
  ]);
  const upcoming = (data ?? []).filter((a) => !a.pref_date || a.pref_date >= today);
  const past = (data ?? []).filter((a) => a.pref_date && a.pref_date < today).reverse();
  const Row = (a: any) => (
    <div key={a.id} className={`card grid gap-3 bg-paper md:grid-cols-[0.6fr_1.2fr_1fr_auto] ${a.status === "Yeni" ? "ring-2 ring-accent" : ""}`}>
      <div><b className="font-display text-2xl tabular-nums">{a.slot_time || a.time_slot || "—"}</b><p className="text-sm text-muted">{a.pref_date ? trDate(a.pref_date) : "Tarih yok"}</p></div>
      <div><b className="font-display text-xl">{a.name}</b> <span className="text-muted">· {a.who}</span>
        <p className="text-[15px]">{a.phone}{a.email ? ` · ${a.email}` : ""}</p>
        <a href={`https://wa.me/${toWaNumber(a.phone)}`} target="_blank" rel="noopener" className="text-sm font-bold text-action">WhatsApp'tan yaz →</a></div>
      <div className="text-[15px]"><b>{a.topic}</b>{a.note && <p className="mt-1">{a.note}</p>}</div>
      <StatusButtons options={["Yeni", "Arandı", "Randevu verildi", "Kapandı"]} current={a.status} onSet={setAppointmentStatus.bind(null, a.id)} />
    </div>
  );
  return (
    <>
      <PanelTitle title="Randevular" lead="Sitedeki takvimden alınan randevular. “Kapandı” olarak işaretlenen randevunun saati yeniden boşa çıkar." />
      <div className="grid gap-3">{upcoming.length ? upcoming.map(Row) : <Empty>Yaklaşan randevu yok.</Empty>}</div>

      <div className="card mt-8 bg-paper md:p-8">
        <h2 className="text-2xl">Takvimde gün veya saat kapat</h2>
        <p className="mb-4 mt-1 text-muted">Tatil, izin ya da dışarıdan aldığınız randevular için. Saat boş bırakılırsa bütün gün kapanır.</p>
        <ActionForm action={addSlotBlock} submit="Kapat" resetOnOk className="grid gap-4 md:grid-cols-[1fr_0.7fr_1.3fr_auto] md:items-end">
          <Input name="day" label="Tarih" type="date" required min={today} />
          <Input name="slot" label="Saat" placeholder="14:00" pattern="\d{2}:\d{2}" />
          <Input name="note" label="Not" placeholder="İzin" />
        </ActionForm>
        {blocks?.length ? (
          <ul className="mt-5 grid gap-2">{blocks.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-bg px-4 py-3">
              <span><b>{trDate(b.day)}</b> · {b.slot || "bütün gün"}{b.note ? ` · ${b.note}` : ""}</span>
              <form action={deleteSlotBlock.bind(null, b.id)}><button className="text-sm font-semibold text-muted hover:text-bad">Kaldır</button></form>
            </li>))}</ul>
        ) : null}
      </div>

      {past.length > 0 && (<><h2 className="mb-4 mt-10 text-2xl">Geçmiş randevular</h2><div className="grid gap-3 opacity-80">{past.slice(0, 30).map(Row)}</div></>)}
    </>
  );
}
