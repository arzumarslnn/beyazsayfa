import Link from "next/link";
import { notFound } from "next/navigation";
import ActionForm from "@/components/ActionForm";
import { Input, Check } from "@/components/Fields";
import { startCheckout } from "@/app/actions";
import { productByKey } from "@/lib/catalog";
import { getMe } from "@/lib/supabase/server";
import { iyzicoReady } from "@/lib/iyzico";
import { SITE, tl, whatsappLink } from "@/lib/site";
export const metadata = { title: "Ödeme" };

export default async function Page({ params }: { params: Promise<{ key: string }> }) {
  const p = productByKey((await params).key);
  if (!p) notFound();
  const me = (await getMe())!;
  const [name, ...rest] = (me.full_name || "").split(" ");
  return (
    <section className="wrap grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr]">
      <div className="card md:p-10">
        <h1 className="text-4xl">Ödeme</h1>
        <p className="lead mb-8 mt-2">Fatura bilgileriniz iyzico güvenli ödeme sayfasına iletilir. Kart bilgileriniz {SITE.name} tarafından görülmez ve saklanmaz.</p>
        {iyzicoReady() ? (
          <ActionForm action={startCheckout} submit="Güvenli ödemeye geç">
            <input type="hidden" name="product" value={p.key} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="name" label="Ad" required defaultValue={name} />
              <Input name="surname" label="Soyad" required defaultValue={rest.join(" ")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="phone" label="Telefon" type="tel" required defaultValue={me.phone} />
              <Input name="tckn" label="T.C. kimlik no" required inputMode="numeric" pattern="\d{11}" maxLength={11} hint="Fatura için zorunludur" />
            </div>
            <Input name="address" label="Fatura adresi" required />
            <Input name="city" label="Şehir" required />
            <Check name="sozlesme" required>
              <Link href="/yasal/mesafeli-satis" target="_blank" className="underline">Mesafeli satış sözleşmesini</Link> ve <Link href="/yasal/iade" target="_blank" className="underline">iptal-iade koşullarını</Link> okudum, onaylıyorum.
            </Check>
          </ActionForm>
        ) : (
          <div className="flex flex-col gap-4 rounded-3xl bg-paper p-6">
            <b className="font-display text-xl">Online ödeme çok yakında</b>
            <p className="text-muted">Şimdilik havale/EFT ile satın alabilirsiniz. Bize yazın, ödeme bilgilerini iletelim; ödemeniz ulaştığında erişiminiz hemen açılır.</p>
            <a href={whatsappLink(`Merhaba, "${p.title}" için havale ile ödeme yapmak istiyorum. Üyelik e-postam: ${me.email}`)} target="_blank" rel="noopener" className="btn self-start bg-[#25D366] text-white">WhatsApp'tan yazın</a>
          </div>
        )}
      </div>
      <aside className="flex flex-col gap-4 self-start rounded-[2rem] bg-paper p-8">
        <span className="eyebrow">{p.kind === "egitim" ? "Ebeveyn eğitimi" : "Koçluk paketi"}</span>
        <h2 className="text-3xl">{p.title}</h2>
        <p className="text-muted">{p.kind === "egitim" ? p.promise : p.summary}</p>
        <div className="flex items-baseline justify-between border-t border-line pt-4"><span className="font-semibold">Toplam</span><span className="font-display text-3xl font-extrabold tabular-nums">{tl(p.price)}</span></div>
        <p className="text-sm text-muted">KDV dahildir. Kredi kartına 6 taksite kadar.</p>
      </aside>
    </section>
  );
}
