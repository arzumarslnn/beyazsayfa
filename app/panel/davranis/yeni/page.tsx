import Link from "next/link";
import NewProgramForm from "@/components/NewProgramForm";
export default async function Page({ searchParams }: { searchParams: Promise<{ b?: string }> }) {
  return (
    <div className="max-w-3xl">
      <Link href="/panel/davranis" className="text-sm font-bold text-muted hover:text-ink">← Programlar</Link>
      <h1 className="mb-2 mt-4 text-3xl md:text-4xl">Yeni davranış programı</h1>
      <p className="mb-8 text-lg text-muted">Tek bir davranışla başlamak en iyisidir. Birkaç hafta sonra ikinci bir davranış ekleyebilirsiniz.</p>
      <div className="card md:p-8"><NewProgramForm initial={(await searchParams).b} /></div>
    </div>
  );
}
