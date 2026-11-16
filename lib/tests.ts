// Mizaç ve öğrenme stili testleri. Sorular ve analiz metinleri buradan düzenlenir.
export type TestKey = "mizac" | "ogrenme";
type Opt = [label: string, type: string];
type Q = { q: string; o: Opt[] };

export type MizacType = {
  name: string; alt: string; color: string;
  genel: string; guclu: string[]; zor: string[]; calisma: string[]; veli: string[];
};
export type OgrType = { name: string; color: string; genel: string; tips: string[]; veli: string };

export const MIZAC: Record<string, MizacType> = {
  cos: {
    name: "Coşkulu", alt: "Sıcakkanlı", color: "rgb(var(--accent))",
    genel: "İnsanlarla birlikteyken enerjisi yükselen, neşeli, meraklı ve hızlı bağ kuran bir yapın var. Yeni fikirler seni heyecanlandırır; tekrar gerektiren işlerde motivasyonun çabuk düşebilir.",
    guclu: ["İletişim ve ikna becerisi", "Yaratıcılık, hızlı fikir üretme", "Çevresine enerji veren iyimserlik"],
    zor: ["Uzun süre tek başına odaklanmak", "Planı sonuna kadar sürdürmek", "Eleştiriyi kişisel algılamak"],
    calisma: ["Kısa ve renkli çalışma blokları (25 dk çalışma + 5 dk mola)", "Bir arkadaşınla soru çözmek ya da konuyu anlatmak", "İlerlemeni görünür bir tabloda işaretlemek"],
    veli: ["Başarılarını görünür biçimde takdir edin; övgü bu mizaç için güçlü bir yakıttır.", "Plan konuşmalarını emir yerine birlikte karar vererek yapın.", "Sosyal ihtiyacını engel değil, motivasyon aracı olarak görün."],
  },
  lid: {
    name: "Lider", alt: "Kararlı", color: "rgb(var(--warn))",
    genel: "Hedef koyan, kararlı, sonuç odaklı ve sorumluluk almaktan çekinmeyen bir yapın var. Kontrol sende olduğunda en iyi performansı gösterirsin; sabırsızlık zaman zaman zorlayabilir.",
    guclu: ["Kararlılık ve inisiyatif", "Hedefe odaklanma", "Zor durumda soğukkanlılık"],
    zor: ["Başkalarının hızına uyum sağlamak", "Duygularını ifade etmek", "Hata yapmayı kabullenmek"],
    calisma: ["Ölçülebilir haftalık hedefler ve skor takibi", "Süreli deneme ve rekabet unsurları", "Kendi planını kendin hazırlamak"],
    veli: ["Ona seçenek sunun, karar alanı bırakın; dayatma direnç doğurur.", "Sonuç kadar çabayı da konuşun.", "Tartışmada sakin kalın; kısa ve net konuşmalar daha etkilidir."],
  },
  dus: {
    name: "Düşünür", alt: "Derin", color: "rgb(var(--action))",
    genel: "Derinlemesine düşünen, detaylara önem veren, duyarlı ve mükemmeliyetçi bir yapın var. Düzenli bir ortamda ve konuyu tam anladığında çok verimli çalışırsın.",
    guclu: ["Analitik düşünme ve titizlik", "Sanatsal ve estetik duyarlılık", "Derin empati"],
    zor: ["Mükemmel olmayacak diye başlamayı ertelemek", "Kendini fazla eleştirmek", "Belirsizlik ve ani değişiklikler"],
    calisma: ["Sessiz, düzenli bir çalışma köşesi", "Konu özeti ve kavram haritası çıkarmak", "Hedefleri küçük adımlara bölmek"],
    veli: ["Duygularını ciddiye alın; “abartıyorsun” demek yerine dinleyin.", "Hataların öğrenmenin parçası olduğunu kendi örneklerinizle gösterin.", "Değişiklikleri önceden haber verin."],
  },
  uyu: {
    name: "Uyumlu", alt: "Sakin", color: "rgb(var(--ok))",
    genel: "Sakin, sabırlı, uzlaşmacı ve güvenilir bir yapın var. Çatışmadan kaçınır, çevrendekileri rahatlatırsın. Kendi isteklerini dile getirmekte ve harekete geçmekte zorlanabilirsin.",
    guclu: ["Sabır ve istikrar", "İyi dinleyicilik", "Baskı altında sakin kalabilmek"],
    zor: ["Başlamak ve öncelik belirlemek", "Hayır demek", "Kendi fikrini savunmak"],
    calisma: ["Her gün aynı saatte kısa bir rutin", "Bir takip arkadaşı ya da koç kontrolü", "Küçük başarıları kutlayan ödül sistemi"],
    veli: ["Fikrini sorun ve cevap için zaman tanıyın.", "Baskı yerine yumuşak hatırlatmalar kullanın.", "Kendi kararlarını vermesi için güvenli alan açın."],
  },
};

