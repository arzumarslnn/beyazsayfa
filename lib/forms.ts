// Koçluk sürecindeki 15 form. Alanları buradan düzenleyebilirsiniz.
// who: formu kimin doldurduğu. "yonetim" formlarını sadece yönetim görür ve doldurur.
export type FieldType = "text" | "textarea" | "date" | "number" | "scale" | "select";
export type Field = { k: string; label: string; type: FieldType; options?: string[]; required?: boolean; hint?: string };
export type FormDef = { no: number; who: "ogrenci" | "veli" | "yonetim"; title: string; intro: string; fields: Field[]; repeatable?: boolean };

export const WHO_LABEL = { ogrenci: "Öğrenci formu", veli: "Veli formu", yonetim: "Koç formu" } as const;

export const FORMS: FormDef[] = [
  { no: 1, who: "yonetim", title: "Öğrenci Koçluğu İlk Görüşme Dosyası", intro: "Sürecin başında koç tarafından açılır.", fields: [
    { k: "okul", label: "Sınıf / okul", type: "text" }, { k: "tarih", label: "Görüşme tarihi", type: "date" },
    { k: "neden", label: "Başvuru nedeni", type: "textarea", required: true }, { k: "aile", label: "Ailenin beklentisi", type: "textarea" },
    { k: "ogrenci", label: "Öğrencinin beklentisi", type: "textarea" }, { k: "izlenim", label: "Koçun ilk izlenimi", type: "textarea" } ] },
  { no: 2, who: "veli", title: "Veli Ön Bilgilendirme Formu", intro: "Çocuğunuzu sizin gözünüzden tanımamıza yardımcı olur. Bu formu çocuğunuz göremez.", fields: [
    { k: "cocuk", label: "Çocuğunuzun adı", type: "text", required: true }, { k: "sinif", label: "Sınıfı", type: "text" },
    { k: "uc_kelime", label: "Çocuğunuzu üç kelimeyle anlatır mısınız?", type: "text" },
    { k: "duzen", label: "Evdeki çalışma düzeni nasıl?", type: "textarea" },
    { k: "endise", label: "En çok endişe duyduğunuz konu", type: "textarea", required: true },
    { k: "iletisim", label: "Evde iletişiminizi nasıl değerlendirirsiniz?", type: "scale" },
    { k: "beklenti", label: "Bu süreçten beklentiniz", type: "textarea", required: true },
    { k: "kanal", label: "Size nasıl ulaşalım?", type: "select", options: ["E-posta", "WhatsApp", "Telefon"] } ] },
  { no: 3, who: "ogrenci", title: "İlk Öğrenci Görüşme Formu", intro: "Seni tanımak istiyoruz. Yazdıklarını sadece koçun görür, velin göremez.", fields: [
    { k: "sinif", label: "Sınıfın", type: "text" }, { k: "sevdigi", label: "En sevdiğin ders", type: "text" },
    { k: "zor", label: "En zorlandığın ders", type: "text" }, { k: "bos", label: "Boş zamanlarında ne yaparsın?", type: "textarea" },
    { k: "motivasyon", label: "Kendini ne kadar motive hissediyorsun?", type: "scale" },
    { k: "beklenti", label: "Koçluktan beklentin ne?", type: "textarea", required: true } ] },
  { no: 4, who: "yonetim", title: "Koç Görüşme Not Formu", intro: "Her görüşmenin ardından doldurulur.", repeatable: true, fields: [
    { k: "tarih", label: "Görüşme tarihi", type: "date" }, { k: "konu", label: "Görüşme konusu", type: "text", required: true },
    { k: "gozlem", label: "Gözlemler", type: "textarea" }, { k: "karar", label: "Alınan kararlar", type: "textarea" },
    { k: "sonraki", label: "Sonraki görüşme", type: "date" } ] },
  { no: 5, who: "ogrenci", title: "Hedef Belirleme Formu", intro: "Hedefini sen koyarsın, biz yol arkadaşı oluruz.", fields: [
    { k: "kisa", label: "Kısa vadeli hedefim (4 hafta)", type: "textarea", required: true },
    { k: "uzun", label: "Uzun vadeli hedefim", type: "textarea" },
    { k: "neden", label: "Bu hedef benim için neden önemli?", type: "textarea" },
    { k: "engel", label: "Önümdeki engeller", type: "textarea" },
    { k: "ilk_adim", label: "Atacağım ilk adım", type: "text", required: true },
    { k: "baglilik", label: "Hedefime bağlılığım", type: "scale" } ] },
  { no: 6, who: "ogrenci", title: "Haftalık Takip Formu", intro: "Her hafta sonunda kısa bir değerlendirme.", repeatable: true, fields: [
    { k: "hafta", label: "Haftanın başlangıç tarihi", type: "date", required: true },
    { k: "plan", label: "Planladığım çalışma saati", type: "number" }, { k: "gercek", label: "Gerçekleşen çalışma saati", type: "number" },
    { k: "iyi", label: "Bu hafta iyi gidenler", type: "textarea" }, { k: "zor", label: "Zorlandığım konular", type: "textarea" },
    { k: "ruh", label: "Bu haftaki ruh halim", type: "scale" } ] },
  { no: 7, who: "yonetim", title: "Koç Haftalık Değerlendirme Formu", intro: "Haftalık takip formuna koçun yanıtı.", repeatable: true, fields: [
    { k: "hafta", label: "Hafta", type: "date" }, { k: "uyum", label: "Plana uyum", type: "scale" },
    { k: "guclu", label: "Güçlü yönler", type: "textarea" }, { k: "gelisim", label: "Gelişim alanları", type: "textarea" },
    { k: "veli_not", label: "Veliye iletilecek not", type: "textarea" } ] },
  { no: 8, who: "yonetim", title: "Mizaç ve Öğrenme Profili Özet Formu", intro: "Test sonuçlarının koç yorumu.", fields: [
    { k: "mizac", label: "Baskın mizaç", type: "select", options: ["Coşkulu", "Lider", "Düşünür", "Uyumlu"] },
    { k: "stil", label: "Öğrenme stili", type: "select", options: ["Görsel", "İşitsel", "Kinestetik"] },
    { k: "guclu", label: "Güçlü yönler", type: "textarea" }, { k: "dikkat", label: "Dikkat edilecekler", type: "textarea" },
    { k: "aile", label: "Aileye öneriler", type: "textarea" } ] },
  { no: 9, who: "ogrenci", title: "Meslek Yönelim Formu", intro: "Sevdiğin işi bulmanın ilk adımı kendini tanımak.", fields: [
    { k: "ilgi", label: "İlgi alanlarım", type: "textarea", required: true },
    { k: "akis", label: "Yaparken zamanın nasıl geçtiğini anlamadığım şeyler", type: "textarea" },
    { k: "meslek", label: "Düşündüğüm meslekler", type: "text" },
    { k: "aile", label: "Ailemin benim için düşündüğü bir meslek var mı?", type: "text" },
    { k: "on_yil", label: "10 yıl sonra kendimi nerede görüyorum?", type: "textarea" } ] },
  { no: 10, who: "ogrenci", title: "Öğrenci Uyum Formu", intro: "Süreç sana iyi geliyor mu? Dürüst ol, bu formu velin göremez.", fields: [
    { k: "koc", label: "Koçumla iletişimim", type: "scale", required: true }, { k: "aile", label: "Ailemle iletişimim", type: "scale", required: true },
    { k: "okul", label: "Okula uyumum", type: "scale" }, { k: "rahat", label: "Bu süreçte kendimi nasıl hissediyorum?", type: "textarea" },
    { k: "ek", label: "Eklemek istediklerim", type: "textarea" } ] },
  { no: 11, who: "yonetim", title: "4 Haftalık Ara Değerlendirme", intro: "İlk ayın sonunda plan gözden geçirilir.", fields: [
    { k: "donem", label: "Dönem", type: "text" }, { k: "hedef", label: "Hedeflere ulaşma düzeyi", type: "scale" },
    { k: "gozlem", label: "Öğrenci gözlemi", type: "textarea" }, { k: "veli", label: "Veli geri bildirimi özeti", type: "textarea" },
    { k: "revizyon", label: "Plan revizyonu", type: "textarea" } ] },
  { no: 12, who: "yonetim", title: "12 Haftalık Gelişme Formu", intro: "Sürecin genel değerlendirmesi.", fields: [
    { k: "baslangic", label: "Başlangıç durumu", type: "textarea" }, { k: "simdi", label: "Şimdiki durum", type: "textarea" },
    { k: "akademik", label: "Akademik gelişim", type: "scale" }, { k: "duygusal", label: "Duygusal gelişim", type: "scale" },
    { k: "aile", label: "Aile iletişimindeki gelişim", type: "scale" }, { k: "genel", label: "Genel değerlendirme", type: "textarea" } ] },
  { no: 13, who: "ogrenci", title: "Görüşme Sonu Öğrenci Öz Değerlendirmesi", intro: "Bu yolculukta neler değişti?", fields: [
    { k: "ogrendim", label: "Bu süreçte en çok ne öğrendim?", type: "textarea", required: true },
    { k: "aliskanlik", label: "Değişen bir alışkanlığım", type: "textarea" }, { k: "puan", label: "Kendime verdiğim puan", type: "scale" },
    { k: "tavsiye", label: "Koçluğu bir arkadaşına önerir misin?", type: "select", options: ["Evet", "Belki", "Hayır"] },
    { k: "mesaj", label: "Koçuma mesajım", type: "textarea" } ] },
  { no: 14, who: "veli", title: "Veli Son Değerlendirme Formu", intro: "Süreç sonunda sizin gözünüzden değişim.", fields: [
    { k: "degisim", label: "Çocuğunuzda gözlemlediğiniz değişim", type: "textarea", required: true },
    { k: "iletisim", label: "Evdeki iletişim", type: "scale", required: true }, { k: "memnuniyet", label: "Süreçten memnuniyetiniz", type: "scale", required: true },
    { k: "egitim", label: "Ebeveyn eğitimleri faydalı oldu mu?", type: "select", options: ["Çok faydalı", "Kısmen", "Katılmadım"] },
    { k: "oneri", label: "Önerileriniz", type: "textarea" } ] },
  { no: 15, who: "yonetim", title: "Dosya Kapanış Özeti", intro: "Süreç kapanırken son kayıt.", fields: [
    { k: "sure", label: "Süreç süresi", type: "text" }, { k: "ulasilan", label: "Ulaşılan hedefler", type: "textarea" },
    { k: "devam", label: "Devam eden alanlar", type: "textarea" }, { k: "oneri", label: "Öneriler", type: "textarea" },
    { k: "tarih", label: "Kapanış tarihi", type: "date" } ] },
];

