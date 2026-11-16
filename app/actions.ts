"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient, createServiceClient, getMe } from "@/lib/supabase/server";
import { TESTS, score, dominant, resultText, type TestKey } from "@/lib/tests";
import { formByNo } from "@/lib/forms";
import { behaviorByKey } from "@/lib/behaviors";
import { productByKey } from "@/lib/catalog";
import { sendEmail } from "@/lib/email";
import { initCheckout, iyzicoReady } from "@/lib/iyzico";
import { SITE, toWaNumber, trDate } from "@/lib/site";

export type ActionState = { ok?: boolean; error?: string; msg?: string; data?: any } | undefined;

const str = (f: FormData, k: string, max = 4000) => String(f.get(k) ?? "").trim().slice(0, max);

async function requireMe() {
  const me = await getMe();
  if (!me) redirect("/giris");
  return me;
}
async function requireAdmin() {
  const me = await requireMe();
  if (me.role !== "yonetim") redirect("/panel");
  return me;
}

/* ---------------- Randevu ---------------- */
export async function submitAppointment(_: ActionState, f: FormData): Promise<ActionState> {
  if (!f.get("kvkk")) return { error: "Devam etmek için KVKK onay kutusunu işaretleyin." };
  const name = str(f, "name", 120), phone = str(f, "phone", 40);
  if (!name || !phone) return { error: "Ad soyad ve telefon gerekli." };
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    name, phone, email: str(f, "email", 160) || null, who: str(f, "who", 40), topic: str(f, "topic", 120),
    pref_date: str(f, "pref_date", 10) || null, time_slot: str(f, "time_slot", 40), note: str(f, "note", 2000) || null,
  });
  if (error) return { error: "Talebiniz kaydedilemedi, lütfen tekrar deneyin ya da WhatsApp'tan yazın." };
  if (process.env.ADMIN_EMAIL) {
    await sendEmail(process.env.ADMIN_EMAIL, `Yeni randevu talebi: ${name}`, `${name} (${phone}) randevu talep etti.\nKonu: ${str(f, "topic")}\nTercih: ${str(f, "pref_date")} ${str(f, "time_slot")}\nNot: ${str(f, "note")}`);
  }
  return { ok: true, msg: "Talebiniz alındı. En geç 24 saat içinde sizi arayacağız." };
}

/* ---------------- Deneyim ---------------- */
export async function submitTestimonial(_: ActionState, f: FormData): Promise<ActionState> {
  const me = await requireMe();
  const body = str(f, "body", 1200);
  if (body.length < 20) return { error: "Lütfen deneyiminizi biraz daha ayrıntılı yazın." };
  if (!f.get("izin")) return { error: "Yayın izni kutusunu işaretleyin." };
  const display = me.full_name ? `${me.full_name.split(" ")[0]} ${(me.full_name.split(" ")[1] || "").charAt(0)}.`.trim() : "Bir üyemiz";
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({ display_name: display, role_label: me.role === "ogrenci" ? "Öğrenci" : "Veli", body });
  if (error) return { error: "Gönderilemedi, tekrar deneyin." };
  return { ok: true, msg: "Teşekkürler! Paylaşımınız onaylandıktan sonra yayınlanacak." };
}

/* ---------------- Testler ---------------- */
export async function saveTestResult(test: TestKey, answers: string[]): Promise<{ id?: string; error?: string }> {
  const me = await getMe();
  if (!me) return { error: "giris" };
  if (me.role !== "ogrenci") return { error: "rol" };
  if (!TESTS[test] || answers.length !== TESTS[test].questions.length) return { error: "gecersiz" };
  const sc = score(test, answers);
  const supabase = await createClient();
  const { data, error } = await supabase.from("test_results").insert({ test, scores: sc, dominant: dominant(sc) }).select("id").single();
  if (error) return { error: "kayit" };
  revalidatePath("/panel");
  return { id: data.id };
}

