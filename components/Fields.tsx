import type { Field } from "@/lib/forms";

export function Input({ name, label, type = "text", required, hint, defaultValue, placeholder, ...rest }: { name: string; label: string; type?: string; required?: boolean; hint?: string; defaultValue?: string | number | null; placeholder?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "defaultValue">) {
  return (
    <label className="field" htmlFor={`f-${name}`}>
      <span>{label}{required && <span className="text-accent"> *</span>}</span>
      {hint && <span className="field-hint">{hint}</span>}
      <input id={`f-${name}`} name={name} type={type} required={required} defaultValue={defaultValue ?? undefined} placeholder={placeholder} className="input" {...rest} />
    </label>
  );
}
export function Textarea({ name, label, required, hint, defaultValue, rows = 4 }: { name: string; label: string; required?: boolean; hint?: string; defaultValue?: string; rows?: number }) {
  return (
    <label className="field" htmlFor={`f-${name}`}>
      <span>{label}{required && <span className="text-accent"> *</span>}</span>
      {hint && <span className="field-hint">{hint}</span>}
      <textarea id={`f-${name}`} name={name} required={required} defaultValue={defaultValue} rows={rows} className="input resize-y" />
    </label>
  );
}
export function Select({ name, label, options, required, defaultValue }: { name: string; label: string; options: (string | [string, string])[]; required?: boolean; defaultValue?: string }) {
  return (
    <label className="field" htmlFor={`f-${name}`}>
      <span>{label}{required && <span className="text-accent"> *</span>}</span>
      <select id={`f-${name}`} name={name} required={required} defaultValue={defaultValue} className="input">
        {options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}
      </select>
    </label>
  );
}
export function Scale({ name, label, required, defaultValue, low = "düşük", high = "yüksek" }: { name: string; label: string; required?: boolean; defaultValue?: string; low?: string; high?: string }) {
  return (
    <fieldset className="field">
      <legend className="mb-1.5">{label}{required && <span className="text-accent"> *</span>} <span className="field-hint">(1 {low}, 5 {high})</span></legend>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input type="radio" name={name} value={n} required={required} defaultChecked={defaultValue === String(n)} className="peer sr-only" />
            <span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-line font-bold peer-checked:border-action peer-checked:bg-action peer-checked:text-action-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent">{n}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
export function Check({ name, children, required, defaultChecked }: { name: string; children: React.ReactNode; required?: boolean; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-3 font-medium">
      <input type="checkbox" name={name} required={required} defaultChecked={defaultChecked} className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--action))]" />
      <span>{children}</span>
    </label>
  );
}
export function DynField({ f }: { f: Field }) {
  if (f.type === "textarea") return <Textarea name={f.k} label={f.label} required={f.required} hint={f.hint} />;
  if (f.type === "select") return <Select name={f.k} label={f.label} options={f.options ?? []} required={f.required} />;
  if (f.type === "scale") return <Scale name={f.k} label={f.label} required={f.required} />;
  return <Input name={f.k} label={f.label} type={f.type} required={f.required} hint={f.hint} />;
}
