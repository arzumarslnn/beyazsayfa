import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import Prose from "@/components/Prose";
import { createClient } from "@/lib/supabase/server";
import { trDate } from "@/lib/site";
export const revalidate = 300;

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  return data;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug); return { title: p?.title ?? "Blog", description: p?.excerpt };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  return (
    <article className="wrap max-w-3xl py-12">
      <Link href="/blog" className="text-sm font-bold text-muted hover:text-ink">← Tüm yazılar</Link>
      <p className="mt-6 text-sm font-bold text-accent">{p.category} · {p.read_min} dk okuma · {trDate(p.created_at)}</p>
      <h1 className="mt-3 text-4xl md:text-5xl">{p.title}</h1>
      <p className="lead mt-4">{p.excerpt}</p>
      <Photo id={p.cover || "aile"} priority className="my-10 aspect-[16/9] rounded-[2rem]" />
      <Prose text={p.body} className="text-lg" />
      <div className="mt-14 rounded-3xl bg-paper p-8">
        <h3>Bu konuda destek ister misiniz?</h3>
        <p className="mt-2 text-muted">İlk görüşme ücretsiz. İhtiyacınızı dinleyip size uygun yolu birlikte seçelim.</p>
        <Link href="/iletisim" className="btn-primary mt-4">Ön görüşme iste</Link>
      </div>
    </article>
  );
}
