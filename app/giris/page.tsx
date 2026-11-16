import { Suspense } from "react";
import { LoginForm } from "@/components/AuthForms";
import Photo from "@/components/Photo";
export const metadata = { title: "Giriş yap" };
export default function Page() {
  return (
    <section className="wrap grid items-center gap-12 py-14 md:grid-cols-2">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-4xl md:text-5xl">Tekrar hoş geldin</h1>
        <p className="lead mb-8 mt-3">Paneline giriş yap.</p>
        <Suspense><LoginForm /></Suspense>
        <a href="/demo" className="mt-6 block rounded-2xl bg-paper px-5 py-4 font-semibold hover:bg-blush">Üye olmadan denemek mi istiyorsunuz? <span className="text-action">Demo hesaplarla girin →</span></a>
      </div>
      <Photo id="aile" className="hidden aspect-[4/5] rounded-[3rem] md:block" />
    </section>
  );
}
