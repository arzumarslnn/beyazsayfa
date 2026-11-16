import { TESTS, type TestKey } from "@/lib/tests";
export default function ScoreBars({ test, scores }: { test: TestKey; scores: Record<string, number> }) {
  return (
    <div className="grid gap-3">
      {Object.entries(TESTS[test].types).map(([k, t]) => (
        <div key={k} className="grid grid-cols-[110px_1fr_48px] items-center gap-3 font-semibold sm:grid-cols-[140px_1fr_52px]">
          <span>{t.name}</span>
          <span className="h-3.5 overflow-hidden rounded-full bg-paper"><i className="block h-full rounded-full" style={{ width: `${scores[k] ?? 0}%`, background: t.color }} /></span>
          <span className="text-right tabular-nums">%{scores[k] ?? 0}</span>
        </div>
      ))}
    </div>
  );
}
