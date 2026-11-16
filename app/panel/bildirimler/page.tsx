import PanelTitle, { Empty } from "@/components/PanelTitle";
import { createClient, getMe } from "@/lib/supabase/server";
import { trDate } from "@/lib/site";

export default async function Page() {
  const me = (await getMe())!;
  const supabase = await createClient();
  const { data: msgs } = await supabase.from("messages").select("*").eq("to_user", me.id).order("created_at", { ascending: false }).limit(50);
  if (msgs?.some((m) => !m.read)) await supabase.from("messages").update({ read: true }).eq("to_user", me.id).eq("read", false);
  return (
    <>
      <PanelTitle title="Bildirimler" lead="Çocuğunuz bir sonucu paylaştığında burada ve seçtiğiniz kanalda (e-posta, WhatsApp) görünür." />
      {msgs?.length ? (
        <div className="grid gap-4">
          {msgs.map((m) => (
            <article key={m.id} className={`card ${m.read ? "" : "ring-2 ring-accent"}`}>
              <div className="flex flex-wrap justify-between gap-2"><b className="font-display text-xl">{m.subject}</b><span className="text-sm text-muted">{trDate(m.created_at)}</span></div>
              <p className="mt-3 whitespace-pre-wrap text-ink/85">{m.body}</p>
            </article>
          ))}
        </div>
      ) : <Empty>Henüz bildirim yok.</Empty>}
    </>
  );
}
