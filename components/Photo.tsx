import Image from "next/image";
import { PHOTOS } from "@/lib/photos";

const TINTS = ["bg-blush", "bg-sky", "bg-butter", "bg-sage"];

/** Fotoğraf yeri. lib/photos.ts içinde adres yoksa renkli bir alan ve açıklaması gösterilir. */
export default function Photo({ id, className = "", sizes = "(max-width: 768px) 100vw, 50vw", priority = false, tint }: { id: string; className?: string; sizes?: string; priority?: boolean; tint?: string }) {
  const p = PHOTOS[id] ?? { src: "", alt: "" };
  const bg = tint ?? TINTS[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % TINTS.length];
  return (
    <div className={`relative overflow-hidden ${bg} ${className}`} onContextMenu={undefined}>
      {p.src ? (
        <Image src={p.src} alt={p.alt} fill sizes={sizes} priority={priority} className="object-cover" draggable={false} />
      ) : (
        <div className="absolute inset-0 flex items-start p-5">
          <span className="rounded-full bg-bg/80 px-3 py-1 text-xs font-semibold text-muted">Fotoğraf: {p.alt}</span>
        </div>
      )}
    </div>
  );
}
