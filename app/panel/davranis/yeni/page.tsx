import Link from "next/link";
import NewProgramForm from "@/components/NewProgramForm";
import { getMe } from "@/lib/supabase/server";
export default async function Page({ searchParams }: { searchParams: Promise<{ b?: string }> }) {
  const me = await getMe();
  if (me?.role === "ogrenci") return (
    <div className="max-w-2xl rounded-3xl bg-sky p-8">
      <h1 className="text-3xl">Bu program ebeveynler içindir</h1>
      <p className="mt-3 text-lg">Davranış programını velin kendi veli hesabıyla kullanır. Senin için testler, formlar ve deneme takibi panelinde.</p>
      <Link href="/panel" className="btn-primary mt-5">Panelime dön</Link>
    </div>
  );
  return (
    <div className="max-w-3xl">
      <Link href="/panel/davranis" className="text-sm font-bold text-muted hover:text-ink">← Programlar</Link>
      <h1 className="mb-2 mt-4 text-3xl md:text-4xl">Yeni davranış programı</h1>
      <p className="mb-8 text-lg text-muted">Tek bir davranışla başlamak en iyisidir. Birkaç hafta sonra ikinci bir davranış ekleyebilirsiniz.</p>
      <div className="card md:p-8"><NewProgramForm initial={(await searchParams).b} /></div>
    </div>
  );
}
