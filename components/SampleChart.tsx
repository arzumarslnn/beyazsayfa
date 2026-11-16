import LineChart from "./LineChart";
const prob = [5, 6, 4, 5, 6, 5, 4, 4, 3, 4, 3, 3, 2, 3, 2, 2, 3, 2, 1, 2, 2];
const pos = [1, 1, 2, 1, 2, 2, 3, 2, 3, 3, 3, 4, 3, 4, 4, 4, 3, 5, 4, 4, 5];
export default function SampleChart() {
  return (
    <div className="mt-4">
      <LineChart labels={prob.map((_, i) => `${i + 1}. gün`)} series={[
        { name: "Nöbet sayısı", color: "rgb(var(--accent))", values: prob },
        { name: "Olumlu davranış", color: "rgb(var(--action))", values: pos },
      ]} />
    </div>
  );
}
