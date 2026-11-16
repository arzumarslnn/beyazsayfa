"use client";
import { useActionState, useEffect, useRef } from "react";
import type { ActionState } from "@/app/actions";

type Props = {
  action: (s: ActionState, f: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submit: string;
  className?: string;
  resetOnOk?: boolean;
  submitClass?: string;
  okView?: React.ReactNode;
};

export default function ActionForm({ action, children, submit, className = "grid gap-4", resetOnOk = false, submitClass = "btn-primary", okView }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok && resetOnOk) ref.current?.reset(); }, [state, resetOnOk]);
  if (state?.ok && okView) return <>{okView}</>;
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state?.error && <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">{state.error}</p>}
      {state?.ok && state.msg && <p role="status" className="rounded-2xl bg-sage px-4 py-3 font-semibold">{state.msg}</p>}
      <div><button type="submit" disabled={pending} className={submitClass}>{pending ? "Gönderiliyor…" : submit}</button></div>
    </form>
  );
}
