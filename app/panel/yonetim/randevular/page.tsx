import PanelTitle, { Empty } from "@/components/PanelTitle";
import StatusButtons from "@/components/StatusButtons";
import { setAppointmentStatus } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { toWaNumber, trDate } from "@/lib/site";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(200);
  return (
    <>
      <PanelTitle title="Randevu talepleri" lead="Durumu değiştirmek için ilgili düğmeye tıklayın." />
      {data?.length ? (
        <div className="grid gap-3">
          {data.map((a) => (
            <div key={a.id} className={`card grid gap-3 md:grid-cols-[1.2fr_1fr_auto] ${a.status === "Yeni" ? "ring-2 ring-accent" : ""}`}>
              <div><b className="font-display text-xl">{a.name}</b> <span className="text-muted">· {a.who}</span>
                <p className="text-[15px]">{a.phone}{a.email ? ` · ${a.email}` : ""}</p>
                <a href={`https://wa.me/${toWaNumber(a.phone)}`} target="_blank" rel="noopener" className="text-sm font-bold text-action">WhatsApp'tan yaz →</a></div>
              <div className="text-[15px]"><b>{a.topic}</b><p className="text-muted">Tercih: {a.pref_date ? trDate(a.pref_date) : "—"} · {a.time_slot}</p>{a.note && <p className="mt-1">{a.note}</p>}<p className="mt-1 text-xs text-muted">Talep: {trDate(a.created_at)}</p></div>
              <StatusButtons options={["Yeni", "Arandı", "Randevu verildi", "Kapandı"]} current={a.status} onSet={setAppointmentStatus.bind(null, a.id)} />
            </div>
          ))}
        </div>
      ) : <Empty>Henüz randevu talebi yok.</Empty>}
    </>
  );
}
