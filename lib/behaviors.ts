// Ebeveyn Davranış Programı: davranışı seç → ABC kaydı → kişisel plan → günlük kayıt → gelişim.
// ABC: A (Öncül: davranıştan hemen önce ne oldu), B (Davranış), C (Sonuç: hemen ardından ne oldu).

export type Fn = "ilgi" | "kacinma" | "istek" | "fizyolojik";

export const FUNCTIONS: Record<Fn, { name: string; explain: string; prevent: string[]; respond: string[] }> = {
  ilgi: {
    name: "İlgi ihtiyacı",
    explain: "Kayıtlarınız, davranışın çoğu zaman sizin ilginizi çektiğinizi gösteriyor. Uzun konuşma, azarlama ya da ikna da ilgidir; çocuk için olumsuz ilgi, hiç ilgi olmamasından daha iyidir.",
    prevent: ["Günde 10 dakikalık, telefonsuz ve yönergesiz “özel zaman” ayırın; oyunu çocuk seçsin.", "Meşgul olacağınız anlardan önce haber verin ve ona küçük bir görev ya da etkinlik verin.", "Sakin ve uygun davrandığı anları yakalayıp hemen fark edin: “Kardeşinle sırayla oynaman çok güzeldi.”"],
    respond: ["Davranış güvenliyse kısa ve sakin kalın; uzun konuşmayı ve nasihati sonraya bırakın.", "Davranış durduğu anda ilginizi geri verin; ilgiyi sakinliğe bağlayın."],
  },
  kacinma: {
    name: "Görevden kaçınma",
    explain: "Kayıtlarınız, davranışın çoğunlukla bir görev ya da geçiş istendiğinde ortaya çıktığını ve sonunda görevin ertelendiğini gösteriyor. Çocuk, bu davranışla zor bir şeyden kurtulabildiğini öğrenmiş olabilir.",
    prevent: ["Görevi küçük parçalara bölün: “Odanı topla” yerine “Önce sadece kitapları rafa koy.”", "Geçişlerden 5 dakika önce uyarı verin ve görsel bir zamanlayıcı kullanın.", "İki seçenek sunun; iki seçenek de görevi içersin: “Banyoya şimdi mi gidersin, bu bölüm bitince mi?”"],
    respond: ["Görevi geri çekmeyin; sakin bir sesle tekrar edin ve ilk küçük adımda ona yardım edin.", "Görev bittiğinde kısa ve net bir takdir verin."],
  },
  istek: {
    name: "İstediğini elde etme",
    explain: "Kayıtlarınız, davranışın genellikle bir isteğe hayır denildiğinde başladığını ve zaman zaman istenen şeyin sonunda verildiğini gösteriyor. Ara sıra kazanmak, davranışı en güçlü biçimde besleyen durumdur.",
    prevent: ["Kuralları önceden ve birlikte belirleyin (ekran süresi, atıştırmalık, harçlık) ve görünür bir yere asın.", "“Hayır” yerine “Evet, …dan sonra” kalıbını deneyin: “Evet, oyun oynayabilirsin, ödevin bittikten sonra.”", "İsteğini uygun bir dille ifade ettiğinde bunu takdir edin."],
    respond: ["Hayır dediyseniz, davranış ne kadar büyürse büyüsün kararınızı değiştirmeyin.", "Duyguyu adlandırın ama sınırı koruyun: “Çok kızdığını görüyorum. Ekran süresi bitti.”"],
  },
  fizyolojik: {
    name: "Yorgunluk, açlık, uykusuzluk",
    explain: "Kayıtlarınızda davranışın sık sık yorgunluk, açlık ya da uykusuzlukla birlikte görüldüğü dikkat çekiyor. Bu durumda öncelik davranışa değil, bedensel ihtiyaca yönelmektir.",
    prevent: ["Uyku ve yemek saatlerini olabildiğince sabitleyin.", "Zor görevleri ve önemli konuşmaları çocuğun dinlenmiş olduğu saatlere taşıyın.", "Okul çıkışında atıştırmalık ve kısa bir dinlenme molası planlayın."],
    respond: ["Önce ihtiyacı karşılayın (su, yemek, dinlenme), konuşmayı sonra yapın.", "Bu anlarda yeni kural ya da görev eklemeyin."],
  },
};

