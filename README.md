# Beyazsayfa

Aile ve öğrenci koçluğu sitesi. Next.js 15 + Supabase + Vercel.

## Sık düzenlenecek dosyalar
| Ne | Dosya |
|---|---|
| Renk paleti ve yazı tipleri | `app/theme.css` |
| Site adı, slogan, telefon, WhatsApp, e-posta | `lib/site.ts` |
| Fotoğraflar | `lib/photos.ts` |
| Eğitimler, paketler, fiyatlar | `lib/catalog.ts` |
| Mizaç ve öğrenme testi soruları | `lib/tests.ts` |
| 15 koçluk formu | `lib/forms.ts` |
| Davranış programı içerikleri | `lib/behaviors.ts` |
| Yasal metinler | `app/yasal/[doc]/page.tsx` |

## Vercel ortam değişkenleri
`.env.example` dosyasındaki değişkenleri Vercel > Project > Settings > Environment Variables'a ekleyin.

## Yönetici hesabı
Siteye normal üye olun, ardından Supabase SQL Editor'da:
```sql
update profiles set role = 'yonetim' where email = 'sizin@epostaniz.com';
```
