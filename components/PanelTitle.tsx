export default function PanelTitle({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex max-w-2xl flex-col gap-2"><h1 className="text-3xl md:text-4xl">{title}</h1>{lead && <p className="text-lg text-muted">{lead}</p>}</div>
      {children}
    </div>
  );
}
export function Stat({ n, label, tint = "bg-paper" }: { n: React.ReactNode; label: string; tint?: string }) {
  return <div className={`${tint} rounded-3xl p-5`}><div className="font-display text-4xl font-extrabold tabular-nums">{n}</div><div className="mt-1 font-semibold text-ink">{label}</div></div>;
}
export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl border-2 border-dashed border-line p-10 text-center text-muted">{children}</div>;
}
export function Privacy({ children }: { children: React.ReactNode }) {
  return <p className="flex items-start gap-3 rounded-2xl bg-sky px-4 py-3 font-semibold"><span aria-hidden="true">🔒</span><span>{children}</span></p>;
}
