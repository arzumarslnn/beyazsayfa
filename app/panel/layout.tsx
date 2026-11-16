import { redirect } from "next/navigation";
import PanelNav from "@/components/PanelNav";
import { PendingTestSaver } from "@/components/TestRunner";
import { createClient, getMe } from "@/lib/supabase/server";
import { signOut } from "@/app/actions";
import { isDemoEmail } from "@/lib/demo";

export const dynamic = "force-dynamic";
const ROLE = { ogrenci: "Öğrenci paneli", veli: "Veli paneli", yonetim: "Yönetim paneli" } as const;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe();
  if (!me) redirect("/giris");
  let unread = 0, newAppts = 0;
  const supabase = await createClient();
  if (me.role === "veli") {
    const { count } = await supabase.from("messages").select("id", { count: "exact", head: true }).eq("to_user", me.id).eq("read", false);
    unread = count ?? 0;
  }
  if (me.role === "yonetim") {
    const { count } = await supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "Yeni");
    newAppts = count ?? 0;
  }
  const items =
    me.role === "ogrenci" ? [
      { href: "/panel", label: "Özet" }, { href: "/panel/testlerim", label: "Test sonuçlarım" }, { href: "/panel/formlar", label: "Formlarım" },
      { href: "/panel/denemeler", label: "Deneme sonuçlarım" }, { href: "/panel/hesap", label: "Hesabım" },
    ] : me.role === "veli" ? [
      { href: "/panel", label: "Özet" }, { href: "/panel/davranis", label: "Davranış programı" }, { href: "/panel/cocugum", label: "Çocuğumun paylaştıkları" },
      { href: "/panel/egitimlerim", label: "Eğitimlerim" }, { href: "/panel/formlar", label: "Veli formlarım" },
      { href: "/panel/bildirimler", label: "Bildirimler", badge: unread }, { href: "/panel/hesap", label: "Hesabım" },
    ] : [
      { href: "/panel", label: "Genel bakış" }, { href: "/panel/yonetim/ogrenciler", label: "Öğrenciler ve üçlü takip" },
      { href: "/panel/yonetim/formlar", label: "Doldurulan formlar" }, { href: "/panel/formlar", label: "Koç formu doldur" },
      { href: "/panel/yonetim/randevular", label: "Randevu talepleri", badge: newAppts }, { href: "/panel/yonetim/siparisler", label: "Siparişler ve erişim" },
      { href: "/panel/yonetim/programlar", label: "Davranış programları" }, { href: "/panel/yonetim/blog", label: "Blog yazıları" },
      { href: "/panel/yonetim/deneyimler", label: "Deneyimler" }, { href: "/panel/hesap", label: "Hesabım" },
    ];
  return (
    <div className="wrap grid gap-8 py-10 md:grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-4 md:sticky md:top-24 md:self-start">
        <div className="rounded-3xl bg-paper p-5">
          <span className="eyebrow text-xs">{ROLE[me.role]}</span>
          <p className="mt-1 font-display text-xl font-bold leading-tight">{me.full_name || me.email}</p>
        </div>
        <PanelNav items={items} />
        <form action={signOut}><button className="px-4 text-sm font-semibold text-muted hover:text-ink">Çıkış yap</button></form>
      </aside>
      <div className="min-w-0">
        {isDemoEmail(me.email) && <p className="mb-6 rounded-2xl bg-butter px-4 py-3 font-semibold">Demo hesaptasınız. Veriler örnektir ve ortak kullanılır. <a href="/demo" className="underline">Başka bir rolle girin</a></p>}
        {children}
      </div>
      {me.role === "ogrenci" && <PendingTestSaver />}
    </div>
  );
}
