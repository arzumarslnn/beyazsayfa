// Satışa sunulan ebeveyn eğitimleri ve koçluk paketleri.
// FİYATLAR ÖRNEKTİR: yayına almadan önce gerçek fiyatlarla değiştirin.

export type Lesson = { title: string; minutes: number; body: string; video?: string };
export type Course = {
  key: string; kind: "egitim"; group?: "paket" | "konu"; badge?: string; includes?: string[];
  title: string; age: string; price: number; color: string; photo: string;
  problem: string; promise: string; outcomes: string[]; behaviorKey?: string; lessons: Lesson[];
};
export type Package = {
  key: string; kind: "kocluk"; title: string; duration: string; price: number; featured?: boolean;
  summary: string; items: string[];
};


const HAZIRLIK_LESSONS: Lesson[] = [
  { title: "Davranışı kim değiştirir?", minutes: 10, body: "Bu eğitimde çocuğunuzun davranışını biz düzeltmiyoruz; onu sizin değiştirmenize yardım ediyoruz. Çünkü davranışın öncesinde ve sonrasında olanların çoğu evde, sizin yanınızda yaşanır. Bu derste ebeveynin rolünü, tutarlılığın neden her şeyden önemli olduğunu ve bu yolculukta sizden neler beklendiğini konuşuyoruz." },
  { title: "Önce kendinizi gözlemleyin", minutes: 11, body: "Çocuğun davranışı çoğu zaman bizim tepkimizle büyür ya da söner. Bu derste kendi tetikleyicilerinizi, sesinizi yükselttiğiniz anları ve sakin kalmanızı kolaylaştıran küçük alışkanlıkları fark etmeyi öğreniyorsunuz. Ödev: bir hafta boyunca kendi tepkilerinizi not edin." },
  { title: "Çocuğunuzu tanıyın: yaş, mizaç, ihtiyaç", minutes: 12, body: "Aynı davranış 3 yaşında ve 13 yaşında farklı anlamlar taşır. Yaş dönemlerinin beklentilerini, mizacın davranışa etkisini ve davranışın arkasındaki temel ihtiyaçları (ilgi, özerklik, güven, dinlenme) tanıyoruz." },
  { title: "Davranışı doğru tanımlamak", minutes: 9, body: "“Yaramazlık yapıyor” bir davranış değil, bir yorumdur. “Ödev saatinde masadan kalkıp odasına gidiyor” ise gözlemlenebilir bir davranıştır. Değiştirmek istediğiniz davranışı ölçülebilir hale getirmeyi ve yerine görmek istediğiniz davranışı yazmayı öğreniyorsunuz." },
  { title: "Evi hazırlamak: rutin, uzlaşı, kayıt", minutes: 10, body: "Anne ve babanın aynı dili konuşması, günün belli bir düzende akması ve küçük bir kayıt alışkanlığı, tekniklerin işe yaraması için zemin hazırlar. Bu derste aile içinde nasıl uzlaşacağınızı ve Davranış Programı'nda ilk kaydınızı nasıl tutacağınızı göreceksiniz." },
];
const TEKNIK_LESSONS: Lesson[] = [
  { title: "ABC: davranışın öncesi ve sonrası", minutes: 12, body: "Her davranışın bir öncesi (A) ve bir sonrası (C) vardır. Bu derste ABC kaydı tutmayı ve kayıtlarınızdan örüntü çıkarmayı öğreniyorsunuz: davranış en çok ne zaman, kimle, hangi durumda oluyor ve hemen ardından ne oluyor?" },
  { title: "Davranışın işlevi", minutes: 11, body: "Davranış çocuğa bir şey kazandırır: ilgi, zor bir görevden kaçmak, istediğini elde etmek ya da bedensel bir ihtiyacı karşılamak. İşlevi bulduğunuzda, aynı ihtiyacı karşılayan daha uygun bir davranışı öğretebilirsiniz." },
  { title: "Önleme teknikleri", minutes: 12, body: "Davranış başlamadan önce yapılabilecekler: ortamı düzenlemek, geçişlerden önce uyarı vermek, iki seçenek sunmak, görevi küçük parçalara bölmek, beklentiyi önceden konuşmak." },
  { title: "Olumlu davranışı büyütmek", minutes: 13, body: "Çocuklar en çok fark edilen davranışı tekrarlar. Betimleyici övgü, anında pekiştirme ve doğru kurulmuş bir puan tablosuyla görmek istediğiniz davranışı nasıl büyüteceğinizi öğreniyorsunuz." },
  { title: "Problem davranış olduğunda", minutes: 13, body: "Planlı görmezden gelme, doğal ve mantıksal sonuçlar, sakin ve kısa sınır cümleleri, mola. Ve en önemlisi: kararınızı davranış büyüdüğünde değiştirmemek." },
  { title: "Kendi davranış planınızı yazmak", minutes: 14, body: "Öğrendiğiniz her şeyi bir araya getirerek çocuğunuza özel bir plan yazıyorsunuz. Davranış Programı'ndaki günlük kayıt ve grafiklerle planın işe yarayıp yaramadığını haftalar içinde kendi gözünüzle görüyorsunuz." },
];

