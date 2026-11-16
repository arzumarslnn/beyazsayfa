import { createServerClient } from "@supabase/ssr";
import { createClient as createAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { cache } from "react";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            /* Server Component içinden çağrıldığında yok sayılır; middleware oturumu yeniler */
          }
        },
      },
    }
  );
}

/** Sadece sunucuda: RLS'i aşan yönetici istemcisi (ödeme onayı için). */
export function createServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createAdmin(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });
}

export type Role = "ogrenci" | "veli" | "yonetim";
export type Profile = {
  id: string;
  role: Role;
  full_name: string;
  email: string;
  phone: string | null;
  grade: string | null;
  notify: "eposta" | "whatsapp" | "ikisi";
  parent_id: string | null;
};

/** Giriş yapmış kullanıcının profili (istek başına bir kez okunur). */
export const getMe = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return (data as Profile) ?? null;
});
