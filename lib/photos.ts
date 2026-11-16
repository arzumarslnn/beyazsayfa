// Sitedeki fotoğraflar. Bir fotoğrafı değiştirmek için "src" adresini değiştirin.
// src boşsa yerine yumuşak renkli bir alan ve açıklaması görünür.
// Fotoğraflar pexels.com'dan. Değiştirmek için pexels.com/photo/... adresinin sonundaki numarayı px(...) içine yazın.
// Pexels lisansı: ticari kullanım dahil ücretsiz, kaynak göstermek zorunlu değil.
const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;

export type Photo = { src: string; alt: string; credit?: string };

export const PHOTOS: Record<string, Photo> = {
  hero: { src: px(4835235), alt: "Bir anne ve genç kızı mutfakta sohbet ederken gülüyor" },
  aile: { src: px(11368546), alt: "Bir aile salonda birlikte oturmuş sohbet ediyor" },
  kocluk: { src: px(7694945), alt: "Bir öğrenci masasında not alırken" },
  ebeveyn: { src: px(4260104), alt: "Bir baba küçük çocuğuyla göz hizasında konuşuyor" },
  testler: { src: px(6929188), alt: "Bir genç kız defterine bir şeyler yazarken düşünüyor" },
  hakkimizda: { src: px(5490911), alt: "Aydınlık bir çalışma odası, masada defterler" },
  ofke: { src: px(7302870), alt: "Bir anne ağlayan küçük çocuğunu sakinleştiriyor" },
  isbirligi: { src: px(10554815), alt: "Bir çocuk ve ebeveyni birlikte oyuncakları topluyor" },
  ekran: { src: px(4144040), alt: "Bir çocuk tablet kullanıyor" },
  odev: { src: px(7683899), alt: "Bir çocuk masasında ödev yaparken" },
  ergen: { src: px(8841296), alt: "Bir baba ve genç oğlu yan yana yürüyor" },
  sinav: { src: px(6958537), alt: "Bir genç kitaplarının başında çalışıyor" },
  deneme: { src: px(6684209), alt: "Bir öğrenci sınav kâğıdına bakıyor" },
  mizac: { src: px(4049162), alt: "Bir çocuk pencere kenarında oturmuş düşünüyor" },
  ogrenme: { src: px(2381853), alt: "Renkli kalemler ve kavram haritası" },
  meslek: { src: px(16850261), alt: "Bir genç bir atölyede çalışıyor" },
};