export const PACKAGE_COURSES: Course[] = [
  {
    key: "davranis-hazirlik", kind: "egitim", group: "paket", title: "Davranış Eğitimine Hazırlık", age: "Tüm yaşlar", price: 1450, color: "sky", photo: "ebeveyn",
    problem: "Çocuğunuzun davranışını değiştirmek istiyorsunuz ama nereden başlayacağınızı bilmiyorsunuz.",
    promise: "Teknikleri uygulamadan önce kendinizi, çocuğunuzu ve evinizi hazırlamak.",
    outcomes: ["Ebeveynin rolü ve tutarlılık", "Kendi tepkilerinizi yönetmek", "Davranışı ölçülebilir şekilde tanımlamak", "Ev düzeni ve aile içi uzlaşı"],
    lessons: HAZIRLIK_LESSONS,
  },
  {
    key: "davranis-teknikler", kind: "egitim", group: "paket", title: "Davranışı Tanıma ve Teknikler", age: "Tüm yaşlar", price: 2450, color: "sage", photo: "isbirligi",
    problem: "Ne denediyseniz davranış değişmiyor ya da kısa süre sonra geri geliyor.",
    promise: "Davranışı tanımayı ve onu sizin değiştirmenizi sağlayacak teknikleri öğrenmek.",
    outcomes: ["ABC kaydı ve örüntü bulma", "Davranışın işlevini anlamak", "Önleme, pekiştirme ve sonuç teknikleri", "Kendi davranış planınızı yazmak"],
    lessons: TEKNIK_LESSONS,
  },
  {
    key: "davranis-tam", kind: "egitim", group: "paket", badge: "En avantajlı", includes: ["davranis-hazirlik", "davranis-teknikler"],
    title: "Tam Paket", age: "Tüm yaşlar", price: 3450, color: "butter", photo: "aile",
    problem: "Hazırlıktan uygulamaya, davranış değiştirmenin bütün yolunu bir arada istiyorsunuz.",
    promise: "İki paketin tamamı ve planınızı bir koçla birlikte gözden geçireceğiniz bir görüşme.",
    outcomes: ["Davranış Eğitimine Hazırlık paketinin tamamı", "Davranışı Tanıma ve Teknikler paketinin tamamı", "1 bireysel plan değerlendirme görüşmesi", "Davranış Programı'nda koç geri bildirimi"],
    lessons: [...HAZIRLIK_LESSONS, ...TEKNIK_LESSONS],
  },
];

export type TestProduct = { key: "testler"; kind: "test"; title: string; price: number; summary: string; items: string[] };
export const TEST_PRODUCT: TestProduct = {
  key: "testler", kind: "test", title: "Mizaç ve Öğrenme Testleri", price: 750,
  summary: "Öğrencinin mizacını ve öğrenme stilini ortaya koyan iki test, ayrıntılı analiz ve veliye öneriler.",
  items: ["Mizaç Analiz Testi (12 soru)", "Öğrenme Stili Testi (10 soru)", "Ayrıntılı analiz ve çalışma önerileri", "Sonucun veliye e-posta ve WhatsApp ile iletilmesi"],
};