export async function shareItem(kind: "test" | "deneme", id: string, share: boolean): Promise<ActionState> {
  const me = await requireMe();
  const supabase = await createClient();
  let subject = "", body = "";
  if (kind === "test") {
    const { data: r } = await supabase.from("test_results").select("*").eq("id", id).single();
    if (!r) return { error: "Sonuç bulunamadı." };
    subject = `${TESTS[r.test as TestKey].title} sonucu: ${me.full_name}`;
    body = resultText(r.test, me.full_name, r.scores, trDate(r.created_at));
  } else {
    const { data: d } = await supabase.from("denemeler").select("*").eq("id", id).single();
    if (!d) return { error: "Deneme bulunamadı." };
    subject = `Deneme sonucu: ${me.full_name}`;
    body = `${me.full_name} bir deneme sonucunu sizinle paylaştı.\n\nDeneme: ${d.name}\nTarih: ${trDate(d.exam_date)}\nToplam net: ${d.net ?? "-"}`;
  }
  const fullBody = `${body}\n\nAyrıntılar için ${SITE.name} veli panelinize giriş yapabilirsiniz: ${SITE.url}/panel`;
  const { data, error } = await supabase.rpc("share_item", { p_kind: kind, p_id: id, p_share: share, p_subject: subject, p_body: fullBody });
  if (error) return { error: "Paylaşım güncellenemedi." };
  revalidatePath("/panel", "layout");
  const parent = (data as any)?.parent as { name: string; email: string; phone: string | null; notify: string } | null;
  if (!share) return { ok: true, msg: "Paylaşım kaldırıldı. Sonuç yalnızca sende ve koçunda." };
  if (!parent) return { ok: true, msg: "Hesabına bağlı bir veli yok. Hesabım sayfasından velini bağlayabilirsin." };
  let emailed = false;
  if (parent.notify !== "whatsapp") emailed = (await sendEmail(parent.email, subject, fullBody)).sent;
  const wa = parent.notify !== "eposta" && parent.phone ? `https://wa.me/${toWaNumber(parent.phone)}?text=${encodeURIComponent(fullBody)}` : null;
  return { ok: true, msg: emailed ? `${parent.name} e-postayla bilgilendirildi.` : `${parent.name} panelinden bilgilendirildi.`, data: { wa, parentName: parent.name } };
}

/* ---------------- Formlar ---------------- */
export async function saveForm(_: ActionState, f: FormData): Promise<ActionState> {
  const me = await requireMe();
  const no = Number(f.get("_form"));
  const def = formByNo(no);
  if (!def) return { error: "Form bulunamadı." };
  if (def.who === "yonetim" ? me.role !== "yonetim" : def.who !== me.role && me.role !== "yonetim") return { error: "Bu formu doldurma yetkiniz yok." };
  const data: Record<string, string> = {};
  for (const fl of def.fields) {
    const v = str(f, fl.k, 5000);
    if (fl.required && !v) return { error: `“${fl.label}” alanını doldurun.` };
    data[fl.k] = v;
  }
  const student = str(f, "_student", 60) || null;
  if (def.who === "yonetim" && !student) return { error: "Öğrenciyi seçin." };
  const supabase = await createClient();
  const { error } = await supabase.from("form_entries").insert({ form_no: no, data, student_id: student });
  if (error) return { error: "Form kaydedilemedi." };
  revalidatePath("/panel/formlar");
  redirect(`/panel/formlar?kaydedildi=${no}`);
}

