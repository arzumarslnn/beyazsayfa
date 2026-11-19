"use client";
import { useActionState, useState } from "react";
import { submitTestimonial, type ActionState } from "@/app/actions";
import { createClient } from "@/lib/supabase/client";
import { Textarea, Input, Check } from "./Fields";

/** Yazılı ya da video deneyim gönderme. Video dosyası doğrudan depoya yüklenir (en fazla 100 MB). */
export default function TestimonialForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitTestimonial, undefined);
  const [mode, setMode] = useState<"yazi" | "dosya" | "link">("yazi");
  const [path, setPath] = useState("");
  const [up, setUp] = useState<"" | "yukleniyor" | "tamam" | "hata">("");
  if (state?.ok) return <p className="rounded-2xl bg-sage px-5 py-4 text-lg font-semibold">{state.msg}</p>;
  const upload = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) { setUp("hata"); return; }
    setUp("yukleniyor");
    const ext = (file.name.split(".").pop() || "mp4").toLowerCase().replace(/[^a-z0-9]/g, "");
    const p = `${userId}/${Date.now()}.${ext}`;
    const { error } = await createClient().storage.from("deneyimler").upload(p, file, { contentType: file.type });
    if (error) { setUp("hata"); return; }
    setPath(p); setUp("tamam");
  };
  return (
    <form action={action} className="grid gap-4">
      <fieldset className="grid grid-cols-3 gap-2 rounded-2xl bg-bg p-1.5">
        <legend className="sr-only">Paylaşım türü</legend>
        {([["yazi", "Yazarak"], ["dosya", "Video yükleyerek"], ["link", "Video bağlantısıyla"]] as const).map(([v, l]) => (
          <label key={v} className={`cursor-pointer rounded-xl py-2.5 text-center text-sm font-bold ${mode === v ? "bg-paper shadow-sm" : "text-muted"}`}>
            <input type="radio" name="_mode" value={v} checked={mode === v} onChange={() => setMode(v)} className="sr-only" />{l}
          </label>
        ))}
      </fieldset>
      {mode === "dosya" && (
        <div className="grid gap-2">
          <label className="field" htmlFor="video-file">
            <span>Video dosyası</span>
            <span className="field-hint">Telefonla çekilmiş kısa bir video yeterli (en fazla 100 MB).</span>
            <input id="video-file" type="file" accept="video/mp4,video/quicktime,video/webm" className="input"
              onChange={(e) => { const f = e.currentTarget.files?.[0]; if (f) upload(f); }} />
          </label>
          {up === "yukleniyor" && <p className="font-semibold text-muted">Video yükleniyor…</p>}
          {up === "tamam" && <p className="font-semibold text-leaf">Video yüklendi.</p>}
          {up === "hata" && <p className="font-semibold text-bad">Video yüklenemedi. Dosya 100 MB'tan küçük ve mp4/mov biçiminde olmalı.</p>}
          <input type="hidden" name="video_path" value={path} />
        </div>
      )}
      {mode === "link" && <Input name="video_url" label="YouTube ya da Vimeo bağlantısı" placeholder="https://youtu.be/..." />}
      <Textarea name="body" label={mode === "yazi" ? "Deneyiminiz" : "Kısa bir not (isteğe bağlı)"} required={mode === "yazi"} rows={5} hint="Süreçte sizin için neler değişti?" />
      <Check name="izin" required>Adımın kısaltılarak ve paylaşımımın sitede yayınlanmasına izin veriyorum.</Check>
      {state?.error && <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">{state.error}</p>}
      <div><button className="btn-primary" disabled={pending || up === "yukleniyor" || (mode === "dosya" && !path)}>{pending ? "Gönderiliyor…" : "Onaya gönder"}</button></div>
    </form>
  );
}