export const ANTECEDENTS: { k: string; l: string; f: Fn | null }[] = [
  { k: "gorev", l: "Bir görev ya da sorumluluk istendi", f: "kacinma" },
  { k: "gecis", l: "Bir etkinlikten diğerine geçmesi istendi", f: "kacinma" },
  { k: "elestiri", l: "Uyarıldı, eleştirildi ya da kıyaslandı", f: "kacinma" },
  { k: "hayir", l: "İstediği bir şeye hayır denildi", f: "istek" },
  { k: "ekran", l: "Ekranı ya da oyunu bırakması istendi", f: "istek" },
  { k: "mesgul", l: "Ben meşguldüm ya da başkasıyla ilgileniyordum", f: "ilgi" },
  { k: "kardes", l: "Kardeşi ya da başka bir çocukla birlikteydi", f: "ilgi" },
  { k: "yorgun", l: "Yorgun, aç ya da uykusuzdu", f: "fizyolojik" },
  { k: "diger", l: "Başka bir durum", f: null },
];

export const CONSEQUENCES: { k: string; l: string; f: Fn | null; risk?: boolean; good?: boolean }[] = [
  { k: "verildi", l: "Sonunda istediği verildi", f: "istek", risk: true },
  { k: "ertelendi", l: "Görev ertelendi ya da geri çekildi", f: "kacinma", risk: true },
  { k: "konusma", l: "Uzun konuştum, ikna etmeye çalıştım", f: "ilgi", risk: true },
  { k: "bagirma", l: "Bağırdım ya da azarladım", f: "ilgi", risk: true },
  { k: "ceza", l: "Ceza verdim", f: null },
  { k: "sinir", l: "Sakin kaldım, sınırı korudum", f: null, good: true },
  { k: "adlandir", l: "Duygusunu adlandırdım, sonra devam ettik", f: null, good: true },
  { k: "gormezden", l: "Güvenliydi, planlı olarak görmezden geldim", f: null, good: true },
  { k: "diger", l: "Başka bir şey oldu", f: null },
];

export type Behavior = {
  key: string; title: string; age: string; short: string; color: string;
  examples: string[]; target: string;
  prevent: string[]; teach: string[]; reinforce: string[]; respond: string[];
};

