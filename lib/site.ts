// Sitenin adı ve iletişim bilgileri tek yerden yönetilir.
export const SITE = {
  name: "Beyazsayfa",
  tagline: "Aile ve öğrenci koçluğu",
  slogan: "Her çocuk için temiz bir sayfa, her aile için yeni bir başlangıç.",
  email: "merhaba@beyazsayfa.com", // TODO: gerçek adres
  phone: "0 (5XX) XXX XX XX", // TODO: gerçek numara
  whatsapp: "905000000000", // TODO: başında 90 olacak şekilde, boşluksuz
  address: "İstanbul", // TODO
  instagram: "", // TODO: https://instagram.com/...
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const whatsappLink = (text: string, phone = SITE.whatsapp) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

/** "0 (532) 123 45 67" -> "905321234567" */
export function toWaNumber(phone?: string | null) {
  if (!phone) return "";
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) d = d.slice(1);
  if (!d.startsWith("90")) d = "90" + d;
  return d;
}

export const tl = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

export const trDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