export const OGRENME: Record<string, OgrType> = {
  gor: { name: "Görsel", color: "rgb(var(--accent))", genel: "Bilgiyi görerek daha iyi öğreniyorsun. Şema, grafik, renk ve yazılı notlar senin için hafızanın anahtarı.",
    tips: ["Renkli kalemlerle kavram haritası çıkar", "Konuları şema ve tabloya dönüştür", "Ders videolarında tahtayı aynı düzende not al", "Formül ve kuralları masanın önüne kartlarla as"],
    veli: "Çalışma masasının yakınında bir pano ya da beyaz tahta, görsel öğrenen bir çocuk için büyük fark yaratır." },
  isi: { name: "İşitsel", color: "rgb(var(--action))", genel: "Bilgiyi duyarak ve konuşarak daha iyi öğreniyorsun. Anlatmak, tartışmak ve sesli tekrar senin için çok etkili.",
    tips: ["Konuyu yüksek sesle kendine ya da birine anlat", "Kendi sesini kaydedip tekrar dinle", "Çalışma grubunda soru-cevap yap", "Ritimli tekerlemelerle ezber yap"],
    veli: "Çocuğunuz konuyu size anlatmak isterse dinleyici olun; sesli çalışması dikkatsizlik değil, öğrenme biçimidir." },
  kin: { name: "Kinestetik", color: "rgb(var(--warn))", genel: "Bilgiyi yaparak, dokunarak ve hareket ederek daha iyi öğreniyorsun. Uzun süre hareketsiz oturmak seni zorlayabilir.",
    tips: ["Sık ve kısa molalar ver, molada hareket et", "Deney, model ve somut örneklerle çalış", "Soru çözerken yazarak ilerle", "Ayakta ya da yürüyerek tekrar yapmayı dene"],
    veli: "Kısa molalarda hareket etmesine izin verin; kıpır kıpır olması çalışmadığı anlamına gelmez." },
};

