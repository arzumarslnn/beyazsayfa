import Link from "next/link";
import VideoPlayer from "./VideoPlayer";
import { createClient } from "@/lib/supabase/server";

export type Story = { id: string; display_name: string; role_label: string; body: string; video_path: string | null; video_url: string | null; videoSrc?: string | null };

/** Onaylı yazılı ve video deneyimler. Video dosyaları için geçici izleme bağlantısı üretir. */
export async function getStories(limit?: number): Promise<Story[]> {
  try {
    const supabase = await createClient();
    let q = supabase.from("testimonials").select("id,display_name,role_label,body,video_path,video_url").eq("approved", true).order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data } = await q;
    const rows = (data ?? []) as Story[];
    return Promise.all(rows.map(async (r) => {
      if (r.video_path) {
        const { data: s } = await supabase.storage.from("deneyimler").createSignedUrl(r.video_path, 60 * 60 * 6);
        return { ...r, videoSrc: s?.signedUrl ?? null };
      }
      return { ...r, videoSrc: r.video_url };
    }));
  } catch { return []; }
}

const TINTS = ["bg-sky", "bg-sage", "bg-blush", "bg-butter"];

export function StoryGrid({ stories }: { stories: Story[] }) {
  return (
    <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
      {stories.map((s, i) => (
        <figure key={s.id} className={`${s.videoSrc ? "bg-paper" : TINTS[i % 4]} mb-5 break-inside-avoid overflow-hidden rounded-3xl`}>
          {s.videoSrc && <VideoPlayer url={s.videoSrc} title={`${s.display_name} anlatıyor`} className="aspect-video" />}
          <div className="p-6">
            {s.body && <blockquote className="font-display text-lg font-semibold leading-snug">“{s.body}”</blockquote>}
            <figcaption className="mt-3 font-bold">{s.display_name} <span className="font-normal text-muted">· {s.role_label}</span></figcaption>
          </div>
        </figure>
      ))}
    </div>
  );
}

export function ShareCta() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-[2rem] bg-paper p-7 md:flex-row md:items-center md:justify-between md:p-10">
      <div className="max-w-xl">
        <h3>Siz de anlatın</h3>
        <p className="mt-2 text-muted">Bizimle çalışan bir veli ya da öğrenciyseniz deneyiminizi yazarak ya da kısa bir video çekerek paylaşabilirsiniz. Paylaşımlar onayınızla yayınlanır.</p>
      </div>
      <Link href="/deneyimler#paylas" className="btn-primary">Deneyimimi paylaş</Link>
    </div>
  );
}
