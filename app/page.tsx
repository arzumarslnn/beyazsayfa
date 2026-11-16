import Link from "next/link";
import Photo from "@/components/Photo";
import Marquee from "@/components/Marquee";
import { BEHAVIORS } from "@/lib/behaviors";
import { COURSES } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";
import SampleChart from "@/components/SampleChart";

export const revalidate = 300;

const BG: Record<string, string> = { blush: "bg-blush", sky: "bg-sky", butter: "bg-butter", sage: "bg-sage" };

async function getData() {
  try {
    const supabase = await createClient();
    const [{ data: posts }, { data: stories }] = await Promise.all([
      supabase.from("blog_posts").select("slug,title,category,excerpt,read_min,cover").eq("published", true).order("created_at", { ascending: false }).limit(3),
      supabase.from("testimonials").select("display_name,role_label,body").eq("approved", true).order("created_at", { ascending: false }).limit(3),
    ]);
    return { posts: posts ?? [], stories: stories ?? [] };
  } catch {
    return { posts: [], stories: [] };
  }
}

export default async function Home() {
  const { posts, stories } = await getData();
  return (
    <>
      {/* HERO */}
      <section className="wrap grid items-center gap-10 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr] md:pt-16">
        <div className="flex flex-col gap-6">
          <span className="eyebrow">Aile ve öğrenci koçluğu</span>
          <h1>Her çocuk için temiz bir sayfa.<br /><span className="text-action">Her aile için yeni bir başlangıç.</span></h1>
          <p className="lead">Çocuğunuzla değil, ailenizle birlikte çalışıyoruz. Hedefimiz yalnızca iyi bir okul değil: çocuğun kendini tanıması, sevdiği işe yönelmesi ve evde iletişimin yeniden akması.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/iletisim" className="btn-primary">Ücretsiz ön görüşme</Link>
            <Link href="/testler/mizac" className="btn-ghost">Mizaç testini çöz</Link>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold text-muted">
            <li>✓ Bilimsel temelli yöntemler</li><li>✓ Aileyle birlikte süreç</li><li>✓ Çocuğun gizliliği korunur</li>
          </ul>
        </div>
        <div className="relative">
          <Photo id="hero" priority className="aspect-[4/5] rounded-[3rem] md:rounded-[4rem]" />
          <div className="absolute -bottom-6 -left-4 max-w-[240px] rounded-3xl bg-butter p-5 shadow-lg md:-left-10">
            <p className="font-display text-lg font-bold leading-snug">“Önce çocuğumu anlamayı öğrendim, gerisi geldi.”</p>
            <p className="mt-1 text-sm text-muted">Hedefimiz bu cümle</p>
          </div>
        </div>
      </section>

      <Marquee items={["Davranışı anla", "Olumlu davranışı büyüt", "Problem davranışı azalt", "Çocuğunla bağ kur", "Sevdiği yolu bul"]} />

      {/* SORUN BAZLI */}
      <section className="wrap py-20">
        <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
          <span className="eyebrow">Nereden başlayalım?</span>
          <h2>Bugün evde sizi en çok ne zorluyor?</h2>
          <p className="lead">Bir konu seçin. Size uygun eğitimi ve evde hemen başlayabileceğiniz davranış programını gösterelim.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BEHAVIORS.map((b) => {
            const c = COURSES.find((x) => x.behaviorKey === b.key);
            return (
              <Link key={b.key} href={c ? `/ebeveyn-egitimi/${c.key}` : `/davranis-programi#${b.key}`}
                className={`group flex min-h-[190px] flex-col justify-between rounded-3xl ${BG[b.color]} p-6 transition hover:-translate-y-1`}>
                <div>
                  <span className="chip bg-bg/70 text-ink">{b.age}</span>
                  <h3 className="mt-3">{b.title}</h3>
                  <p className="mt-1 text-[15px] text-ink/70">{b.short}</p>
                </div>
                <span className="mt-4 font-bold">Çözümü gör <span className="inline-block transition group-hover:translate-x-1">→</span></span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ÜÇ YOL */}
      <section className="bg-paper py-20">
        <div className="wrap">
          <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
            <span className="eyebrow">Neler yapıyoruz</span>
            <h2>Aynı sayfada buluşan üç program</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { id: "ebeveyn", href: "/ebeveyn-egitimi", t: "Ebeveyn eğitimleri", d: "Öfke nöbetinden ekran savaşlarına, sorun bazlı kısa eğitimler. Kendi hızınızda, evden." },
              { id: "kocluk", href: "/ogrenci-koclugu", t: "Öğrenci koçluğu", d: "Hedef, plan, motivasyon ve meslek yönelimi. Her adım formlarla kayıt altında, aileyle birlikte." },
              { id: "aile", href: "/davranis-programi", t: "Davranış programı", d: "Bir davranış seçin, kayıt tutun, size özel planı uygulayın ve gelişimi grafikte izleyin." },
            ].map((x) => (
              <Link key={x.id} href={x.href} className="group flex flex-col gap-4">
                <Photo id={x.id} className="aspect-[4/3] rounded-[2rem]" sizes="(max-width: 768px) 100vw, 33vw" />
                <h3>{x.t}</h3>
                <p className="text-muted">{x.d}</p>
                <span className="font-bold text-action">Keşfet →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DAVRANIŞ PROGRAMI */}
      <section className="wrap grid items-center gap-12 py-20 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <span className="eyebrow">Beyazsayfa'ya özel</span>
          <h2>Davranışı kontrol etmeye değil, anlamaya ve değiştirmeye odaklanan bir program</h2>
          <p className="lead">Davranış bilimine dayanan ABC yöntemiyle, davranıştan hemen önce ve sonra ne olduğunu kaydedersiniz. Sistem kayıtlarınızdan bir örüntü çıkarır, size özel bir uygulama planı önerir ve gelişimi haftalar içinde grafikte gösterir.</p>
          <ol className="grid gap-3">
            {[
              ["Davranışı seçin", "Öfke nöbeti, söz dinlememe, ekran, uyku…"],
              ["ABC kaydı tutun", "Önce ne oldu, ne yaptı, sonra ne oldu?"],
              ["Planı uygulayın", "Kayıtlarınıza göre kişiselleşen adımlar"],
              ["Gelişimi izleyin", "Günlük kayıt ve haftalık değişim grafiği"],
            ].map(([t, d], i) => (
              <li key={t} className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-action font-display font-bold text-action-ink">{i + 1}</span>
                <span><b className="font-display text-lg">{t}</b><br /><span className="text-muted">{d}</span></span>
              </li>
            ))}
          </ol>
          <div><Link href="/davranis-programi" className="btn-primary">Programı incele</Link></div>
        </div>
        <div className="rounded-[2.5rem] bg-sky p-6 md:p-8">
          <div className="rounded-3xl bg-bg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <b className="font-display text-lg">Öfke nöbetleri · Deniz, 5 yaş</b>
              <span className="chip bg-sage text-ink">Örnek görünüm</span>
            </div>
            <SampleChart />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-paper p-3"><div className="font-display text-2xl font-extrabold tabular-nums">-%58</div><div className="text-xs text-muted">günlük nöbet</div></div>
              <div className="rounded-2xl bg-paper p-3"><div className="font-display text-2xl font-extrabold tabular-nums">+%120</div><div className="text-xs text-muted">olumlu davranış</div></div>
              <div className="rounded-2xl bg-paper p-3"><div className="font-display text-2xl font-extrabold tabular-nums">21</div><div className="text-xs text-muted">kayıtlı gün</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTLER */}
      <section className="wrap">
        <div className="grid items-center gap-8 rounded-[2.5rem] bg-butter p-8 md:grid-cols-[1fr_auto] md:p-14">
          <div className="flex flex-col gap-3">
            <span className="eyebrow text-ink/70">Ücretsiz</span>
            <h2>Mizacını ve öğrenme stilini 5 dakikada keşfet</h2>
            <p className="max-w-prose text-lg text-ink/75">Testi çöz, sonucunu hemen gör. Üye öğrencilerde analiz kaydedilir ve öğrenci isterse aynı rapor veliye e-posta ve WhatsApp ile gider.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Link href="/testler/mizac" className="btn-primary">Mizaç testi</Link>
            <Link href="/testler/ogrenme" className="btn-light">Öğrenme stili testi</Link>
          </div>
        </div>
      </section>

      {/* NEDEN */}
      <section className="wrap py-20">
        <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
          <span className="eyebrow">Bizi farklı kılan</span>
          <h2>Sınav sonucunu değil, mutlu bir aileyi hedefliyoruz</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Aile sürecin ortağı", "Veli formları, ebeveyn eğitimleri ve üçlü değerlendirmeyle aile her adımda sürecin içinde."],
            ["Önce mutluluk", "Başarıyı çocuğun iyi olma hâli üzerine kuruyoruz. Hedef, çocuğun sevdiği bir yol."],
            ["Mizaca göre plan", "Çalışma düzeni ve ebeveyn tutumu, çocuğun mizacına ve öğrenme stiline göre şekillenir."],
            ["Gizlilik", "Çocuğun doldurduğu formları veli göremez. Neyi paylaşacağına öğrenci karar verir."],
          ].map(([t, d]) => (
            <div key={t} className="card">
              <h3 className="text-xl">{t}</h3>
              <p className="mt-2 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DENEYİMLER */}
      {stories.length > 0 && (
        <section className="bg-blush py-20">
          <div className="wrap">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-3"><span className="eyebrow text-ink/70">Deneyimler</span><h2>Bizimle yol yürüyenler</h2></div>
              <Link href="/deneyimler" className="btn-light">Tümünü oku</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {stories.map((s: any, i: number) => (
                <figure key={i} className="flex flex-col justify-between gap-4 rounded-3xl bg-bg p-7">
                  <blockquote className="font-display text-xl font-semibold leading-snug">“{s.body}”</blockquote>
                  <figcaption className="font-bold">{s.display_name} <span className="font-normal text-muted">· {s.role_label}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="wrap py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3"><span className="eyebrow">Blog</span><h2>Ailelere ve öğrencilere yazılar</h2></div>
            <Link href="/blog" className="btn-ghost">Tüm yazılar</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p: any) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col gap-3">
                <Photo id={p.cover || "aile"} className="aspect-[3/2] rounded-[1.75rem]" sizes="(max-width: 768px) 100vw, 33vw" />
                <span className="text-sm font-bold text-accent">{p.category} · {p.read_min} dk</span>
                <h3 className="group-hover:underline">{p.title}</h3>
                <p className="text-muted">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="wrap">
        <div className="flex flex-col items-start gap-6 rounded-[2.5rem] bg-action p-8 text-action-ink md:flex-row md:items-center md:justify-between md:p-14">
          <div className="flex flex-col gap-3">
            <h2 className="text-action-ink">İlk görüşme ücretsiz</h2>
            <p className="max-w-xl text-lg opacity-85">30 dakikalık bir tanışma görüşmesinde ihtiyacınızı dinleyelim, size uygun yolu birlikte seçelim.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/iletisim" className="btn-light">Randevu iste</Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn border-2 border-action-ink/40 text-action-ink">WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
