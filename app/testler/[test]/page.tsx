import { notFound, redirect } from "next/navigation";
import TestRunner from "@/components/TestRunner";
import { TESTS, type TestKey } from "@/lib/tests";
import { createClient, getMe } from "@/lib/supabase/server";

export function generateStaticParams() { return Object.keys(TESTS).map((test) => ({ test })); }
export async function generateMetadata({ params }: { params: Promise<{ test: string }> }) {
  return { title: TESTS[(await params).test as TestKey]?.title ?? "Test" };
}
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ test: string }> }) {
  const { test } = await params;
  if (!(test in TESTS)) notFound();
  const me = await getMe().catch(() => null);
  if (!me) redirect(`/giris?sonra=/testler/${test}`);
  const supabase = await createClient();
  const { data: access } = await supabase.rpc("has_access", { p_key: "testler" });
  if (!access) redirect("/testler");
  return <section className="wrap py-12 md:py-16"><TestRunner test={test as TestKey} role={me?.role ?? null} /></section>;
}
