import PanelTitle, { Empty } from "@/components/PanelTitle";
import ActionForm from "@/components/ActionForm";
import { Input, Select } from "@/components/Fields";
import { grantAccess } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { PRODUCTS } from "@/lib/catalog";
import { tl, trDate } from "@/lib/site";
const ST: Record<string, string> = { odendi: "bg-sage", bekliyor: "bg-butter", basarisiz: "bg-blush", iptal: "bg-paper" };
const STL: Record<string, string> = { odendi: "Ödendi", bekliyor: "Bekliyor", basarisiz: "Başarısız", iptal: "İptal" };

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*, profiles(full_name,email)").order("created_at", { ascending: false }).limit(200);
  return (
    <>
      <PanelTitle title="Siparişler ve erişim" lead="Kartla yapılan ödemeler otomatik işlenir. Havale ile ödeyenlere ya da hediye olarak erişimi buradan açabilirsiniz." />
      <div className="card md:p-8">
        <h2 className="mb-4 text-2xl">Elle erişim aç</h2>
        <ActionForm action={grantAccess} submit="Erişimi aç" resetOnOk className="grid gap-4 md:grid-cols-[1.2fr_1.2fr_0.8fr_auto] md:items-end">
          <Input name="email" label="Üyenin e-postası" type="email" required />
          <Select name="product" label="Ürün" options={PRODUCTS.map((p) => [p.key, p.title] as [string, string])} />
          <Select name="method" label="Yöntem" options={[["havale", "Havale"], ["hediye", "Hediye"]]} />
        </ActionForm>
      </div>
      <div className="card mt-6 overflow-x-auto">
        {data?.length ? (
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead><tr className="border-b border-line text-xs uppercase tracking-wide text-muted"><th className="py-2 pr-3">Tarih</th><th className="py-2 pr-3">Üye</th><th className="py-2 pr-3">Ürün</th><th className="py-2 pr-3">Tutar</th><th className="py-2 pr-3">Yöntem</th><th className="py-2">Durum</th></tr></thead>
            <tbody>{data.map((o: any) => (
              <tr key={o.id} className="border-b border-line">
                <td className="py-3 pr-3 text-muted">{trDate(o.created_at)}</td>
                <td className="py-3 pr-3">{o.profiles?.full_name}<br /><span className="text-sm text-muted">{o.profiles?.email}</span></td>
                <td className="py-3 pr-3">{o.product_title}</td>
                <td className="py-3 pr-3 tabular-nums">{tl(Number(o.amount))}</td>
                <td className="py-3 pr-3">{o.method}</td>
                <td className="py-3"><span className={`chip ${ST[o.status]} text-ink`}>{STL[o.status]}</span></td>
              </tr>))}</tbody>
          </table>
        ) : <Empty>Henüz sipariş yok.</Empty>}
      </div>
    </>
  );
}
