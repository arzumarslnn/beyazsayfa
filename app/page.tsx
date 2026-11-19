import Link from "next/link";
import Photo from "@/components/Photo";
import Marquee from "@/components/Marquee";
import HeroSlider from "@/components/HeroSlider";
import VideoPlayer from "@/components/VideoPlayer";
import SampleChart from "@/components/SampleChart";
import { getStories, StoryGrid, ShareCta } from "@/components/Testimonials";
import { BEHAVIORS } from "@/lib/behaviors";
import { TOPIC_COURSES } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { getSetting } from "@/lib/settings";
import { SITE } from "@/lib/site";

export const revalidate = 300;

const BG: Record<string, string> = { blush: "bg-blush", sky: "bg-sky", butter: "bg-butter", sage: "bg-sage" };

async function getPosts() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("slug,title,category,excerpt,read_min,cover").eq("published", true).order("created_at", { ascending: false }).limit(3);
    return data ?? [];
  } catch { return []; }
}

export default async function Home() {
  const [posts, stories, introVideo] = await Promise.all([getPosts(), getStories(6), getSetting("intro_video")]);
  return (
    <>
      {/* HERO: iki program birlikte */}
      <section className="wrap grid items-center gap-10 pb-14 pt-10 md:grid-cols-[1.1fr_0.9fr] md:pt-14">
        <div className="flex flex-col gap-6">
          <span className="eyebrow">Öğrenci koçluğu · Ebeveyn davranış eğitimi</span>
          <h1>Her çocuk için temiz bir sayfa.<br /><span className="text-leaf">Her aile için yeni bir başlangıç.</span></h1>
          <p className="lead">Öğrencilere, kendi hedeflerini koyup sevdikleri yolu bulmaları için koçluk yapıyoruz. Ebeveynlere ise çocuklarının davranışlarını anlamayı ve kendi başlarına değiştirmeyi öğretiyoruz.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/ogrenci-koclugu" className="group flex flex-col gap-1 rounded-3xl bg-sky p-5 transition hover:-translate-y-0.5">
              <span className="text-sm font-bold text-action">Öğrenciler için</span>
              <b className="font-display text-xl">Öğrenci koçluğu</b>
              <span className="text-[15px] text-muted">Hedef, plan, motivasyon, meslek seçimi</span>
              <span className="mt-1 font-bold">İncele <span className="inline-block transition group-hover:translate-x-1">→</span></span>
            </Link>
            <Link href="/ebeveyn-egitimi" className="group flex flex-col gap-1 rounded-3xl bg-sage p-5 transition hover:-translate-y-0.5">
              <span className="text-sm font-bold text-ink">Ebeveynler için</span>
              <b className="font-display text-xl">Davranış eğitimi</b>
              <span className="text-[15px] text-muted">Davranışı tanıyın, teknikleri öğrenin, siz değiştirin</span>
              <span className="mt-1 font-bold">İncele <span className="inline-block transition group-hover:translate-x-1">→</span></span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/iletisim" className="btn-primary">Ücretsiz ön görüşme</Link>
            <a href="#tanitim" className="font-bold text-action">▶ Tanıtım videomuzu izleyin</a>
          </div>
        </div>
        <HeroSlider />
      </section>

      <Marquee className="bg-action text-action-ink" items={["Öğrenciye koçluk", "Ebeveyne davranış eğitimi", "Davranışı öğrenin", "Yöntemleri öğrenin", "Çocuğunuzun davranışını siz değiştirin"]} />

      {/* TANITIM VİDEOSU */}
      <section id="tanitim" className="wrap scroll-mt-24 py-16">
        <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">Bizi tanıyın</span>
            <h2>Beyazsayfa'yı bizden dinleyin</h2>
            <p className="lead">Kimiz, öğrencilerle ve ailelerle nasıl çalışıyoruz, bir koçluk ve eğitim süreci nasıl ilerliyor? Hepsini kısa bir videoda anlatıyoruz.</p>
          </div>
          {introVideo ? (
            <VideoPlayer url={introVideo} title={`${SITE.name} tanıtım videosu`} className="aspect-video rounded-[2rem]" />
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-[2rem]">
              <Photo id="video" className="absolute inset-0" />
              <div className="absolute inset-0 grid place-items-center bg-ink/45">
                <div className="flex flex-col items-center gap-3 text-center text-white">
                  <span className="grid h-20 w-20 place-items-center rounded-full bg-paper text-3xl text-action shadow-lg" aria-hidden="true">▶</span>
                  <b className="font-display text-2xl">Tanıtım videomuz çok yakında</b>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ÜÇ PROGRAM */}
      <section className="bg-paper py-20">
        <div className="wrap">
          <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
            <span className="eyebrow">Neler yapıyoruz</span>
            <h2>Aynı sayfada buluşan üç program</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { id: "kocluk", href: "/ogrenci-koclugu", t: "Öğrenci koçluğu", d: "Hedef, plan, motivasyon ve meslek yönelimi. Her adım formlarla kayıt altında, aileyle birlikte." },
              { id: "ebeveyn", href: "/ebeveyn-egitimi", t: "Ebeveyn davranış eğitimi", d: "Hazırlık, davranışı tanıma ve teknikler. Çocuğunuzun davranışını değiştirmeyi size öğretiyoruz." },
              { id: "aile", href: "/davranis-programi", t: "Davranış programı", d: "Davranışı öğrenin – yöntemleri öğrenin – çocuğunuzun davranışlarını siz düzeltin." },
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

      {/* SORUN BAZLI */}
      <section className="wrap py-20">
        <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
          <span className="eyebrow">Ebeveynler için</span>
          <h2>Bugün evde sizi en çok ne zorluyor?</h2>
          <p className="lead">Bir konu seçin. O davranışla nasıl baş edeceğinizi size adım adım öğreten eğitimi ve evde uygulayacağınız programı gösterelim.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BEHAVIORS.map((b) => {
            const c = TOPIC_COURSES.find((x) => x.behaviorKey === b.key);
            return (
              <Link key={b.key} href={c ? `/ebeveyn-egitimi/${c.key}` : `/davranis-programi#${b.key}`}
                className={`group flex min-h-[190px] flex-col justify-between rounded-3xl ${BG[b.color]} p-6 transition hover:-translate-y-1`}>
                <div>
                  <span className="chip bg-paper/80 text-ink">{b.age}</span>
                  <h3 className="mt-3">{b.title}</h3>
                  <p className="mt-1 text-[15px] text-ink">{b.short}</p>
                </div>
                <span className="mt-4 font-bold">Neler yapabilirim? <span className="inline-block transition group-hover:translate-x-1">→</span></span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* DAVRANIŞ PROGRAMI */}
      <section className="bg-paper py-20">
        <div className="wrap grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <span className="eyebrow">Beyazsayfa'ya özel</span>
            <h2>Çocuğunuzun davranışını siz değiştirin, biz nasıl yapacağınızı öğretelim</h2>
            <p className="lead">Çocuğunuzun davranışını biz düzeltmiyoruz; size davranış bilimine dayanan teknikleri öğretiyor ve uygularken yanınızda oluyoruz. ABC kayıtlarınız size özel bir plana, günlük kayıtlarınız gelişimi gösteren bir grafiğe dönüşür.</p>
            <ol className="grid gap-3">
              {[
                ["Davranışı öğrenin", "Öncesinde ve sonrasında ne oluyor?"],
                ["Yöntemleri öğrenin", "Önleme, pekiştirme, doğru tepki"],
                ["Siz uygulayın", "Kayıtlarınıza göre kişiselleşen plan"],
                ["Gelişimi görün", "Günlük kayıt ve haftalık değişim grafiği"],
              ].map(([t, d], i) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf font-display font-bold text-white">{i + 1}</span>
                  <span><b className="font-display text-lg">{t}</b><br /><span className="text-muted">{d}</span></span>
                </li>
              ))}
            </ol>
            <div><Link href="/davranis-programi" className="btn-primary">Programı incele</Link></div>
          </div>
          <div className="rounded-[2.5rem] bg-sky p-6 md:p-8">
            <div className="rounded-3xl bg-paper p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <b className="font-display text-lg">Öfke nöbetleri · Deniz, 5 yaş</b>
                <span className="chip bg-sage text-ink">Örnek görünüm</span>
              </div>
              <SampleChart />
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-bg p-3"><div className="font-display text-2xl font-extrabold tabular-nums">-%58</div><div className="text-xs text-muted">günlük nöbet</div></div>
                <div className="rounded-2xl bg-bg p-3"><div className="font-display text-2xl font-extrabold tabular-nums">+%120</div><div className="text-xs text-muted">olumlu davranış</div></div>
                <div className="rounded-2xl bg-bg p-3"><div className="font-display text-2xl font-extrabold tabular-nums">21</div><div className="text-xs text-muted">kayıtlı gün</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTLER */}
      <section className="wrap pt-20">
        <div className="grid items-center gap-8 rounded-[2.5rem] bg-butter p-8 md:grid-cols-[1fr_auto] md:p-14">
          <div className="flex flex-col gap-3">
            <span className="eyebrow text-ink">Üyelere özel</span>
            <h2>Mizacını ve öğrenme stilini keşfet</h2>
            <p className="max-w-prose text-lg text-ink">Mizaç ve öğrenme stili testleri, ayrıntılı analiz ve veliye önerilerle birlikte üyelerimize açık. Koçluk paketlerimize dahildir; ayrıca da satın alınabilir.</p>
          </div>
          <Link href="/testler" className="btn-primary">Testleri incele</Link>
        </div>
      </section>

      {/* NEDEN */}
      <section className="wrap py-20">
        <div className="mb-10 flex flex-col gap-3 md:max-w-2xl">
          <span className="eyebrow">Bizi farklı kılan</span>
          <h2>Sınav sonucunun yanında, mutlu bir aileyi hedefliyoruz</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Aile sürecin ortağı", "Veli formları, ebeveyn eğitimleri ve üçlü değerlendirmeyle aile her adımda sürecin içinde."],
            ["Ebeveyne öğretiyoruz", "Çocuğun davranışını biz düzeltmiyoruz; ebeveynlere bunu kendi başlarına yapmayı öğretiyoruz."],
            ["Mizaca göre plan", "Çalışma düzeni ve ebeveyn tutumu, çocuğun mizacına ve öğrenme stiline göre şekillenir."],
            ["Gizlilik", "Çocuğun doldurduğu formları veli göremez. Neyi paylaşacağına öğrenci karar verir."],
          ].map(([t, d]) => (
            <div key={t} className="card bg-paper">
              <h3 className="text-xl">{t}</h3>
              <p className="mt-2 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG */}
      {posts.length > 0 && (
        <section className="wrap pb-20">
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
            <p className="max-w-xl text-lg opacity-90">30 dakikalık bir tanışma görüşmesinde ihtiyacınızı dinleyelim, size uygun yolu birlikte seçelim. Takvimden boş bir saat seçmeniz yeterli.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/iletisim" className="btn-light">Randevu al</Link>
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener" className="btn border-2 border-action-ink/40 text-action-ink">WhatsApp</a>
          </div>
        </div>
      </section>

      {/* DENEYİMLER (en alt) */}
      <section className="wrap py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="flex max-w-2xl flex-col gap-3">
            <span className="eyebrow">Deneyimler</span>
            <h2>Bizimle çalışan aileler ve öğrenciler anlatıyor</h2>
          </div>
          {stories.length > 0 && <Link href="/deneyimler" className="btn-ghost">Tümünü gör</Link>}
        </div>
        {stories.length > 0 && <div className="mb-8"><StoryGrid stories={stories} /></div>}
        <ShareCta />
      </section>
    </>
  );
}
