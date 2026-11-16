export default function Marquee({ items, className = "bg-ink text-bg" }: { items: string[]; className?: string }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`overflow-hidden py-3 ${className}`} aria-hidden="true">
      <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-lg font-bold">
        {row.map((t, i) => (<span key={i} className="flex items-center gap-10">{t}<span className="text-accent">✦</span></span>))}
      </div>
    </div>
  );
}
