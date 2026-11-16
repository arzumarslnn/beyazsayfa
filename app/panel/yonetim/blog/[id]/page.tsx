import { notFound } from "next/navigation";
import BlogForm from "@/components/BlogForm";
import { createClient } from "@/lib/supabase/server";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", (await params).id).maybeSingle();
  if (!data) notFound();
  return <div className="max-w-3xl"><h1 className="mb-6 text-3xl md:text-4xl">Yazıyı düzenle</h1><div className="card md:p-8"><BlogForm post={data} /></div></div>;
}