export const BEHAVIORS: Behavior[] = [
  { key: "ofke", title: "Öfke nöbetleri", age: "2–12 yaş", color: "blush", short: "Ağlama, bağırma, yere atılma, eşya fırlatma.",
    examples: ["Hayır duyunca yere atılıyor", "Kızınca eşyaları fırlatıyor", "Uzun süre sakinleşemiyor"],
    target: "Kızdığında duygusunu sözle söylemesi ya da sakinleşme köşesini kullanması",
    prevent: ["Gün içindeki zor anları (geçişler, yorgunluk saatleri) önceden belirleyin ve bu anlara hazırlık yapın.", "Sakinken birlikte bir “sakinleşme köşesi” hazırlayın: yastık, su, sevdiği bir kitap."],
    teach: ["Sakin anlarda duygu kartlarıyla “kızgın, hayal kırıklığına uğramış, kıskanç” gibi kelimeleri öğretin.", "Birlikte derin nefes oyunu oynayın: “Mumu üfle, çiçeği kokla.”"],
    reinforce: ["Kızgınlığını sözle söylediğinde hemen fark edin: “Kızdığını söyledin, bağırmadın. Bu çok olgun bir davranış.”"],
    respond: ["Güvenliği sağlayın, az konuşun, yanında kalın.", "Nöbet bitince sarılın ve kısa bir onarım konuşması yapın; uzun nasihat vermeyin."] },
  { key: "soz", title: "Söz dinlememe ve karşı gelme", age: "3–14 yaş", color: "sky", short: "Duymazdan gelme, “hayır” deme, pazarlık.",
    examples: ["Aynı şeyi beş kez söylemem gerekiyor", "Her yönergeye “ama” ile cevap veriyor", "Kuralları sürekli test ediyor"],
    target: "Bir yönergeye ilk ya da ikinci söyleyişte uyması",
    prevent: ["Yönergeyi yakından, göz teması kurarak ve bir kez verin; başka odadan seslenmeyin.", "Yönergeyi soru olarak değil, net ve kısa bir cümle olarak söyleyin: “Ayakkabılarını dolaba koy.”"],
    teach: ["Haftada birkaç kez “yönerge oyunu” oynayın: eğlenceli yönergeler verin, uyduğunda kutlayın."],
    reinforce: ["Uyduğu her yönergeyi ilk günlerde mutlaka fark edin; bir puan tablosu kullanabilirsiniz."],
    respond: ["Uymazsa yönergeyi bir kez daha sakin bir sesle, bir seçenekle tekrarlayın.", "Önceden konuşulmuş, mantıklı ve kısa bir sonucu uygulayın; tehdit edip uygulamamaktan kaçının."] },
  { key: "ekran", title: "Ekran süresi tartışmaları", age: "4–18 yaş", color: "butter", short: "Telefonu, tableti ya da oyunu bırakmama.",
    examples: ["Ekranı kapatınca kıyamet kopuyor", "Gizlice telefon kullanıyor", "“5 dakika daha” hiç bitmiyor"],
    target: "Ekran süresi bittiğinde uyarıdan sonra cihazı teslim etmesi",
    prevent: ["Ekran kurallarını aile toplantısında birlikte yazın ve imzalayın.", "Bitişten 10 ve 2 dakika önce uyarı verin; zamanlayıcıyı çocuğun kendisi kursun.", "Ekran sonrası için cazip bir etkinlik planlayın."],
    teach: ["Bir oyunu ya da bölümü “kaydedip bırakma” becerisini birlikte çalışın."],
    reinforce: ["Zamanında bıraktığı günleri işaretleyin; hafta sonunda birlikte seçilmiş küçük bir ayrıcalık verin."],
    respond: ["Süre bittiğinde pazarlığa girmeyin; kural tablosunu gösterin.", "Kural ihlalinde ertesi günün süresinden kısa bir kesinti, önceden bilinen bir sonuç olarak uygulanır."] },
  { key: "uyku", title: "Yatma saati direnci", age: "2–12 yaş", color: "sage", short: "Yatağa gitmeme, sık kalkma, uzun pazarlık.",
    examples: ["Yatmak bir saat sürüyor", "Gece defalarca odamıza geliyor", "Her gece yeni bir bahane"],
    target: "Uyku rutinini tamamlayıp kendi yatağında kalması",
    prevent: ["Her akşam aynı sırayla ilerleyen 20–30 dakikalık bir uyku rutini kurun ve resimli bir listeye dönüştürün.", "Yatmadan bir saat önce ekranları kapatın."],
    teach: ["Rutin listesindeki adımları gündüz oyun gibi prova edin."],
    reinforce: ["Sabah, gece yatağında kaldıysa kısa bir kutlama ve çıkartma."],
    respond: ["Kalktığında az konuşarak, sakin bir şekilde yatağına geri götürün; her seferinde aynı biçimde."] },
  { key: "odev", title: "Ödeve ve derse başlamama", age: "6–18 yaş", color: "sky", short: "Erteleme, oyalanma, ödev saatinde kavga.",
    examples: ["Ödev saati savaşa dönüşüyor", "Masaya oturuyor ama başlamıyor", "“Sonra yaparım” diyor, yapmıyor"],
    target: "Belirlenen saatte masaya oturup ilk 10 dakikayı tamamlaması",
    prevent: ["Her gün aynı saatte, aynı yerde başlayın; masayı önceden hazırlayın.", "İlk görevi çok küçük tutun: “Sadece ilk beş soru.”", "Çocuğun mizacını ve öğrenme stilini dikkate alın; sitemizdeki testler yardımcı olabilir."],
    teach: ["Birlikte bir haftalık plan yapın; planı çocuk yazsın."],
    reinforce: ["Başladığı anı takdir edin: “Zamanında oturdun, bu çok önemli bir adım.”"],
    respond: ["Başlamadıysa yanına oturun ve ilk soruyu birlikte okuyun; sonra çekilin.", "Ödevi onun yerine yapmayın; yanında olun."] },
  { key: "kardes", title: "Kardeş kavgası", age: "3–14 yaş", color: "blush", short: "Vurma, itme, eşya kapma, sürekli şikâyet.",
    examples: ["Her gün aynı oyuncak için kavga", "Biri sürekli diğerini kızdırıyor", "Hakem olmaktan yoruldum"],
    target: "Anlaşmazlıkta sözle çözüm önermesi ya da yardım istemesi",
    prevent: ["Her çocuğa ayrı ayrı kısa özel zaman ayırın.", "Paylaşılması zor olan eşyalar için sıra ve süre kuralı koyun."],
    teach: ["Sakin bir anda “çözüm önerme” cümlelerini çalışın: “Önce sen, sonra ben?”"],
    reinforce: ["Birlikte uyumla oynadıkları anları ikisine birden fark ettirin."],
    respond: ["Güvenlik yoksa hemen ayırın; güvenlik varsa hakem olmayın, çözümü onlara bırakın.", "Suçlu aramak yerine “ikiniz de ne istiyorsunuz?” diye sorun."] },
  { key: "sabah", title: "Sabah hazırlık krizi", age: "3–14 yaş", color: "butter", short: "Giyinmeme, oyalanma, servise yetişememe.",
    examples: ["Her sabah bağırarak evden çıkıyoruz", "Giyinmesi yarım saat sürüyor", "Kahvaltıda oyalanıyor"],
    target: "Sabah rutinini hatırlatma listesine bakarak zamanında tamamlaması",
    prevent: ["Kıyafeti ve çantayı akşamdan birlikte hazırlayın.", "Resimli bir sabah listesi asın; adımları çocuk işaretlesin.", "15 dakika erken uyandırın."],
    teach: ["Hafta sonu sabah rutinini oyun gibi deneyin: “Bakalım kaç dakikada bitireceğiz?”"],
    reinforce: ["Zamanında hazır olduğu sabahları takvime işaretleyin."],
    respond: ["Komut vermek yerine listeyi gösterin: “Listede sırada ne var?”"] },
  { key: "ergen", title: "Ergenle iletişim kopukluğu", age: "12–18 yaş", color: "sage", short: "Ters cevap, kapı çarpma, odaya kapanma.",
    examples: ["Konuşmaya çalıştıkça uzaklaşıyor", "Her konuşma tartışmaya dönüyor", "Sadece tek kelimelik cevaplar"],
    target: "Haftada en az iki kez sakin, kısa bir sohbetin karşılıklı olması",
    prevent: ["Konuşmayı yüz yüze değil yan yana yapın: arabada, yürüyüşte, yemek hazırlarken.", "Sorgu sorularını (“Ders ne oldu?”) ilgi sorularıyla değiştirin (“Bugün seni ne güldürdü?”)."],
    teach: ["Sınırları birlikte, gerekçesiyle konuşun ve onun önerilerini de alın."],
    reinforce: ["Kendiliğinden bir şey anlattığında dinleyin, öneri vermeden önce “Fikrimi ister misin?” diye sorun."],
    respond: ["Ters cevaba aynı tonda karşılık vermeyin: “Böyle konuşunca seni dinleyemiyorum. Sakinleşince konuşalım.”", "Kapı çarpıp çekildiğinde peşinden gitmeyin; daha sonra sakin bir anda onarım yapın."] },
];

