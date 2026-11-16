import { Suspense } from "react";
import { RegisterForm } from "@/components/AuthForms";
export const metadata = { title: "Üye ol" };
export default function Page() {
  return (
    <section className="wrap grid gap-12 py-14 md:grid-cols-[1fr_1fr]">
      <div className="flex flex-col gap-5">
        <span className="eyebrow">Ücretsiz üyelik</span>
        <h1 className="text-4xl md:text-5xl">Beyazsayfa'ya hoş geldin</h1>
        <p className="lead">Veli ve öğrenci ayrı hesap açar. Hesaplar bağlandığında veli, yalnızca öğrencinin paylaşmayı seçtiği sonuçları görür.</p>
        <ul className="mt-2 grid gap-3 text-lg">
          {["Test sonuçlarının ayrıntılı analizi", "Davranış programı (ücretsiz)", "Formlar ve deneme takibi", "Eğitim ve paket fiyatları"].map((x) => <li key={x} className="flex gap-3"><span className="text-action">✓</span>{x}</li>)}
        </ul>
      </div>
      <div className="card md:p-10"><Suspense><RegisterForm /></Suspense></div>
    </section>
  );
}
