import Link from "next/link";
import PageHead from "@/components/PageHead";
import Photo from "@/components/Photo";
import { createClient } from "@/lib/supabase/server";
export const metadata = { title: "Blog" };
export const revalidate = 300;

export default async function Page() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from("blog_posts").select("slug,title,category,excerpt,read_min,cover").eq("published", true).order("created_at", { ascending: false });
  return (
    <>
      <PageHead eyebrow="Blog" title="Ebeveynlik, mizaç ve öğrenme üzerine" lead="Evde hemen uygulayabileceğiniz kısa ve pratik yazılar." />
      <section className="wrap grid gap-x-6 gap-y-12 py-16 md:grid-cols-2 lg:grid-cols-3">
        {(posts ?? []).map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-3">
            <Photo id={p.cover || "aile"} className="aspect-[3/2] rounded-[1.75rem]" sizes="(max-width: 768px) 100vw, 33vw" />
            <span className="text-sm font-bold text-accent">{p.category} · {p.read_min} dk okuma</span>
            <h3 className="group-hover:underline">{p.title}</h3>
            <p className="text-muted">{p.excerpt}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