export const formByNo = (no: number) => FORMS.find((f) => f.no === no);

/** Koçluk sürecinin adımları ve her adımda kullanılan formlar. */
export const PROCESS = [
  { t: "Tanışma", d: "Veli ön bilgilendirme formunu, öğrenci ilk görüşme formunu doldurur. Koç ilk görüşme dosyasını açar ve aileyle birlikte ilk görüşmeyi yapar.", forms: [2, 3, 1] },
  { t: "Kendini tanıma", d: "Mizaç ve öğrenme stili testleri yapılır. Koç sonuçları yorumlar, aileyle paylaşılacak bir profil özeti hazırlar.", forms: [8] },
  { t: "Hedef koyma", d: "Hedefi öğrenci koyar. Aile beklentisi ile çocuğun isteği aynı masada konuşulur; ortak, gerçekçi bir hedef çıkar.", forms: [5] },
  { t: "Haftalık takip", d: "Öğrenci haftasını değerlendirir, koç görüşme notlarını ve haftalık değerlendirmesini yazar. Veli, koçun notlarından bilgilendirilir.", forms: [6, 4, 7] },
  { t: "Ara değerlendirme", d: "4. haftada öğrenci uyumu ölçülür, plan gerekirse yeniden kurulur.", forms: [10, 11] },
  { t: "Meslek yönelimi", d: "İlgi, yetenek ve değerler üzerinden çocuğun sevdiği işe yönelik keşif çalışması.", forms: [9] },
  { t: "Gelişim ve kapanış", d: "12. hafta gelişim raporu, öğrenci öz değerlendirmesi, veli son değerlendirmesi ve dosya kapanışı.", forms: [12, 13, 14, 15] },
];
