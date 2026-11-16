import { notFound } from "next/navigation";
import Prose from "@/components/Prose";
import { SITE } from "@/lib/site";

// UYARI: Bu metinler şablondur. Yayına almadan önce bir hukukçuya kontrol ettirin ve [köşeli parantez] alanlarını doldurun.
const DOCS: Record<string, { title: string; body: string }> = {
  kvkk: { title: "KVKK Aydınlatma Metni", body: `Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla [Şirket unvanı] (“${SITE.name}”) tarafından hazırlanmıştır.

## İşlenen kişisel veriler
- Kimlik ve iletişim bilgileri: ad, soyad, e-posta, telefon
- Üyelik bilgileri: hesap türü (öğrenci, veli), sınıf
- Hizmet verileri: test sonuçları, doldurulan formlar, deneme sonuçları, davranış programı kayıtları
- İşlem verileri: sipariş ve ödeme kayıtları (kart bilgileri ${SITE.name} tarafından saklanmaz, ödeme kuruluşu tarafından işlenir)

## İşleme amaçları
Koçluk ve eğitim hizmetlerinin sunulması, randevu süreçlerinin yürütülmesi, test sonuçlarının öğrencinin onayıyla veliye iletilmesi, yasal yükümlülüklerin yerine getirilmesi.

## Çocukların verileri
18 yaşından küçük kullanıcıların verileri, velinin bilgisi ve onayı dahilinde işlenir. Öğrencinin doldurduğu formlar yalnızca öğrenci ve koçu tarafından görülebilir.

## Aktarım
Veriler; barındırma (Supabase, Vercel), e-posta gönderimi (Resend) ve ödeme (iyzico) hizmet sağlayıcılarına, yalnızca hizmetin gerektirdiği ölçüde aktarılır. [Yurt dışı aktarım için açık rıza ya da ilgili mekanizma belirtilecek.]

## Haklarınız
KVKK'nın 11. maddesi kapsamındaki taleplerinizi ${SITE.email} adresine iletebilirsiniz.` },
  gizlilik: { title: "Gizlilik ve Çerez Politikası", body: `${SITE.name}, yalnızca oturumunuzun açık kalması için zorunlu çerezleri kullanır. Reklam ya da izleme amaçlı çerez kullanılmaz.

## Sitedeki içerikler
Sitedeki yazı, eğitim ve görseller ${SITE.name}'ya aittir; izinsiz kopyalanamaz ve çoğaltılamaz.

## İletişim
Gizlilikle ilgili sorularınız için: ${SITE.email}` },
  "mesafeli-satis": { title: "Mesafeli Satış Sözleşmesi", body: `## 1. Taraflar
**Satıcı:** [Şirket unvanı], [adres], [vergi dairesi ve no], ${SITE.email}
**Alıcı:** Siparişi veren üye

## 2. Konu
İşbu sözleşme, alıcının ${SITE.name} internet sitesi üzerinden satın aldığı dijital eğitim içeriğinin ve/veya koçluk hizmetinin satışı ve ifasına ilişkin tarafların hak ve yükümlülüklerini düzenler.

## 3. Hizmetin ifası
Dijital eğitimlere erişim ödeme onayının ardından üye paneli üzerinden derhal açılır. Koçluk hizmetlerinde görüşme takvimi alıcıyla birlikte belirlenir.

## 4. Cayma hakkı
Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca, elektronik ortamda anında ifa edilen hizmetlerde ve dijital içeriklerde, ifaya başlanmasından sonra cayma hakkı kullanılamaz. [Koçluk hizmetleri için cayma ve iptal koşulları belirtilecek.]

## 5. Uyuşmazlık
Uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.` },
  iade: { title: "İptal ve İade Koşulları", body: `## Dijital eğitimler
Dijital içeriklere erişim açıldıktan sonra iade yapılamaz. Teknik bir sorun nedeniyle içeriğe erişemezseniz ${SITE.email} adresine yazın; sorun çözülemezse ücret iade edilir.

## Koçluk paketleri
[İlk görüşmeden önce iptal: tam iade. Süreç başladıktan sonra: kalan görüşmeler üzerinden orantılı iade. Bu koşullar işletme tarafından belirlenecek.]

## İade süreci
Onaylanan iadeler, ödemenin yapıldığı karta 7–14 iş günü içinde yansır.` },
};

export function generateStaticParams() { return Object.keys(DOCS).map((doc) => ({ doc })); }
export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }) { return { title: DOCS[(await params).doc]?.title }; }

export default async function Page({ params }: { params: Promise<{ doc: string }> }) {
  const d = DOCS[(await params).doc];
  if (!d) notFound();
  return (
    <article className="wrap max-w-3xl py-14">
      <h1 className="text-4xl md:text-5xl">{d.title}</h1>
      <Prose text={d.body} className="mt-8 text-lg" />
    </article>
  );
}