export const TOPIC_COURSES: Course[] = [
  {
    key: "ofke-nobetleri", kind: "egitim", title: "Öfke Nöbetleriyle Sakin Kalmak", age: "2–8 yaş", price: 1250, color: "blush", photo: "ofke", behaviorKey: "ofke",
    problem: "Hayır dediğiniz anda yere atılan, bağıran, sakinleşemeyen bir çocuk.",
    promise: "Nöbet anında ne yapacağınızı bilmek ve nöbetlerin sıklığını adım adım azaltmak.",
    outcomes: ["Nöbet anında söyleyeceğiniz üç cümle", "Sakinleşme köşesini birlikte kurmak", "Nöbetleri önceden haber veren işaretleri tanımak", "Nöbet sonrası onarım konuşması"],
    lessons: [
      { title: "Öfke nöbeti neden olur?", minutes: 9, body: "Küçük çocukların beyninde duyguları düzenleyen bölge henüz gelişmektedir. Nöbet, çoğu zaman bir “yaramazlık” değil, baş edilemeyen bir duygunun taşmasıdır. Bu derste nöbeti tetikleyen dört durumu (yorgunluk, geçişler, hayır cevabı, ilgi ihtiyacı) ve nöbetin evrelerini öğreneceksiniz. Ödev: Bu hafta yaşanan her nöbeti Davranış Programı'ndaki ABC kaydına yazın." },
      { title: "Nöbet anında: az konuş, yanında kal", minutes: 12, body: "Nöbetin ortasında çocuk sizi duyamaz. Bu yüzden konuşmayı en aza indirin, güvenliği sağlayın ve sakin bir yetişkin olarak orada olun. Kullanabileceğiniz cümleler: “Buradayım.”, “Çok kızgınsın.”, “Hazır olduğunda sarılabiliriz.” Kaçınılacaklar: tehdit, alay, uzun açıklama, kararı değiştirmek." },
      { title: "Önleme: zor anları önceden hazırlamak", minutes: 10, body: "Nöbetlerin çoğu tahmin edilebilir anlarda olur: parktan çıkış, ekran bitişi, market kasası. Geçişten önce uyarı verin, iki seçenek sunun ve beklentiyi önceden konuşun. Bu derste “öncesinde konuş, sırasında sakin kal, sonrasında onar” modelini çalışıyoruz." },
      { title: "Sonrası: onarım ve duygu kelimeleri", minutes: 8, body: "Nöbet bittiğinde kısa bir sarılma ve tek cümlelik bir onarım yeterlidir: “Çok zordu. Bir dahakine kızınca bana söyleyebilirsin.” Sakin anlarda duygu kartlarıyla duygulara isim vermeyi öğretmek, zamanla nöbetin yerini kelimelerin almasını sağlar." },
    ],
  },
  {
    key: "isbirligi", kind: "egitim", title: "Söz Dinlemekten İşbirliğine", age: "3–12 yaş", price: 1250, color: "sky", photo: "isbirligi", behaviorKey: "soz",
    problem: "Aynı şeyi beş kez söylediğiniz, her yönergenin pazarlığa döndüğü günler.",
    promise: "Bağırmadan, tehdit etmeden işbirliği isteyen bir ebeveyn dili.",
    outcomes: ["Etkili yönerge vermenin beş kuralı", "Puan tablosunu doğru kullanmak", "Doğal ve mantıksal sonuçlar", "Tutarlılığı korumak"],
    lessons: [
      { title: "Yönerge nasıl verilir?", minutes: 10, body: "Etkili bir yönerge yakından, göz teması kurarak, tek seferde ve net bir cümleyle verilir. “Odanı toplar mısın?” bir sorudur ve “hayır” cevabını davet eder; “Kitaplarını rafa koy” bir yönergedir. Bu derste yönergeyi kısa, olumlu ve yapılabilir hale getirmeyi çalışıyoruz." },
      { title: "Fark etmenin gücü", minutes: 9, body: "Çocuklar en çok dikkat edilen davranışı tekrarlar. Uyduğu yönergeleri fark etmek, uymadıklarını konuşmaktan çok daha etkilidir. Davranışa özel ve hemen yapılan takdir: “İlk söylediğimde ayakkabılarını koydun, teşekkür ederim.”" },
      { title: "Puan tablosu ve ayrıcalıklar", minutes: 11, body: "Puan tablosu kısa süreli bir destektir. Bir ya da iki hedef davranış seçin, puanı hemen verin, ödülü birlikte belirleyin ve tabloyu 3–4 hafta sonra yavaş yavaş kaldırın." },
      { title: "Sonuçlar: ceza değil, öğretme", minutes: 12, body: "Sonuç kısa, mantıklı ve önceden bilinen olmalıdır. Oyuncakları toplamazsa o oyuncaklar bir gün rafta kalır. Önemli olan sertlik değil, tutarlılıktır. Tehdit edip uygulamamak, sözlerinizin değerini düşürür." },
    ],
  },
  {
    key: "ekran-anlasmasi", kind: "egitim", title: "Ekran Anlaşması", age: "6–18 yaş", price: 1250, color: "butter", photo: "ekran", behaviorKey: "ekran",
    problem: "Ekranı kapatmanın her gün kavgaya dönüşmesi.",
    promise: "Çocuğunuzla birlikte yazılmış, uygulanabilir bir aile ekran anlaşması.",
    outcomes: ["Yaşa uygun ekran süreleri", "Aile ekran anlaşması şablonu", "Bitiş anını kolaylaştıran teknikler", "Kural ihlalinde ne yapmalı"],
    lessons: [
      { title: "Ekranın çekimi neden bu kadar güçlü?", minutes: 8, body: "Oyunlar ve sosyal medya, bırakmayı zorlaştıracak şekilde tasarlanır. Çocuğun bırakmakta zorlanması karakter zayıflığı değil, tasarımın sonucudur. Bu yüzden irade yerine yapı kuruyoruz: net süreler, önceden uyarı, cazip bir sonraki etkinlik." },
      { title: "Aile ekran anlaşması", minutes: 14, body: "Anlaşmayı aile toplantısında birlikte yazın: hafta içi ve hafta sonu süreleri, ekransız alanlar (yemek masası, yatak odası), ekransız saatler ve kural ihlalinde ne olacağı. Herkes imzalasın, ebeveynler dahil." },
      { title: "Bitiş anı", minutes: 9, body: "10 ve 2 dakika kala uyarı, zamanlayıcıyı çocuğun kurması, “kaydet ve bırak” becerisi. Süre bittiğinde pazarlık yok; anlaşma metnini gösterin." },
      { title: "Ergenlerde ekran", minutes: 11, body: "Ergenlerde yasak yerine müzakere işe yarar. Gece cihazların ortak alanda şarj edilmesi gibi az ama net kurallar koyun; geri kalanında güven verin ve kendi örneğinizle gösterin." },
    ],
  },
  {
    key: "odev-savaslari", kind: "egitim", title: "Ödev Savaşlarını Bitirmek", age: "7–18 yaş", price: 1250, color: "sage", photo: "odev", behaviorKey: "odev",
    problem: "Ödev saatinin evdeki en gergin saat olması.",
    promise: "Çocuğun kendi sorumluluğunu aldığı, sizin de koç olduğunuz bir çalışma düzeni.",
    outcomes: ["Mizaca göre çalışma düzeni", "Başlama güçlüğünü aşmak", "Ebeveynin rolü: denetçi değil koç", "Haftalık plan şablonu"],
    lessons: [
      { title: "Başlamak neden bu kadar zor?", minutes: 10, body: "Ertelemenin altında çoğu zaman tembellik değil; belirsizlik, başarısızlık korkusu ya da sıkılma vardır. Görevi küçültmek ve başlama saatini sabitlemek, başlama eşiğini düşürür." },
      { title: "Mizaç ve öğrenme stiline göre düzen", minutes: 12, body: "Coşkulu bir çocuk kısa ve hareketli bloklarla, düşünür bir çocuk sessiz ve düzenli bir köşede daha iyi çalışır. Mizaç ve öğrenme testlerinin sonuçlarını bu derste çalışma düzenine dönüştürüyoruz." },
      { title: "Koç ebeveyn", minutes: 9, body: "Koç ebeveyn soruyu çözmez, soruyu sorar: “Nereden başlamak istersin?”, “Neye ihtiyacın var?”. Hataları düzeltmek yerine çocuğun kendi kontrol etmesine alan açar." },
      { title: "Haftalık plan ve takip", minutes: 11, body: "Planı çocuk yazar, siz onaylarsınız. Haftada bir kısa bir değerlendirme yapın: neler iyi gitti, ne zorladı, gelecek hafta neyi değiştirelim?" },
    ],
  },
  {
    key: "ergenle-bag", kind: "egitim", title: "Ergenle Bağ Kurmak", age: "12–18 yaş", price: 1450, color: "blush", photo: "ergen", behaviorKey: "ergen",
    problem: "Odaya kapanan, tek kelimeyle cevap veren, her konuşmada uzaklaşan bir genç.",
    promise: "Kapıyı yeniden aralayan, saygıya dayalı bir iletişim.",
    outcomes: ["Ergen beyninde neler oluyor?", "Sorgu yerine merak", "Çatışmada sakin kalmak", "Sınırları birlikte belirlemek"],
    lessons: [
      { title: "Ergenlik: ayrışma ihtiyacı", minutes: 10, body: "Ergenin uzaklaşması, büyümenin doğal bir parçasıdır. Amacımız onu yakın tutmak değil, ihtiyaç duyduğunda dönebileceği güvenli bir liman olmaktır." },
      { title: "Yan yana konuşmak", minutes: 9, body: "Yüz yüze konuşmalar ergene sorgu gibi gelebilir. Arabada, yürüyüşte, mutfakta yan yana yapılan sohbetler daha kolay açılır. Sorgu sorularını ilgi sorularıyla değiştirin." },
      { title: "Çatışma anında", minutes: 12, body: "Ters bir cevaba aynı tonla karşılık vermek tartışmayı büyütür. Kısa bir sınır cümlesi ve ara vermek: “Böyle konuşunca dinleyemiyorum, sakinleşince konuşalım.” Sonra mutlaka onarım." },
      { title: "Sınırları birlikte koymak", minutes: 11, body: "Ergen sınırların gerekçesini bilmek ister ve fikrinin alınmasına önem verir. Saat, para, sosyal medya gibi konuları birlikte konuşun; birkaç kesin kural dışında esneklik tanıyın." },
    ],
  },
  {
    key: "sinav-donemi", kind: "egitim", title: "Sınav Döneminde Aile", age: "13–18 yaş", price: 1250, color: "sky", photo: "sinav",
    problem: "Sınav kaygısının bütün evi sarması, her deneme sonrası gerginlik.",
    promise: "Kaygıyı büyütmeden destek olan, çocuğun mutluluğunu da gözeten bir aile tutumu.",
    outcomes: ["Sınav kaygısını tanımak", "Deneme sonrası konuşma rehberi", "Beklentiyi yönetmek", "Tercih döneminde çocuğun sesi"],
    lessons: [
      { title: "Kaygı mı, motivasyon mu?", minutes: 9, body: "Biraz kaygı motive eder, fazlası performansı düşürür. Uyku sorunları, sık hastalanma, kaçınma ve öfke patlamaları kaygının artığını gösteren işaretlerdir." },
      { title: "Deneme akşamı", minutes: 10, body: "İlk soru netler değil, nasıl hissettiği olmalı. Netleri ve konu analizini ertesi gün, sakin bir zamanda ve plan odaklı konuşun. Kıyaslama içeren her cümleden kaçının." },
      { title: "Beklentiler", minutes: 11, body: "Kendi beklentilerinizi çocuğunuzun hedefinden ayırın. Çocuğun hedefi kendisinin olduğunda motivasyonu iç kaynaklı olur." },
      { title: "Tercih dönemi", minutes: 12, body: "Tercih listesini çocuğunuzla birlikte, onun ilgi ve değerlerini merkeze alarak hazırlayın. Meslek Yönelim Formu bu konuşma için iyi bir başlangıçtır." },
    ],
  },
];

