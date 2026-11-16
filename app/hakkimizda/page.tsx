import Link from "next/link";
import PageHead from "@/components/PageHead";
export const metadata = { title: "Hakkımızda" };

export default function Page() {
  return (
    <>
      <PageHead eyebrow="Hakkımızda" title="Neden Beyazsayfa?" photo="hakkimizda"
        lead="Her çocuk, kendini yeniden yazabileceği temiz bir sayfayı hak eder. Her aile de çocuğuyla yeni bir başlangıç yapabileceği bir sayfayı." />
      <section className="wrap grid gap-12 py-20 md:grid-cols-[1fr_1fr]">
        <div className="prose-body max-w-prose text-lg">
          <h2>Biz kimiz?</h2>
          <p>Beyazsayfa, öğrenci koçluğunu ailenin dışında tutulan bir ders takibi olarak değil, bütün ailenin birlikte büyüdüğü bir süreç olarak görür. Çocuğun iyi bir okula girmesi güzel bir sonuçtur; asıl hedefimiz ise çocuğun kendini tanıması, sevdiği bir işe yönelmesi ve ailesiyle güvenli bir iletişim kurmasıdır.</p>
          <p>Ebeveyn eğitimlerimizde çocuğun davranışını kontrol etmeyi değil; davranışı anlamayı, olumlu davranışı geliştirmeyi ve problem davranışı azaltmayı öğretiyoruz. Yöntemlerimiz davranış bilimi ve olumlu ebeveynlik alanındaki araştırmalara dayanır.</p>
          <h2>Ekibimiz</h2>
          <p className="text-muted">[Kurucu ve ekip üyelerinin fotoğrafları, eğitimleri ve sertifikaları buraya eklenecek.]</p>
        </div>
        <div className="grid content-start gap-4">
          {[
            ["bg-blush", "Önce mutluluk", "Başarıyı çocuğun iyi olma hâli üzerine kuruyoruz."],
            ["bg-sky", "Aile sürecin ortağıdır", "Veliler formlar, eğitimler ve görüşmelerle sürecin içindedir."],
            ["bg-butter", "Her çocuk farklıdır", "Plan, mizaca ve öğrenme stiline göre kişiye özel hazırlanır."],
            ["bg-sage", "Bilimsel ve ölçülebilir", "Davranış kayıtları ve formlarla gelişimi birlikte görürüz."],
            ["bg-paper", "Gizlilik ve güven", "Çocuğun anlattıkları ve doldurduğu formlar yalnızca koçuyla paylaşılır."],
          ].map(([bg, t, d]) => (
            <div key={t} className={`${bg} rounded-3xl p-6`}>
              <h3 className="text-xl">{t}</h3><p className="mt-1 text-ink/75">{d}</p>
            </div>
          ))}
          <Link href="/iletisim" className="btn-primary mt-2 justify-self-start">Bizimle tanışın</Link>
        </div>
      </section>
    </>
  );
}