const MQ: Q[] = [
  { q: "Kalabalık bir ortama girdiğinde genelde ne yaparsın?", o: [["Hemen sohbete katılır, yeni insanlarla tanışırım", "cos"], ["Ortamı yönlendirir, bir şeyler organize ederim", "lid"], ["Önce ortamı gözlemler, tanıdığım biriyle konuşurum", "dus"], ["Rahat bir köşe bulur, kim gelirse sohbet ederim", "uyu"]] },
  { q: "Grup ödevinde hangi rolü üstlenirsin?", o: [["Fikir üreten, ortamı neşelendiren", "cos"], ["Görev dağıtan, takvimi tutan", "lid"], ["Araştırmayı yapan, detayları kontrol eden", "dus"], ["Herkesin arasını bulan, verilen işi yapan", "uyu"]] },
  { q: "Planların son anda değiştiğinde…", o: [["Sorun değil, yeni plan da eğlenceli olur", "cos"], ["Hemen yeni bir plan yaparım", "lid"], ["Canım sıkılır, alışmam zaman alır", "dus"], ["Uyum sağlarım, çok dert etmem", "uyu"]] },
  { q: "Ders çalışırken en çok neyde zorlanırsın?", o: [["Uzun süre tek bir konuya odaklanmakta", "cos"], ["Yavaş ilerleyen konulara sabretmekte", "lid"], ["Mükemmel olmayacak diye başlamakta", "dus"], ["Harekete geçip başlamakta", "uyu"]] },
  { q: "Arkadaşların seni en çok nasıl tanımlar?", o: [["Eğlenceli ve konuşkan", "cos"], ["Kararlı ve cesur", "lid"], ["Düşünceli ve hassas", "dus"], ["Sakin ve güvenilir", "uyu"]] },
  { q: "Bir sınavdan düşük not aldığında ilk tepkin?", o: [["Biraz üzülürüm ama çabuk unuturum", "cos"], ["Sinirlenir, hemen telafi planı yaparım", "lid"], ["Uzun süre kafama takarım", "dus"], ["Olur böyle şeyler, bir dahakine derim", "uyu"]] },
  { q: "Boş bir hafta sonunda ne yapmak istersin?", o: [["Arkadaşlarla dışarı çıkmak", "cos"], ["Bir hedefim için çalışmak ya da spor", "lid"], ["Kitap, müzik, resim gibi kendi işlerim", "dus"], ["Evde dinlenmek, dizi izlemek", "uyu"]] },
  { q: "Bir tartışmada genelde…", o: [["Konuyu şakayla yumuşatırım", "cos"], ["Haklı olduğumu kanıtlamaya çalışırım", "lid"], ["Sonradan uzun uzun düşünürüm", "dus"], ["Tartışmayı uzatmamak için geri adım atarım", "uyu"]] },
  { q: "Odan ya da masan genelde nasıldır?", o: [["Renkli ama biraz dağınık", "cos"], ["İşe yarar düzende, her şey elimin altında", "lid"], ["Kendi sistemimle düzenli", "dus"], ["Rahat, çok kafaya takmam", "uyu"]] },
  { q: "Yeni bir şey öğrenirken seni en çok ne motive eder?", o: [["Eğlenceli ve yeni olması", "cos"], ["Bir yarışmaya ya da hedefe yaraması", "lid"], ["Konuyu derinlemesine anlamak", "dus"], ["Birinin bana adım adım eşlik etmesi", "uyu"]] },
  { q: "Ailenle bir konuda anlaşamadığında…", o: [["Duygularımı hemen dile getiririm", "cos"], ["Kendi kararımı savunurum", "lid"], ["İçime atar, odama çekilirim", "dus"], ["Sessiz kalır, sonra konuşurum", "uyu"]] },
  { q: "Hangi cümle sana daha yakın?", o: [["Hayat paylaşınca güzel", "cos"], ["İstersem yaparım", "lid"], ["Her şeyin bir anlamı olmalı", "dus"], ["Acele etmeye gerek yok", "uyu"]] },
];

