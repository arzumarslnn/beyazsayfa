import Link from "next/link";
import PageHead from "@/components/PageHead";
import TestimonialForm from "@/components/TestimonialForm";
import { getStories, StoryGrid } from "@/components/Testimonials";
import { getMe } from "@/lib/supabase/server";
export const metadata = { title: "Deneyimler" };
export const dynamic = "force-dynamic";

export default async function Page() {
  const [stories, me] = await Promise.all([getStories(), getMe().catch(() => null)]);
  return (
    <>
      <PageHead eyebrow="Deneyimler" title="Bizimle çalışan aileler ve öğrenciler anlatıyor" lead="Yazılı ve video paylaşımlar, kişilerin izniyle ve isimleri kısaltılarak yayınlanır." />
      <section className="wrap py-16">
        {stories.length ? <StoryGrid stories={stories} /> : <div className="rounded-3xl bg-paper p-10 text-center text-lg text-muted">İlk deneyimler çok yakında burada olacak.</div>}
      </section>
      <section id="paylas" className="wrap max-w-3xl scroll-mt-24">
        <div className="card flex flex-col gap-4 bg-paper md:p-10">
          <h2 className="text-3xl">Deneyiminizi paylaşın</h2>
          <p className="text-muted">Yazarak anlatabilir, telefonunuzla çektiğiniz kısa bir videoyu yükleyebilir ya da YouTube bağlantısı ekleyebilirsiniz.</p>
          {me ? <TestimonialForm userId={me.id} /> : (
            <p className="text-muted">Deneyiminizi paylaşmak için <Link href="/giris?sonra=/deneyimler%23paylas" className="font-bold text-action">giriş yapın</Link>. Paylaşımlar yönetim onayından sonra yayınlanır.</p>
          )}
        </div>
      </section>
    </>
  );
}
