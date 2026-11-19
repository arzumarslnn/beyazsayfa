/** YouTube / Vimeo bağlantısını gömme adresine çevirir; doğrudan video dosyasıysa "file" döner. */
export function videoSource(url?: string | null): { kind: "embed" | "file"; src: string } | null {
  if (!url) return null;
  const u = url.trim();
  if (!u) return null;
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "embed", src: `https://player.vimeo.com/video/${vm[1]}` };
  if (/^https?:\/\/.+\.(mp4|webm|mov)(\?.*)?$/i.test(u) || u.includes("/storage/v1/object/")) return { kind: "file", src: u };
  return null;
}