export const behaviorByKey = (k: string) => BEHAVIORS.find((b) => b.key === k);

type AbcLog = { occurred_at: string; antecedent: string; consequence: string; intensity: number | null };

export function analyzeAbc(logs: AbcLog[]) {
  const count = (arr: string[]) => {
    const m = new Map<string, number>();
    arr.forEach((x) => m.set(x, (m.get(x) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const ant = count(logs.map((l) => l.antecedent));
  const con = count(logs.map((l) => l.consequence));
  const fnScore: Record<Fn, number> = { ilgi: 0, kacinma: 0, istek: 0, fizyolojik: 0 };
  logs.forEach((l) => {
    const a = ANTECEDENTS.find((x) => x.k === l.antecedent);
    const c = CONSEQUENCES.find((x) => x.k === l.consequence);
    if (a?.f) fnScore[a.f] += 1;
    if (c?.f && c.risk) fnScore[c.f] += 1.5;
  });
  const topFn = (Object.entries(fnScore) as [Fn, number][]).sort((a, b) => b[1] - a[1])[0];
  const risky = logs.filter((l) => CONSEQUENCES.find((c) => c.k === l.consequence)?.risk).length;
  const good = logs.filter((l) => CONSEQUENCES.find((c) => c.k === l.consequence)?.good).length;
  const slot = (h: number) => (h >= 6 && h < 12 ? "Sabah" : h >= 12 && h < 17 ? "Öğleden sonra" : h >= 17 && h < 21 ? "Akşam" : "Gece");
  const times = count(logs.map((l) => slot(new Date(l.occurred_at).getHours())));
  const intens = logs.map((l) => l.intensity).filter((x): x is number => !!x);
  return {
    n: logs.length,
    ant: ant.map(([k, n]) => ({ label: ANTECEDENTS.find((a) => a.k === k)?.l ?? k, n })),
    con: con.map(([k, n]) => ({ label: CONSEQUENCES.find((c) => c.k === k)?.l ?? k, n })),
    fn: logs.length >= 3 && topFn[1] > 0 ? topFn[0] : null,
    risky, good, times,
    avgIntensity: intens.length ? intens.reduce((a, b) => a + b, 0) / intens.length : null,
  };
}

type Daily = { day: string; problem_count: number; positive_count: number; plan_applied: boolean };
export function progress(daily: Daily[]) {
  const s = [...daily].sort((a, b) => a.day.localeCompare(b.day));
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const first = s.slice(0, Math.min(7, Math.ceil(s.length / 2)));
  const last = s.slice(-Math.min(7, Math.floor(s.length / 2)));
  const base = avg(first.map((d) => d.problem_count));
  const now = avg(last.map((d) => d.problem_count));
  const posBase = avg(first.map((d) => d.positive_count));
  const posNow = avg(last.map((d) => d.positive_count));
  return {
    days: s.length,
    base, now, posBase, posNow,
    change: s.length >= 4 && base > 0 ? Math.round(((now - base) / base) * 100) : null,
    applied: s.filter((d) => d.plan_applied).length,
  };
}