/* ---------------- Denemeler ---------------- */
export async function addDeneme(_: ActionState, f: FormData): Promise<ActionState> {
  const me = await requireMe();
  const name = str(f, "name", 120);
  if (!name) return { error: "Deneme adını yazın." };
  const net = Number(str(f, "net", 12).replace(",", "."));
  const supabase = await createClient();
  let file_path: string | null = null;
  const file = f.get("file");
  if (file instanceof File && file.size > 0) {
    if (file.size > 5 * 1024 * 1024) return { error: "Dosya en fazla 5 MB olabilir." };
    const ext = (file.name.split(".").pop() || "dat").toLowerCase().replace(/[^a-z0-9]/g, "");
    file_path = `${me.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("denemeler").upload(file_path, file, { contentType: file.type });
    if (upErr) return { error: "Dosya yüklenemedi." };
  }
  const { data, error } = await supabase.from("denemeler").insert({ name, exam_date: str(f, "exam_date", 10) || undefined, net: isFinite(net) ? net : null, file_path }).select("id").single();
  if (error) return { error: "Kaydedilemedi." };
  if (f.get("share")) await shareItem("deneme", data.id, true);
  revalidatePath("/panel/denemeler");
  return { ok: true, msg: "Deneme kaydedildi." };
}
export async function deleteDeneme(id: string) {
  await requireMe();
  const supabase = await createClient();
  await supabase.from("denemeler").delete().eq("id", id);
  revalidatePath("/panel/denemeler");
}

/* ---------------- Hesap ---------------- */
export async function updateProfile(_: ActionState, f: FormData): Promise<ActionState> {
  const me = await requireMe();
  const notify = str(f, "notify", 10);
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({
    full_name: str(f, "full_name", 120) || me.full_name, phone: str(f, "phone", 40) || null, grade: str(f, "grade", 40) || null,
    ...(["eposta", "whatsapp", "ikisi"].includes(notify) ? { notify } : {}),
  }).eq("id", me.id);
  if (error) return { error: "Kaydedilemedi." };
  revalidatePath("/panel", "layout");
  return { ok: true, msg: "Bilgileriniz güncellendi." };
}
export async function linkParent(_: ActionState, f: FormData): Promise<ActionState> {
  await requireMe();
  const supabase = await createClient();
  const { data } = await supabase.rpc("link_parent", { p_email: str(f, "email", 160) });
  if (data === "ok") { revalidatePath("/panel", "layout"); return { ok: true, msg: "Velinle hesabın bağlandı." }; }
  if (data === "bulunamadi") return { error: "Bu e-postayla kayıtlı bir veli hesabı bulunamadı. Velin önce veli olarak üye olmalı." };
  return { error: "Bağlantı kurulamadı." };
}

/* ---------------- Davranış programı ---------------- */
export async function createProgram(_: ActionState, f: FormData): Promise<ActionState> {
  await requireMe();
  const key = str(f, "behavior_key", 20);
  const b = behaviorByKey(key);
  if (!b) return { error: "Bir davranış seçin." };
  const child_name = str(f, "child_name", 60);
  if (!child_name) return { error: "Çocuğunuzun adını yazın." };
  const age = Number(str(f, "child_age", 3));
  const supabase = await createClient();
  const { data, error } = await supabase.from("behavior_programs").insert({
    child_name, child_age: age >= 1 && age <= 19 ? age : null, behavior_key: key,
    problem_desc: str(f, "problem_desc", 1000) || null, target_behavior: str(f, "target_behavior", 300) || b.target,
  }).select("id").single();
  if (error) return { error: "Program oluşturulamadı." };
  redirect(`/panel/davranis/${data.id}?yeni=1`);
}
export async function addAbc(_: ActionState, f: FormData): Promise<ActionState> {
  await requireMe();
  const program_id = str(f, "program_id", 60);
  const antecedent = str(f, "antecedent", 20), consequence = str(f, "consequence", 20), behavior = str(f, "behavior", 600);
  if (!antecedent || !consequence || !behavior) return { error: "Önce, davranış ve sonra alanlarını doldurun." };
  const date = str(f, "date", 10), time = str(f, "time", 5);
  const occurred_at = date ? new Date(`${date}T${time || "12:00"}:00+03:00`).toISOString() : new Date().toISOString();
  const supabase = await createClient();
  const { error } = await supabase.from("abc_logs").insert({
    program_id, antecedent, consequence, behavior, occurred_at, setting: str(f, "setting", 200) || null,
    intensity: Number(f.get("intensity")) || null, duration_min: Number(f.get("duration_min")) || null,
  });
  if (error) return { error: "Kayıt eklenemedi." };
  revalidatePath(`/panel/davranis/${program_id}`);
  return { ok: true, msg: "ABC kaydı eklendi." };
}
export async function upsertDaily(_: ActionState, f: FormData): Promise<ActionState> {
  await requireMe();
  const program_id = str(f, "program_id", 60);
  const supabase = await createClient();
  const { error } = await supabase.from("daily_logs").upsert({
    program_id, day: str(f, "day", 10), problem_count: Math.max(0, Number(f.get("problem_count")) || 0),
    positive_count: Math.max(0, Number(f.get("positive_count")) || 0), plan_applied: !!f.get("plan_applied"),
    parent_calm: Number(f.get("parent_calm")) || null, note: str(f, "note", 600) || null,
  }, { onConflict: "program_id,day" });
  if (error) return { error: "Günlük kayıt kaydedilemedi." };
  revalidatePath(`/panel/davranis/${program_id}`);
  return { ok: true, msg: "Günlük kayıt kaydedildi." };
}
export async function setProgramStatus(id: string, status: "aktif" | "tamamlandi" | "durduruldu") {
  await requireMe();
  const supabase = await createClient();
  await supabase.from("behavior_programs").update({ status }).eq("id", id);
  revalidatePath("/panel/davranis");
  revalidatePath(`/panel/davranis/${id}`);
}
export async function deleteAbc(id: string, programId: string) {
  await requireMe();
  const supabase = await createClient();
  await supabase.from("abc_logs").delete().eq("id", id);
  revalidatePath(`/panel/davranis/${programId}`);
}

/* ---------------- Ödeme ---------------- */
export async function startCheckout(_: ActionState, f: FormData): Promise<ActionState> {
  const me = await requireMe();
  const p = productByKey(str(f, "product", 40));
  if (!p) return { error: "Ürün bulunamadı." };
  if (!iyzicoReady()) return { error: "Online ödeme henüz aktif değil. Havale ile satın almak için bize WhatsApp'tan yazın." };
  const admin = createServiceClient();
  if (!admin) return { error: "Ödeme altyapısı yapılandırılmamış (SUPABASE_SERVICE_ROLE_KEY)." };
  const buyer = {
    name: str(f, "name", 60), surname: str(f, "surname", 60), email: me.email, phone: str(f, "phone", 20),
    identityNumber: str(f, "tckn", 11), address: str(f, "address", 300), city: str(f, "city", 60),
    ip: ((await headers()).get("x-forwarded-for") || "85.34.78.112").split(",")[0].trim(),
  };
  if (!buyer.name || !buyer.surname || !buyer.address || !buyer.city || !/^\d{11}$/.test(buyer.identityNumber)) return { error: "Lütfen ad, soyad, 11 haneli T.C. kimlik no, adres ve şehir alanlarını doldurun." };
  if (!f.get("sozlesme")) return { error: "Mesafeli satış sözleşmesini onaylayın." };
  const { data: order, error } = await admin.from("orders").insert({ user_id: me.id, product_key: p.key, product_title: p.title, amount: p.price }).select("id").single();
  if (error || !order) return { error: "Sipariş oluşturulamadı." };
  const res = await initCheckout({
    orderId: order.id, price: p.price, title: p.title, category: p.kind === "egitim" ? "Ebeveyn eğitimi" : "Koçluk paketi", userId: me.id, buyer,
    callbackUrl: `${SITE.url}/api/odeme/sonuc`,
  });
  if (res.status !== "success" || !res.paymentPageUrl) {
    await admin.from("orders").update({ status: "basarisiz" }).eq("id", order.id);
    return { error: `Ödeme başlatılamadı: ${res.errorMessage ?? "bilinmeyen hata"}` };
  }
  await admin.from("orders").update({ iyzico_token: res.token }).eq("id", order.id);
  redirect(res.paymentPageUrl);
}

/* ---------------- Yönetim ---------------- */
export async function setAppointmentStatus(id: string, status: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("appointments").update({ status }).eq("id", id);
  revalidatePath("/panel/yonetim/randevular");
}
export async function moderateTestimonial(id: string, action: "onayla" | "gizle" | "sil") {
  await requireAdmin();
  const supabase = await createClient();
  if (action === "sil") await supabase.from("testimonials").delete().eq("id", id);
  else await supabase.from("testimonials").update({ approved: action === "onayla" }).eq("id", id);
  revalidatePath("/panel/yonetim/deneyimler");
  revalidatePath("/deneyimler");
  revalidatePath("/");
}
export async function addTestimonialAdmin(_: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  const body = str(f, "body", 1200), name = str(f, "display_name", 80);
  if (!body || !name) return { error: "İsim ve metin gerekli." };
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({ display_name: name, role_label: str(f, "role_label", 40) || "Veli", body, approved: true, user_id: null });
  if (error) return { error: "Eklenemedi." };
  revalidatePath("/panel/yonetim/deneyimler"); revalidatePath("/deneyimler"); revalidatePath("/");
  return { ok: true, msg: "Deneyim yayınlandı." };
}
export async function grantAccess(_: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  const p = productByKey(str(f, "product", 40));
  const email = str(f, "email", 160).toLowerCase();
  if (!p || !email) return { error: "Ürün ve e-posta gerekli." };
  const supabase = await createClient();
  const { data: user } = await supabase.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (!user) return { error: "Bu e-postayla kayıtlı üye yok." };
  const method = str(f, "method", 10) === "hediye" ? "hediye" : "havale";
  const { error } = await supabase.from("orders").insert({ user_id: user.id, product_key: p.key, product_title: p.title, amount: method === "hediye" ? 0 : p.price, status: "odendi", method, paid_at: new Date().toISOString() });
  if (error) return { error: "Erişim verilemedi." };
  revalidatePath("/panel/yonetim/siparisler");
  return { ok: true, msg: `${email} için “${p.title}” erişimi açıldı.` };
}
export async function saveBlogPost(_: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(f, "id", 60);
  const title = str(f, "title", 200);
  const slug = (str(f, "slug", 120) || title).toLocaleLowerCase("tr").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!title || !slug) return { error: "Başlık gerekli." };
  const row = { title, slug, category: str(f, "category", 60) || "Ebeveynlik", excerpt: str(f, "excerpt", 400), body: str(f, "body", 40000), cover: str(f, "cover", 40) || null, read_min: Number(f.get("read_min")) || 4, published: !!f.get("published") };
  const supabase = await createClient();
  const { error } = id ? await supabase.from("blog_posts").update(row).eq("id", id) : await supabase.from("blog_posts").insert(row);
  if (error) return { error: error.code === "23505" ? "Bu adres (slug) başka bir yazıda kullanılıyor." : "Kaydedilemedi." };
  revalidatePath("/blog"); revalidatePath(`/blog/${slug}`); revalidatePath("/");
  redirect("/panel/yonetim/blog");
}
export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/blog"); revalidatePath("/panel/yonetim/blog");
}

/* ---------------- Oturum ---------------- */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
