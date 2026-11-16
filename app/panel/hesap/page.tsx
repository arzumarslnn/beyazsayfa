import PanelTitle from "@/components/PanelTitle";
import ActionForm from "@/components/ActionForm";
import { Input, Select } from "@/components/Fields";
import { updateProfile, linkParent } from "@/app/actions";
import { createClient, getMe } from "@/lib/supabase/server";

export default async function Page() {
  const me = (await getMe())!;
  const supabase = await createClient();
  let parent: { full_name: string; email: string } | null = null;
  let children: { full_name: string; email: string }[] = [];
  if (me.parent_id) parent = (await supabase.from("profiles").select("full_name,email").eq("id", me.parent_id).maybeSingle()).data;
  if (me.role === "veli") children = (await supabase.from("profiles").select("full_name,email").eq("parent_id", me.id)).data ?? [];
  return (
    <>
      <PanelTitle title="Hesabım" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card md:p-8">
          <h2 className="mb-4 text-2xl">Bilgilerim</h2>
          <ActionForm action={updateProfile} submit="Kaydet">
            <Input name="full_name" label="Ad soyad" defaultValue={me.full_name} required />
            <Input name="email_ro" label="E-posta" defaultValue={me.email} disabled />
            <Input name="phone" label="Telefon (WhatsApp)" type="tel" defaultValue={me.phone} />
            {me.role === "ogrenci" && <Input name="grade" label="Sınıf" defaultValue={me.grade} />}
            {me.role === "veli" && <Select name="notify" label="Çocuğumun paylaştığı sonuçlar bana nasıl ulaşsın?" defaultValue={me.notify}
              options={[["ikisi", "E-posta ve WhatsApp"], ["eposta", "Yalnızca e-posta"], ["whatsapp", "Yalnızca WhatsApp"]]} />}
          </ActionForm>
        </div>
        {me.role === "ogrenci" && (
          <div className="card md:p-8">
            <h2 className="text-2xl">Veli bağlantısı</h2>
            {parent ? <p className="mt-3 rounded-2xl bg-sage p-4">Bağlı velin: <b>{parent.full_name}</b> ({parent.email})</p> : <p className="mt-3 text-muted">Hesabına bağlı bir veli yok.</p>}
            <p className="my-4 text-muted">Bağlantı, velinin yalnızca senin paylaştığın test ve deneme sonuçlarını görmesini sağlar. Formların her zaman gizli kalır.</p>
            <ActionForm action={linkParent} submit={parent ? "Veliyi değiştir" : "Velimi bağla"}>
              <Input name="email" label="Velinin e-postası" type="email" required hint="Velin önce veli olarak üye olmalı." />
            </ActionForm>
          </div>
        )}
        {me.role === "veli" && (
          <div className="card md:p-8">
            <h2 className="text-2xl">Bağlı çocuklarım</h2>
            {children.length ? <ul className="mt-3 grid gap-2">{children.map((c) => <li key={c.email} className="rounded-2xl bg-paper p-4"><b>{c.full_name}</b> · {c.email}</li>)}</ul>
              : <p className="mt-3 text-muted">Henüz bağlı öğrenci yok. Çocuğunuz kendi panelindeki “Hesabım” sayfasından sizin e-postanızı ({me.email}) yazarak bağlantı kurabilir.</p>}
          </div>
        )}
      </div>
    </>
  );
}
