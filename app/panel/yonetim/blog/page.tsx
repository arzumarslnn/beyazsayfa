import Link from "next/link";
import PanelTitle, { Empty } from "@/components/PanelTitle";
import { deleteBlogPost } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { trDate } from "@/lib/site";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("id,slug,title,category,published,created_at").order("created_at", { ascending: false });
  return (
    <>
      <PanelTitle title="Blog yazıları"><Link href="/panel/yonetim/blog/yeni" className="btn-primary">Yeni yazı</Link></PanelTitle>
      {data?.length ? (
        <div className="grid gap-3">
          {data.map((p) => (
            <div key={p.id} className="card flex flex-wrap items-center justify-between gap-3">
              <div><b className="font-display text-xl">{p.title}</b><p className="text-sm text-muted">{p.category} · {trDate(p.created_at)} · {p.published ? "Yayında" : "Taslak"}</p></div>
              <div className="flex gap-2">
                <Link href={`/blog/${p.slug}`} className="btn-ghost btn-sm">Gör</Link>
                <Link href={`/panel/yonetim/blog/${p.id}`} className="btn-ghost btn-sm">Düzenle</Link>
                <form action={deleteBlogPost.bind(null, p.id)}><button className="btn-ghost btn-sm text-bad">Sil</button></form>
              </div>
            </div>
          ))}
        </div>
      ) : <Empty>Henüz yazı yok.</Empty>}
    </>
  );
}
