"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { submitAppointment, type ActionState } from "@/app/actions";
import AppointmentCalendar from "./AppointmentCalendar";
import { Input, Select, Textarea, Check } from "./Fields";

export default function AppointmentForm({ name, phone, email, role }: { name?: string; phone?: string | null; email?: string; role?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitAppointment, undefined);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => { if (state?.error) setRefresh((r) => r + 1); }, [state]);
  if (state?.ok) return (
    <div className="flex flex-col gap-3">
      <span className="chip self-start bg-sage text-ink">Randevunuz alındı</span>
      <h2 className="text-3xl">Teşekkürler!</h2>
      <p className="text-lg text-muted">{state.msg}</p>
      <Link href="/" className="btn-ghost self-start">Ana sayfaya dön</Link>
    </div>
  );
  return (
    <form action={action} className="grid gap-6">
      <div>
        <h2 className="mb-1 text-2xl">1. Gün ve saat seçin</h2>
        <p className="mb-4 text-muted">Görüşmeler 30 dakikadır. Dolu saatler seçilemez.</p>
        <AppointmentCalendar refreshKey={refresh} />
      </div>
      <div className="grid gap-4">
        <h2 className="text-2xl">2. Bilgileriniz</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="name" label="Ad soyad" required defaultValue={name} autoComplete="name" />
          <Input name="phone" label="Telefon" type="tel" required defaultValue={phone} placeholder="05XX XXX XX XX" autoComplete="tel" />
        </div>
        <Input name="email" label="E-posta" type="email" defaultValue={email} autoComplete="email" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select name="who" label="Kimin için?" options={["Veli", "Öğrenci"]} defaultValue={role === "ogrenci" ? "Öğrenci" : "Veli"} />
          <Select name="topic" label="Konu" options={["Öğrenci koçluğu ön görüşme", "Ebeveyn davranış eğitimi", "Davranış programı desteği", "Test sonucu değerlendirme", "Diğer"]} />
        </div>
        <Textarea name="note" label="Notunuz" hint="İsteğe bağlı" rows={3} />
        <Check name="kvkk" required>
          <Link href="/yasal/kvkk" className="underline" target="_blank">KVKK aydınlatma metnini</Link> okudum, iletişim bilgilerimin randevu için kullanılmasını onaylıyorum.
        </Check>
        {state?.error && <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">{state.error}</p>}
        <div><button type="submit" disabled={pending} className="btn-primary">{pending ? "Gönderiliyor…" : "Randevuyu al"}</button></div>
      </div>
    </form>
  );
}
