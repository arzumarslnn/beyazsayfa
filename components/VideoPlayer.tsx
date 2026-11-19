import { videoSource } from "@/lib/video";
export default function VideoPlayer({ url, title, className = "" }: { url: string; title: string; className?: string }) {
  const v = videoSource(url);
  if (!v) return null;
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      {v.kind === "embed" ? (
        <iframe src={v.src} title={title} className="absolute inset-0 h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
      ) : (
        <video src={v.src} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}
