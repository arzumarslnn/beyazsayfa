"use client";
import { useState, useTransition } from "react";
import { shareItem } from "@/app/actions";

export default function ShareToggle({ kind, id, shared, hasParent, compact = false }: { kind: "test" | "deneme"; id: string; shared: boolean; hasParent: boolean; compact?: boolean }) {
  const [on, setOn] = useState(shared);
  const [msg, setMsg] = useState("");
  const [wa, setWa] = useState<string | null>(null);
  const [pending, start] = useTransition();
  if (!hasParent) return compact ? <span className="text-sm text-muted">Veli bağlı değil</span> : <p className="text-muted">Hesabına bağlı bir veli yok. <a href="/panel/hesap" className="font-bold text-action">Velini bağla</a>, sonra sonuçlarını paylaşabilirsin.</p>;
  const toggle = () => start(async () => {
    const r = await shareItem(kind, id, !on);
    if (r?.ok) { setOn(!on); setMsg(r.msg || ""); setWa(r.data?.wa ?? null); } else setMsg(r?.error || "Bir sorun oluştu.");
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={toggle} disabled={pending} className={`${on ? "btn-ghost" : "btn-primary"} ${compact ? "btn-sm" : ""}`}>
          {pending ? "…" : on ? "Paylaşımı kaldır" : "Velimle paylaş"}
        </button>
        <span className={`chip ${on ? "bg-sage text-ink" : "bg-paper text-muted"}`}>{on ? "Velinle paylaşıldı" : "Sadece sende ve koçunda"}</span>
      </div>
      {msg && <p className="text-sm font-semibold">{msg}</p>}
      {wa && <a href={wa} target="_blank" rel="noopener" className="btn btn-sm self-start bg-[#25D366] text-white">WhatsApp'tan veline gönder</a>}
    </div>
  );
}