const OQ: Q[] = [
  { q: "Yeni bir yere giderken yolu nasıl bulursun?", o: [["Haritaya bakarım", "gor"], ["Birine sorarım, tarifi dinlerim", "isi"], ["Yürürken keşfederim", "kin"]] },
  { q: "Bir konuyu en iyi nasıl hatırlarsın?", o: [["Kitaptaki görüntüsünü ve renklerini hatırlarım", "gor"], ["Öğretmenin anlatışını hatırlarım", "isi"], ["O konuda yaptığım etkinliği hatırlarım", "kin"]] },
  { q: "Yeni bir oyunu ya da cihazı nasıl öğrenirsin?", o: [["Kılavuzdaki resimlere bakarım", "gor"], ["Birinin anlatmasını isterim", "isi"], ["Direkt kurcalayarak", "kin"]] },
  { q: "Sınıfta dikkatin en çok ne zaman dağılır?", o: [["Tahtaya hiçbir şey yazılmadığında", "gor"], ["Ortam gürültülü olduğunda", "isi"], ["Uzun süre oturmak zorunda kaldığımda", "kin"]] },
  { q: "Boş zamanında hangisini daha çok seversin?", o: [["Çizim, film, fotoğraf", "gor"], ["Müzik, podcast, sohbet", "isi"], ["Spor, dans, el işi", "kin"]] },
  { q: "Bir kelimenin nasıl yazıldığından emin olmadığında…", o: [["Yazıp bakarım, doğru görünüyor mu", "gor"], ["Sesli hecelerim", "isi"], ["Elimle havada yazarım", "kin"]] },
  { q: "Sınava çalışırken en çok ne işine yarar?", o: [["Özet tablolar ve renkli notlar", "gor"], ["Konuyu birine anlatmak", "isi"], ["Bol bol soru çözmek ve yazmak", "kin"]] },
  { q: "Birini tanıdığında en çok neyini hatırlarsın?", o: [["Yüzünü ve kıyafetini", "gor"], ["Adını ve sesini", "isi"], ["Birlikte ne yaptığımızı", "kin"]] },
  { q: "Heyecanlandığında ne yaparsın?", o: [["Yüz ifadem hemen değişir", "gor"], ["Hızlı ve çok konuşurum", "isi"], ["Yerimde duramam", "kin"]] },
  { q: "Bir hikâyeyi en çok nasıl seversin?", o: [["Resimli ya da film olarak", "gor"], ["Sesli kitap ya da birinin anlatmasıyla", "isi"], ["Canlandırarak, oynayarak", "kin"]] },
];

export const TESTS: Record<TestKey, { title: string; short: string; minutes: string; desc: string; questions: Q[]; types: Record<string, { name: string; color: string }> }> = {
  mizac: { title: "Mizaç Analiz Testi", short: "Mizaç", minutes: "5–7 dakika", desc: "12 soruda kişilik yapını dört mizaç üzerinden tanı: Coşkulu, Lider, Düşünür, Uyumlu.", questions: MQ, types: MIZAC },
  ogrenme: { title: "Öğrenme Stili Testi", short: "Öğrenme", minutes: "4–5 dakika", desc: "10 soruda en iyi nasıl öğrendiğini keşfet: Görsel, İşitsel ya da Kinestetik.", questions: OQ, types: OGRENME },
};

export function score(test: TestKey, answers: string[]) {
  const keys = Object.keys(TESTS[test].types);
  const counts: Record<string, number> = Object.fromEntries(keys.map((k) => [k, 0]));
  answers.forEach((a) => { if (a in counts) counts[a]++; });
  const n = answers.length || 1;
  const out: Record<string, number> = {};
  let sum = 0;
  keys.forEach((k) => { out[k] = Math.round((counts[k] / n) * 100); sum += out[k]; });
  const top = dominant(out);
  out[top] += 100 - sum;
  return out;
}

export const dominant = (sc: Record<string, number>) => Object.entries(sc).sort((a, b) => b[1] - a[1])[0][0];

export function resultText(test: TestKey, name: string, sc: Record<string, number>, date: string) {
  const T = TESTS[test];
  const d = dominant(sc);
  const lines = Object.entries(T.types).map(([k, t]) => `• ${t.name}: %${sc[k] ?? 0}`).join("\n");
  const genel = test === "mizac" ? MIZAC[d].genel : OGRENME[d].genel;
  const veli = test === "mizac" ? MIZAC[d].veli.map((v) => `- ${v}`).join("\n") : `- ${OGRENME[d].veli}`;
  return `${T.title} sonucu: ${name}\nTarih: ${date}\n\nBaskın profil: ${T.types[d].name}\n${lines}\n\n${genel}\n\nVeliye öneriler:\n${veli}`;
}
