"use client";
import { useState } from "react";
import ActionForm from "./ActionForm";
import { Input, Textarea } from "./Fields";
import { createProgram } from "@/app/actions";
import { BEHAVIORS } from "@/lib/behaviors";
const BG: Record<string, string> = { blush: "bg-blush", sky: "bg-sky", butter: "bg-butter", sage: "bg-sage" };

export default function NewProgramForm({ initial }: { initial?: string }) {
  const [key, setKey] = useState(initial && BEHAVIORS.some((b) => b.key === initial) ? initial : "");
  const b = BEHAVIORS.find((x) => x.key === key);
  return (
    <ActionForm action={createProgram} submit="Programı başlat" className="grid gap-6">
      <fieldset>
        <legend className="mb-3 font-display text-xl font-bold">1. Hangi davranış üzerinde çalışmak istiyorsunuz?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {BEHAVIORS.map((x) => (
            <label key={x.key} className={`cursor-pointer rounded-2xl border-2 p-4 transition ${key === x.key ? `border-action ${BG[x.color]}` : "border-line hover:border-ink/30"}`}>
              <input type="radio" name="behavior_key" value={x.key} checked={key === x.key} onChange={() => setKey(x.key)} className="sr-only" required />
              <b className="font-display text-lg">{x.title}</b> <span className="text-sm text-muted">· {x.age}</span>
              <p className="text-sm text-ink/70">{x.short}</p>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="grid gap-4">
        <legend className="mb-3 font-display text-xl font-bold">2. Çocuğunuz</legend>
        <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
          <Input name="child_name" label="Adı" required />
          <Input name="child_age" label="Yaşı" type="number" min={1} max={19} />
        </div>
      </fieldset>
      <fieldset className="grid gap-4">
        <legend className="mb-3 font-display text-xl font-bold">3. Davranışı tanımlayın</legend>
        <Textarea name="problem_desc" label="Davranış tam olarak nasıl görünüyor?" rows={3} hint="Gözlemlenebilir şekilde yazın. “Sinirli” yerine “bağırıyor, kapıyı çarpıyor” gibi." />
        <Input key={key} name="target_behavior" label="Bunun yerine görmek istediğiniz davranış" defaultValue={b?.target} hint="Olumlu ve ölçülebilir bir hedef. Önerimizi değiştirebilirsiniz." />
      </fieldset>
    </ActionForm>
  );
}
