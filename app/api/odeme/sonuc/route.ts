import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { retrieveCheckout } from "@/lib/iyzico";
import { SITE } from "@/lib/site";

// iyzico ödeme sonrası bu adrese POST eder (callbackUrl).
export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") || "");
  const back = (q: string) => NextResponse.redirect(new URL(`/panel/egitimlerim?odeme=${q}`, SITE.url), 303);
  const admin = createServiceClient();
  if (!token || !admin) return back("hata");
  const res = await retrieveCheckout(token);
  const { data: order } = await admin.from("orders").select("*").eq("iyzico_token", token).maybeSingle();
  if (!order) return back("hata");
  if (order.status === "odendi") return back("tamam");
  const ok = res.status === "success" && res.paymentStatus === "SUCCESS" && res.basketId === order.id && Number(res.paidPrice) >= Number(order.amount);
  await admin.from("orders").update(ok ? { status: "odendi", payment_id: res.paymentId, paid_at: new Date().toISOString() } : { status: "basarisiz" }).eq("id", order.id);
  return back(ok ? "tamam" : "basarisiz");
}