export const PACKAGES: Package[] = [
  { key: "kesif", kind: "kocluk", title: "Keşif", duration: "4 hafta", price: 6000,
    summary: "Çocuğunuzu ve ailenizi tanıdığımız, ilk hedeflerin konduğu başlangıç programı.",
    items: ["Mizaç ve öğrenme testleri (dahil) ve koç yorumu", "4 birebir öğrenci görüşmesi", "1 veli görüşmesi", "Hedef belirleme ve ilk plan"] },
  { key: "gelisim", kind: "kocluk", title: "Gelişim", duration: "12 hafta", price: 16500, featured: true,
    summary: "Haftalık takip, ara değerlendirme ve gelişim raporuyla tam koçluk süreci.",
    items: ["12 haftalık birebir koçluk", "Haftalık takip ve koç değerlendirmesi", "4. ve 12. hafta raporları", "3 veli görüşmesi", "Meslek yönelim çalışması"] },
  { key: "aile-programi", kind: "kocluk", title: "Aile Programı", duration: "12 hafta", price: 24000,
    summary: "Öğrenci koçluğu ile ebeveyn eğitimini birleştiren, bütün aileyi kapsayan program.",
    items: ["Gelişim paketindeki her şey", "Davranış eğitimi Tam Paket", "Davranış programında koç desteği", "Öğrenci, veli ve koç üçlü değerlendirmesi"] },
];

export const COURSES: Course[] = [...PACKAGE_COURSES, ...TOPIC_COURSES];
export type Product = Course | Package | TestProduct;
export const PRODUCTS: Product[] = [...COURSES, ...PACKAGES, TEST_PRODUCT];
export const productByKey = (k: string) => PRODUCTS.find((p) => p.key === k);
export const courseByKey = (k: string) => COURSES.find((c) => c.key === k);
