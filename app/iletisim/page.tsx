import PageHead from "@/components/PageHead";
import ActionForm from "@/components/ActionForm";
import { Input, Select, Textarea, Check } from "@/components/Fields";
import { submitAppointment } from "@/app/actions";
import { getMe } from "@/lib/supabase/server";
import { SITE, whatsappLink } from "@/lib/site";
import Link from "next/link";
export const metadata = { title: "İletişim ve Randevu" };

export default async function Page() {
  const me = await getMe().catch(() => null);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHead eyebrow="İletişim" title="Ücretsiz ön görüşme için randevu isteyin" lead="Formu doldurun, 24 saat içinde size dönüp uygun zamanı birlikte belirleyelim. İlk görüşme 30 dakikadır ve ücretsizdir." />
      <section className="wrap grid gap-10 py-16 md:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <div className="rounded-3xl bg-sky p-7">
            <h3>Bize ulaşın</h3>
            <dl className="mt-4 grid gap-3">
              <div><dt className="text-sm font-bold text-ink/60">E-posta</dt><dd className="font-semibold">{SITE.email}</dd></div>
              <div><dt className="text-sm font-bold text-ink/60">Telefon</dt><dd className="font-semibold">{SITE.phone}</dd></div>
              <div><dt className="text-sm font-bold text-ink/60">Adres</dt><dd className="font-semibold">{SITE.address}</dd></div>
            </dl>
            <a href={whatsappLink("Merhaba, ön görüşme için randevu almak istiyorum.")} target="_blank" rel="noopener" className="btn mt-5 bg-[#25D366] text-white">WhatsApp'tan yazın</a>
          </div>
        </div>
        <div className="card md:p-10">
          <ActionForm action={submitAppointment} submit="Randevu talebi gönder"
            okView={<div className="flex flex-col gap-3"><span className="chip self-start bg-sage text-ink">Talebiniz alındı</span><h2 className="text-3xl">Teşekkürler!</h2><p className="text-lg text-muted">En geç 24 saat içinde sizi arayacağız. Bu arada ücretsiz testlere göz atabilirsiniz.</p><Link href="/testler" className="btn-ghost self-start">Testlere git</Link></div>}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="name" label="Ad soyad" required defaultValue={me?.full_name} autoComplete="name" />
              <Input name="phone" label="Telefon" type="tel" required defaultValue={me?.phone} placeholder="05XX XXX XX XX" autoComplete="tel" />
            </div>
            <Input name="email" label="E-posta" type="email" defaultValue={me?.email} autoComplete="email" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select name="who" label="Kimin için?" options={["Veli", "Öğrenci"]} defaultValue={me?.role === "ogrenci" ? "Öğrenci" : "Veli"} />
              <Select name="topic" label="Konu" options={["Öğrenci koçluğu ön görüşme", "Ebeveyn eğitimi", "Davranış programı desteği", "Test sonucu değerlendirme", "Diğer"]} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="pref_date" label="Tercih ettiğiniz tarih" type="date" min={today} />
              <Select name="time_slot" label="Zaman dilimi" options={["Sabah", "Öğleden sonra", "Akşam"]} defaultValue="Akşam" />
            </div>
            <Textarea name="note" label="Notunuz" hint="İsteğe bağlı" rows={3} />
            <Check name="kvkk" required>
              <Link href="/yasal/kvkk" className="underline" target="_blank">KVKK aydınlatma metnini</Link> okudum, iletişim bilgilerimin randevu için kullanılmasını onaylıyorum.
            </Check>
          </ActionForm>
        </div>
      </section>
    </>
  );
}
