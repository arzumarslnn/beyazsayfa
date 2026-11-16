type Series = { name: string; color: string; values: (number | null)[] };

/** Basit çizgi grafiği: günlük problem ve olumlu davranış sayıları. */
export default function LineChart({ labels, series, height = 220 }: { labels: string[]; series: Series[]; height?: number }) {
  const W = 640, H = height, L = 34, R = 12, T = 14, B = 30;
  const max = Math.max(4, ...series.flatMap((s) => s.values.filter((v): v is number => v != null)));
  const top = Math.ceil(max / 2) * 2;
  const n = Math.max(labels.length, 2);
  const x = (i: number) => L + (i * (W - L - R)) / (n - 1);
  const y = (v: number) => T + (1 - v / top) * (H - T - B);
  const ticks = [0, top / 2, top];
  const every = Math.ceil(labels.length / 7);
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={series.map((s) => s.name).join(" ve ") + " grafiği"}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="rgb(var(--line))" strokeWidth="1" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="rgb(var(--muted))">{t}</text>
          </g>
        ))}
        {labels.map((l, i) => (i % every === 0 || i === labels.length - 1) && (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="rgb(var(--muted))">{l}</text>
        ))}
        {series.map((s) => {
          const pts = s.values.map((v, i) => (v == null ? null : [x(i), y(v)] as const)).filter(Boolean) as (readonly [number, number])[];
          if (!pts.length) return null;
          const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
          const area = `${d} L${pts[pts.length - 1][0].toFixed(1)},${y(0)} L${pts[0][0].toFixed(1)},${y(0)} Z`;
          const last = pts[pts.length - 1];
          return (
            <g key={s.name}>
              <path d={area} fill={s.color} opacity="0.1" />
              <path d={d} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={last[0]} cy={last[1]} r="4.5" fill={s.color} stroke="white" strokeWidth="2" />
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-4 text-sm font-semibold">
        {series.map((s) => (<span key={s.name} className="flex items-center gap-2"><i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.name}</span>))}
      </figcaption>
    </figure>
  );
}
