"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WORK_HOURS, BOOK_AHEAD_DAYS, slotsFor, istanbulToday } from "@/lib/slots";

const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const ymd = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

/** Aylık randevu takvimi: dolu ve boş saatleri gösterir, seçimi gizli alanlara yazar. */
export default function AppointmentCalendar({ refreshKey = 0 }: { refreshKey?: number }) {
  const today = istanbulToday();
  const [ty, tm] = today.split("-").map(Number);
  const [view, setView] = useState({ y: ty, m: tm - 1 });
  const [busy, setBusy] = useState<Record<string, Set<string>>>({});
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const maxDay = useMemo(() => istanbulToday(new Date(Date.now() + BOOK_AHEAD_DAYS * 864e5)), []);
  const first = ymd(view.y, view.m, 1);
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const last = ymd(view.y, view.m, daysInMonth);

  useEffect(() => {
    let off = false;
    setLoading(true);
    createClient().rpc("busy_slots", { p_from: first, p_to: last }).then(({ data }) => {
      if (off) return;
      const map: Record<string, Set<string>> = {};
      (data as { day: string; slot: string }[] | null)?.forEach((r) => { (map[r.day] ??= new Set()).add(r.slot); });
      setBusy(map);
      setLoading(false);
    });
    return () => { off = true; };
  }, [first, last, refreshKey]);

  useEffect(() => { setSlot(null); }, [refreshKey]);

  const freeCount = (d: string) => {
    if (d > maxDay) return 0;
    const b = busy[d];
    if (b?.has("*")) return 0;
    return slotsFor(d).filter((s) => !b?.has(s)).length;
  };

  const lead = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => ymd(view.y, view.m, i + 1))];
  const monthName = new Date(view.y, view.m, 15).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  const canPrev = first > ymd(ty, tm - 1, 1);
  const canNext = last < maxDay;
  const move = (d: number) => { const m = view.m + d; setView({ y: view.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 }); };

  const daySlots = day ? (WORK_HOURS[new Date(`${day}T12:00:00+03:00`).getUTCDay()] ?? []) : [];
  const available = day ? slotsFor(day) : [];

  return (
    <div className="grid gap-5">
      <input type="hidden" name="pref_date" value={slot && day ? day : ""} />
      <input type="hidden" name="slot_time" value={slot ?? ""} />
      <div className="rounded-3xl border border-line bg-paper p-5">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={() => move(-1)} disabled={!canPrev} className="btn-ghost btn-sm" aria-label="Önceki ay">←</button>
          <b className="font-display text-xl capitalize">{monthName}</b>
          <button type="button" onClick={() => move(1)} disabled={!canNext} className="btn-ghost btn-sm" aria-label="Sonraki ay">→</button>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-muted">{DAYS.map((d) => <span key={d}>{d}</span>)}</div>
        <div className={`mt-2 grid grid-cols-7 gap-1.5 ${loading ? "opacity-50" : ""}`}>
          {cells.map((d, i) => {
            if (!d) return <span key={i} />;
            const n = freeCount(d);
            const past = d < today;
            const closed = (WORK_HOURS[new Date(`${d}T12:00:00+03:00`).getUTCDay()] ?? []).length === 0 || d > maxDay;
            const full = !past && !closed && n === 0;
            const sel = d === day;
            return (
              <button key={d} type="button" disabled={past || closed || full} onClick={() => { setDay(d); setSlot(null); }}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-bold transition
                  ${sel ? "bg-action text-action-ink" : past || closed ? "text-muted/50" : full ? "bg-blush/60 text-ink/50 line-through" : "bg-sage/60 hover:bg-sage"}`}>
                {Number(d.slice(8))}
                {!past && !closed && <span className={`text-[10px] font-semibold ${sel ? "text-action-ink" : "text-muted"}`}>{full ? "dolu" : `${n} boş`}</span>}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-muted">
          <span><i className="mr-1.5 inline-block h-3 w-3 rounded bg-sage align-middle" />Boş saat var</span>
          <span><i className="mr-1.5 inline-block h-3 w-3 rounded bg-blush align-middle" />Tamamen dolu</span>
          <span>Pazar günleri kapalıyız</span>
        </div>
      </div>

      {day && (
        <div className="rounded-3xl border border-line bg-paper p-5">
          <b className="font-display text-lg">{new Date(`${day}T12:00:00+03:00`).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}</b>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {daySlots.map((s) => {
              const taken = busy[day]?.has(s) || busy[day]?.has("*");
              const gone = !available.includes(s);
              const sel = s === slot;
              return (
                <button key={s} type="button" disabled={taken || gone} onClick={() => setSlot(s)}
                  className={`rounded-xl border-2 py-2.5 text-sm font-bold tabular-nums transition
                    ${sel ? "border-action bg-action text-action-ink" : taken ? "border-transparent bg-blush/50 text-ink/40" : gone ? "border-transparent bg-bg text-muted/50" : "border-line hover:border-action"}`}>
                  {s}<span className="block text-[10px] font-semibold">{taken ? "dolu" : gone ? "geçti" : sel ? "seçildi" : "boş"}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <p className={`rounded-2xl px-4 py-3 font-semibold ${slot ? "bg-sage" : "bg-bg text-muted"}`}>
        {slot && day ? `Seçiminiz: ${new Date(`${day}T12:00:00+03:00`).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })}, saat ${slot}` : "Takvimden bir gün ve boş bir saat seçin."}
      </p>
    </div>
  );
}
