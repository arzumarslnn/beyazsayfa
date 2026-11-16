import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-5 py-24">
      <span className="eyebrow">404</span>
      <h1>Bu sayfa bomboş</h1>
      <p className="lead">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <Link href="/" className="btn-primary">Ana sayfaya dön</Link>
    </section>
  );
}
