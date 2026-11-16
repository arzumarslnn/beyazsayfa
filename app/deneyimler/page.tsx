import Link from "next/link";
import PageHead from "@/components/PageHead";
import ActionForm from "@/components/ActionForm";
import { Textarea, Check } from "@/components/Fields";
import { submitTestimonial } from "@/app/actions";
import { createClient, getMe } from "@/lib/supabase/server";
export const metadata = { title: "Deneyimler" };
export const revalidate = 300;

export default async function Page() {
  const supabase = await createClient();
  const { data: stories } = await supabase.from("testimonials").select("id,display_name,role_label,body").eq("approved", true).order("created_at", { ascending: false });
  const me = await getMe().catch(() => null);
  const BG = ["bg-blush", "bg-sky", "bg-butter", "bg-sage"];
  return (
    <>
      <PageHead eyebrow="Deneyimler" title="Öğrencilerimiz ve aileleri anlatıyor" lead="Paylaşımlar kişilerin izniyle ve isimleri kısaltılarak yayınlanır." />
      <section className="wrap py-16">
        {stories && stories.length ? (
          <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
            {stories.map((s, i) => (
              <figure key={s.id} className={`${BG[i % 4]} mb-5 break-inside-avoid rounded-3xl p-7`}>
                <blockquote className="font-display text-xl font-semibold leading-snug">“{s.body}”</blockquote>
                <figcaption className="mt-4 font-bold">{s.display_name} <span className="font-normal text-ink">· {s.role_label}</span></figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-paper p-10 text-center text-lg text-muted">İlk deneyimler çok yakında burada olacak.</div>
        )}
      </section>
      <section className="wrap max-w-3xl">
        <div className="card flex flex-col gap-4 md:p-10">
          <h2 className="text-3xl">Deneyiminizi paylaşın</h2>
          {me ? (
            <ActionForm action={submitTestimonial} submit="Onaya gönder" resetOnOk>
              <Textarea name="body" label="Deneyiminiz" required rows={5} hint="Süreçte sizin için neler değişti?" />
              <Check name="izin" required>Adımın kısaltılarak sitede yayınlanmasına izin veriyorum.</Check>
            </ActionForm>
          ) : (
            <p className="text-muted">Deneyiminizi paylaşmak için <Link href="/giris?sonra=/deneyimler" className="font-bold text-action">giriş yapın</Link>. Paylaşımlar yönetim onayından sonra yayınlanır.</p>
          )}
        </div>
      </section>
    </>
  );
}
