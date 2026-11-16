// Sitedeki fotoğraflar. Bir fotoğrafı değiştirmek için "src" adresini değiştirin.
// src boşsa yerine yumuşak renkli bir alan ve açıklaması görünür.
// Ücretsiz lisanslı fotoğraflar: unsplash.com (Unsplash+ etiketli olanlar ücretlidir, onları kullanmayın).
export type Photo = { src: string; alt: string; credit?: string };

export const PHOTOS: Record<string, Photo> = {
  hero: { src: "", alt: "Bir anne ve genç kızı mutfakta sohbet ederken gülüyor" },
  aile: { src: "", alt: "Bir aile salonda birlikte oturmuş sohbet ediyor" },
  kocluk: { src: "", alt: "Bir öğrenci masasında not alırken" },
  ebeveyn: { src: "", alt: "Bir baba küçük çocuğuyla göz hizasında konuşuyor" },
  testler: { src: "", alt: "Bir genç kız defterine bir şeyler yazarken düşünüyor" },
  hakkimizda: { src: "", alt: "Aydınlık bir çalışma odası, masada defterler" },
  ofke: { src: "", alt: "Bir anne ağlayan küçük çocuğunu sakinleştiriyor" },
  isbirligi: { src: "", alt: "Bir çocuk ve ebeveyni birlikte oyuncakları topluyor" },
  ekran: { src: "", alt: "Bir çocuk tablet kullanıyor" },
  odev: { src: "", alt: "Bir çocuk masasında ödev yaparken" },
  ergen: { src: "", alt: "Bir baba ve genç oğlu yan yana yürüyor" },
  sinav: { src: "", alt: "Bir genç kitaplarının başında çalışıyor" },
  deneme: { src: "", alt: "Bir öğrenci sınav kâğıdına bakıyor" },
  mizac: { src: "", alt: "Bir çocuk pencere kenarında oturmuş düşünüyor" },
  ogrenme: { src: "", alt: "Renkli kalemler ve kavram haritası" },
  meslek: { src: "", alt: "Bir genç bir atölyede çalışıyor" },
};
