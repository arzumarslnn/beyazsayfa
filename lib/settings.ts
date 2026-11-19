import { createClient } from "@/lib/supabase/server";
export async function getSetting(key: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
    return data?.value ?? "";
  } catch { return ""; }
}
