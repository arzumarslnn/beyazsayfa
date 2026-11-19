import PageHead from "@/components/PageHead";
import AppointmentForm from "@/components/AppointmentForm";
import { getMe } from "@/lib/supabase/server";
import { SITE, whatsappLink } from "@/lib/site";
export const metadata = { title: "İletişim ve Randevu" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const me = await getMe().catch(() => null);
  return (
    <>
      <PageHead eyebrow="İletişim ve randevu" title="Ücretsiz ön görüşme için randevu alın" lead="Takvimden size uygun boş bir gün ve saat seçin. İlk görüşme 30 dakikadır ve ücretsizdir." />
      <section className="wrap grid gap-10 py-16 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="card bg-paper md:p-10">
          <AppointmentForm name={me?.full_name} phone={me?.phone} email={me?.email} role={me?.role} />
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-sky p-7">
            <h3>Bize ulaşın</h3>
            <dl className="mt-4 grid gap-3">
              <div><dt className="text-sm font-bold text-muted">E-posta</dt><dd className="font-semibold">{SITE.email}</dd></div>
              <div><dt className="text-sm font-bold text-muted">Telefon</dt><dd className="font-semibold">{SITE.phone}</dd></div>
              <div><dt className="text-sm font-bold text-muted">Adres</dt><dd className="font-semibold">{SITE.address}</dd></div>
            </dl>
            <a href={whatsappLink("Merhaba, ön görüşme için randevu almak istiyorum.")} target="_blank" rel="noopener" className="btn mt-5 bg-[#25D366] text-white">WhatsApp'tan yazın</a>
          </div>
          <div className="rounded-3xl bg-paper p-7 text-[15px] text-muted">
            <b className="text-ink">Çalışma saatleri</b>
            <p className="mt-1">Hafta içi 10:00–20:00<br />Cumartesi 10:00–14:00<br />Pazar kapalı</p>
          </div>
        </aside>
      </section>
    </>
  );
}
