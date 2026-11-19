import Link from "next/link";
import PanelTitle, { Empty } from "@/components/PanelTitle";
import { createClient, getMe } from "@/lib/supabase/server";
import { COURSES, productByKey } from "@/lib/catalog";
import { trDate } from "@/lib/site";

export default async function Page({ searchParams }: { searchParams: Promise<{ odeme?: string }> }) {
  const me = (await getMe())!;
  const supabase = await createClient();
  const { data: orders } = await supabase.from("orders").select("*").eq("user_id", me.id).eq("status", "odendi").order("paid_at", { ascending: false });
  const o = (await searchParams).odeme;
  const owned = new Set((orders ?? []).map((x) => x.product_key));
  return (
    <>
      <PanelTitle title="Eğitimlerim ve paketlerim" />
      {o === "tamam" && <p className="mb-6 rounded-2xl bg-sage px-4 py-3 font-semibold">Ödemeniz alındı, teşekkürler! Erişiminiz açıldı.</p>}
      {o === "basarisiz" && <p className="mb-6 rounded-2xl bg-blush px-4 py-3 font-semibold">Ödeme tamamlanamadı. Kartınızdan çekim yapılmadı; tekrar deneyebilirsiniz.</p>}
      {o === "hata" && <p className="mb-6 rounded-2xl bg-blush px-4 py-3 font-semibold">Ödeme sonucu doğrulanamadı. Kartınızdan çekim yapıldıysa bize yazın, hemen kontrol edelim.</p>}
      {orders?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((x) => { const p = productByKey(x.product_key); return (
            <div key={x.id} className="card flex flex-col gap-2">
              <span className="chip self-start bg-sage text-ink">{p?.kind === "egitim" ? "Ebeveyn eğitimi" : p?.kind === "test" ? "Testler" : "Koçluk paketi"}</span>
              <h2 className="text-2xl">{x.product_title}</h2>
              <p className="text-sm text-muted">{x.paid_at ? trDate(x.paid_at) : ""}</p>
              {p?.kind === "egitim" ? <Link href={`/ebeveyn-egitimi/${p.key}`} className="btn-primary btn-sm mt-2 self-start">Derslere git</Link> : p?.kind === "test" ? <p className="mt-2 text-muted">Çocuğunuz testleri kendi öğrenci hesabıyla çözebilir.</p> : <p className="mt-2 text-muted">Koçunuz görüşme takvimi için sizinle iletişime geçecek.</p>}
            </div>
          ); })}
        </div>
      ) : <Empty>Henüz bir eğitiminiz yok.</Empty>}
      <h2 className="mb-4 mt-12 text-2xl">Diğer eğitimler</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {COURSES.filter((c) => !owned.has(c.key)).map((c) => (
          <Link key={c.key} href={`/ebeveyn-egitimi/${c.key}`} className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-5 py-4 font-semibold hover:bg-sky">{c.title}<span className="text-sm text-muted">{c.age}</span></Link>
        ))}
      </div>
    </>
  );
}
