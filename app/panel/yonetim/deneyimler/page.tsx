import PanelTitle, { Empty } from "@/components/PanelTitle";
import ActionForm from "@/components/ActionForm";
import StatusButtons from "@/components/StatusButtons";
import { Input, Select, Textarea } from "@/components/Fields";
import { addTestimonialAdmin, moderateTestimonial } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import VideoPlayer from "@/components/VideoPlayer";
import { trDate } from "@/lib/site";

export default async function Page() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  const data = await Promise.all((rows ?? []).map(async (t) => {
    if (!t.video_path) return { ...t, videoSrc: t.video_url };
    const { data: s } = await supabase.storage.from("deneyimler").createSignedUrl(t.video_path, 3600);
    return { ...t, videoSrc: s?.signedUrl ?? null };
  }));
  const act = (id: string) => async (s: string) => { "use server"; await moderateTestimonial(id, s === "Yayında" ? "onayla" : s === "Gizli" ? "gizle" : "sil"); };
  return (
    <>
      <PanelTitle title="Deneyimler" lead="Üyelerin gönderdiği yazılı ve video deneyimler onayınızdan sonra ana sayfanın en altında ve Deneyimler sayfasında yayınlanır. Size WhatsApp ya da e-postayla gelen yorumları, kişinin izniyle buradan ekleyebilirsiniz." />
      <div className="card md:p-8">
        <h2 className="mb-4 text-2xl">Deneyim ekle</h2>
        <ActionForm action={addTestimonialAdmin} submit="Yayınla" resetOnOk>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="display_name" label="Görünecek isim" required placeholder="Zeynep'in annesi" />
            <Select name="role_label" label="Kim?" options={["Veli", "Öğrenci"]} />
          </div>
          <Textarea name="body" label="Deneyim (yazılı)" rows={4} />
          <Input name="video_url" label="Video bağlantısı (isteğe bağlı)" placeholder="YouTube ya da Vimeo" />
        </ActionForm>
      </div>
      <div className="mt-6 grid gap-3">
        {data.length ? data.map((t) => (
          <div key={t.id} className={`card flex flex-col gap-3 ${t.approved ? "" : "ring-2 ring-accent"}`}>
            {t.videoSrc && <VideoPlayer url={t.videoSrc} title={t.display_name} className="aspect-video max-w-xl rounded-2xl" />}
            {t.body && <p className="text-lg">“{t.body}”</p>}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-muted"><b className="text-ink">{t.display_name}</b> · {t.role_label} · {trDate(t.created_at)}</span>
              <StatusButtons options={["Yayında", "Gizli", "Sil"]} current={t.approved ? "Yayında" : "Gizli"} onSet={act(t.id)} />
            </div>
          </div>
        )) : <Empty>Henüz deneyim yok.</Empty>}
      </div>
    </>
  );
}
