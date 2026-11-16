// Sitedeki fotoğraflar. Bir fotoğrafı değiştirmek için "src" adresini değiştirin.
// src boşsa yerine yumuşak renkli bir alan ve açıklaması görünür.
// Fotoğraflar pexels.com'dan. Değiştirmek için pexels.com/photo/... adresinin sonundaki numarayı px(...) içine yazın.
// Pexels lisansı: ticari kullanım dahil ücretsiz, kaynak göstermek zorunlu değil.
const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

export type Photo = { src: string; alt: string; credit?: string };

export const PHOTOS: Record<string, Photo> = {
  hero: { src: px(7469382), alt: "İstanbul'da bir aile evde birlikte yemek yiyor" },
  aile: { src: px(7469292), alt: "İstanbul'da bir aile küçük oğullarıyla akşam yemeğinde" },
  kocluk: { src: px(7694945), alt: "Bir öğrenci masasında not alırken" },
  ebeveyn: { src: px(8290214), alt: "Bir anne çocuklarıyla birlikte hamur yoğuruyor" },
  testler: { src: px(6929188), alt: "Bir genç kız defterine bir şeyler yazarken düşünüyor" },
  hakkimizda: { src: px(9491137), alt: "Çay ve peynirle kurulmuş bir Türk kahvaltı sofrası" },
  ofke: { src: px(7302870), alt: "Bir anne ağlayan küçük çocuğunu sakinleştiriyor" },
  isbirligi: { src: px(8290118), alt: "Bir anne ve kızı mutfakta birlikte kek yapıyor" },
  ekran: { src: px(4144040), alt: "Bir çocuk tablet kullanıyor" },
  odev: { src: px(7683899), alt: "Bir çocuk masasında ödev yaparken" },
  ergen: { src: px(18018505), alt: "Bir baba ve oğlu İstanbul'da iskelede oturmuş sohbet ediyor" },
  sinav: { src: px(6958537), alt: "Bir genç kitaplarının başında çalışıyor" },
  deneme: { src: px(6684209), alt: "Bir öğrenci sınav kâğıdına bakıyor" },
  mizac: { src: px(4049162), alt: "Bir çocuk pencere kenarında oturmuş düşünüyor" },
  ogrenme: { src: px(2381853), alt: "Renkli kalemler ve kavram haritası" },
  meslek: { src: px(16850261), alt: "Bir genç bir atölyede çalışıyor" },
};
