import PanelTitle from "@/components/PanelTitle";
import ActionForm from "@/components/ActionForm";
import VideoPlayer from "@/components/VideoPlayer";
import { Input } from "@/components/Fields";
import { saveSetting } from "@/app/actions";
import { getSetting } from "@/lib/settings";

export default async function Page() {
  const video = await getSetting("intro_video");
  return (
    <>
      <PanelTitle title="Site ayarları" />
      <div className="card max-w-3xl bg-paper md:p-8">
        <h2 className="text-2xl">Ana sayfa tanıtım videosu</h2>
        <p className="mb-4 mt-1 text-muted">Videonuzu YouTube'a (isterseniz “Liste dışı” olarak) ya da Vimeo'ya yükleyin, bağlantısını buraya yapıştırın. Boş bırakırsanız ana sayfada “çok yakında” görünür.</p>
        <ActionForm action={saveSetting} submit="Kaydet">
          <input type="hidden" name="key" value="intro_video" />
          <Input name="value" label="Video bağlantısı" defaultValue={video} placeholder="https://www.youtube.com/watch?v=..." />
        </ActionForm>
        {video && <VideoPlayer url={video} title="Tanıtım videosu önizleme" className="mt-6 aspect-video rounded-2xl" />}
      </div>
    </>
  );
}
