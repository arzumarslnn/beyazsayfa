"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PHOTOS } from "@/lib/photos";

const SLIDES = [
  { id: "slaytIlkokul", label: "İlkokul çağındaki aileler", tint: "bg-sky" },
  { id: "slaytLise", label: "Lise çağındaki aileler", tint: "bg-sage" },
];

/** Ana sayfada yumuşak geçişle değişen iki aile fotoğrafı. */
export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-sky md:rounded-[4rem]">
        {SLIDES.map((s, k) => {
          const p = PHOTOS[s.id];
          return (
            <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
              {p.src ? (
                <Image src={p.src} alt={p.alt} fill priority={k === 0} quality={90} sizes="(max-width: 768px) 100vw, 45vw"
                  className={`object-cover transition-transform duration-[7000ms] ease-out ${k === i ? "scale-105" : "scale-100"}`} draggable={false} />
              ) : <div className={`absolute inset-0 ${s.tint}`} />}
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
        <span className="rounded-full bg-paper/90 px-4 py-2 text-sm font-bold shadow-sm">{SLIDES[i].label}</span>
        <div className="flex gap-2 rounded-full bg-paper/90 px-3 py-2 shadow-sm">
          {SLIDES.map((s, k) => (
            <button key={s.id} type="button" onClick={() => setI(k)} aria-label={s.label}
              className={`h-2.5 rounded-full transition-all ${k === i ? "w-7 bg-action" : "w-2.5 bg-ink/25"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
