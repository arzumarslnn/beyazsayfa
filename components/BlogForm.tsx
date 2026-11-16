import ActionForm from "./ActionForm";
import { Input, Textarea, Check, Select } from "./Fields";
import { saveBlogPost } from "@/app/actions";
import { PHOTOS } from "@/lib/photos";

export default function BlogForm({ post }: { post?: any }) {
  return (
    <ActionForm action={saveBlogPost} submit={post ? "Kaydet" : "Yayınla"}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <Input name="title" label="Başlık" required defaultValue={post?.title} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input name="category" label="Kategori" defaultValue={post?.category ?? "Ebeveynlik"} />
        <Input name="read_min" label="Okuma süresi (dk)" type="number" min={1} defaultValue={post?.read_min ?? 4} />
        <Select name="cover" label="Kapak fotoğrafı" defaultValue={post?.cover ?? "aile"} options={Object.entries(PHOTOS).map(([k, v]) => [k, `${k}: ${v.alt.slice(0, 40)}`] as [string, string])} />
      </div>
      <Input name="slug" label="Adres (slug)" defaultValue={post?.slug} hint="Boş bırakırsanız başlıktan oluşturulur." />
      <Textarea name="excerpt" label="Kısa özet" rows={2} defaultValue={post?.excerpt} />
      <Textarea name="body" label="Yazı" rows={18} defaultValue={post?.body}
        hint="Paragraflar arasında boş satır bırakın. Ara başlık için satırın başına “## ”, madde için “- ”, kalın için **metin** yazın." />
      <Check name="published" defaultChecked={post ? post.published : true}>Yayında</Check>
    </ActionForm>
  );
}
