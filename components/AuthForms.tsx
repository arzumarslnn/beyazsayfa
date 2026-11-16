"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input, Check } from "./Fields";

const trError = (m: string) =>
  /invalid login/i.test(m) ? "E-posta ya da şifre hatalı." :
  /email not confirmed/i.test(m) ? "E-posta adresiniz henüz doğrulanmadı. Gelen kutunuzdaki bağlantıya tıklayın." :
  /already registered|already been registered/i.test(m) ? "Bu e-postayla zaten bir hesap var. Giriş yapabilirsiniz." :
  /password should be at least/i.test(m) ? "Şifre en az 8 karakter olmalı." :
  /rate limit/i.test(m) ? "Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin." : "Bir sorun oluştu: " + m;

export function LoginForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  return (
    <form className="grid gap-4" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setErr("");
      const f = new FormData(e.currentTarget);
      const { error } = await createClient().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
      setBusy(false);
      if (error) return setErr(trError(error.message));
      router.push(sp.get("sonra") || "/panel"); router.refresh();
    }}>
      <Input name="email" label="E-posta" type="email" required autoComplete="email" />
      <Input name="password" label="Şifre" type="password" required autoComplete="current-password" />
      {err && <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">{err}</p>}
      <button className="btn-primary" disabled={busy}>{busy ? "Giriş yapılıyor…" : "Giriş yap"}</button>
      <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold">
        <Link href="/sifremi-unuttum" className="text-muted hover:text-ink">Şifremi unuttum</Link>
        <Link href={`/kayit${sp.get("sonra") ? `?sonra=${encodeURIComponent(sp.get("sonra")!)}` : ""}`} className="text-action">Hesabın yok mu? Üye ol</Link>
      </div>
    </form>
  );
}

export function RegisterForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState(sp.get("rol") === "ogrenci" ? "ogrenci" : "veli");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [sent, setSent] = useState("");
  if (sent) return (
    <div className="flex flex-col gap-3">
      <span className="chip self-start bg-sage text-ink">Neredeyse tamam</span>
      <h2 className="text-3xl">E-postanı kontrol et</h2>
      <p className="text-lg text-muted"><b className="text-ink">{sent}</b> adresine bir doğrulama bağlantısı gönderdik. Bağlantıya tıkladığında hesabın açılacak.</p>
    </div>
  );
  return (
    <form className="grid gap-4" onSubmit={async (e) => {
      e.preventDefault(); setErr("");
      const f = new FormData(e.currentTarget);
      const password = String(f.get("password"));
      if (password.length < 8) return setErr("Şifre en az 8 karakter olmalı.");
      setBusy(true);
      const email = String(f.get("email")).trim();
      const next = sp.get("sonra") || "/panel";
      const { data, error } = await createClient().auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?sonra=${encodeURIComponent(next)}`,
          data: { role, full_name: String(f.get("full_name")).trim(), phone: String(f.get("phone") || "").trim(), grade: String(f.get("grade") || "").trim(), link_email: String(f.get("link_email") || "").trim() },
        },
      });
      setBusy(false);
      if (error) return setErr(trError(error.message));
      if (data.session) { router.push(next); router.refresh(); } else setSent(email);
    }}>
      <fieldset className="grid grid-cols-2 gap-2 rounded-2xl bg-paper p-1.5">
        <legend className="sr-only">Hesap türü</legend>
        {[["veli", "Veliyim"], ["ogrenci", "Öğrenciyim"]].map(([v, l]) => (
          <label key={v} className={`cursor-pointer rounded-xl py-2.5 text-center font-bold ${role === v ? "bg-bg shadow-sm" : "text-muted"}`}>
            <input type="radio" name="role" value={v} checked={role === v} onChange={() => setRole(v)} className="sr-only" />{l}
          </label>
        ))}
      </fieldset>
      <Input name="full_name" label="Ad soyad" required autoComplete="name" />
      <Input name="email" label="E-posta" type="email" required autoComplete="email" />
      <Input name="password" label="Şifre" type="password" required autoComplete="new-password" hint="En az 8 karakter" minLength={8} />
      <Input name="phone" label="Telefon (WhatsApp)" type="tel" autoComplete="tel" hint={role === "veli" ? "Çocuğunuzun paylaştığı sonuçlar için" : undefined} />
      {role === "ogrenci" && <Input name="grade" label="Sınıfın" placeholder="Örn. 10. sınıf" />}
      <Input name="link_email" type="email" label={role === "ogrenci" ? "Velinin e-postası" : "Çocuğunuzun e-postası"}
        hint={role === "ogrenci" ? "İsteğe bağlı. Velin üye olduysa hesaplarınız bağlanır; neyi paylaşacağına sen karar verirsin." : "İsteğe bağlı. Çocuğunuz üyeyse hesaplarınız bağlanır."} />
      <Check name="kvkk" required><Link href="/yasal/kvkk" target="_blank" className="underline">KVKK aydınlatma metnini</Link> okudum ve kabul ediyorum.</Check>
      {err && <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">{err}</p>}
      <button className="btn-primary" disabled={busy}>{busy ? "Hesap açılıyor…" : "Üye ol"}</button>
      <p className="text-sm font-semibold text-muted">Zaten üye misin? <Link href={`/giris${sp.get("sonra") ? `?sonra=${encodeURIComponent(sp.get("sonra")!)}` : ""}`} className="text-action">Giriş yap</Link></p>
    </form>
  );
}

export function ForgotForm() {
  const [sent, setSent] = useState(false); const [err, setErr] = useState("");
  if (sent) return <p className="rounded-2xl bg-sage p-4 font-semibold">Şifre yenileme bağlantısı e-posta adresinize gönderildi.</p>;
  return (
    <form className="grid gap-4" onSubmit={async (e) => {
      e.preventDefault();
      const email = String(new FormData(e.currentTarget).get("email"));
      const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?sonra=/sifre-yenile` });
      if (error) setErr(trError(error.message)); else setSent(true);
    }}>
      <Input name="email" label="E-posta" type="email" required />
      {err && <p className="rounded-2xl bg-blush px-4 py-3 font-semibold">{err}</p>}
      <button className="btn-primary">Bağlantı gönder</button>
    </form>
  );
}

export function ResetForm() {
  const router = useRouter(); const [err, setErr] = useState("");
  return (
    <form className="grid gap-4" onSubmit={async (e) => {
      e.preventDefault();
      const password = String(new FormData(e.currentTarget).get("password"));
      if (password.length < 8) return setErr("Şifre en az 8 karakter olmalı.");
      const { error } = await createClient().auth.updateUser({ password });
      if (error) setErr(trError(error.message)); else { router.push("/panel"); router.refresh(); }
    }}>
      <Input name="password" label="Yeni şifre" type="password" required minLength={8} autoComplete="new-password" />
      {err && <p className="rounded-2xl bg-blush px-4 py-3 font-semibold">{err}</p>}
      <button className="btn-primary">Şifreyi kaydet</button>
    </form>
  );
}
