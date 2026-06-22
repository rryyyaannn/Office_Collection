import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import MediaFrame from "./MediaFrame";
import { MEDIA } from "../media";
import { useT } from "../i18n";

// Estrutura dos slides (tom p/ fallback + destino); textos vêm do i18n.
const SLIDE_META = [
  { tone: "ink", href: "#catalogo" },
  { tone: "navy", href: "#social" },
  { tone: "wine", href: "#historia" },
];

const AUTOPLAY = 6000;

export default function Hero() {
  const t = useT();
  const [active, setActive] = useState(0);
  const count = SLIDE_META.length;
  const go = (i) => setActive((i + count) % count);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % count), AUTOPLAY);
    return () => clearInterval(id);
  }, [active, count]);

  const slide = t.hero.slides[active];

  return (
    <section className="group relative h-[90vh] min-h-[560px] w-full overflow-hidden bg-graphite">
      {SLIDE_META.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== active}
        >
          <MediaFrame
            fill
            media={MEDIA.heroSlides[i]}
            tone={s.tone}
            motion
            alt={`${t.hero.slides[i].eyebrow} — ${t.hero.slides[i].title}`}
          />
        </div>
      ))}

      <div
        className="absolute inset-0 z-[5]"
        style={{
          background:
            "linear-gradient(to top, rgba(28,26,26,0.78) 0%, rgba(28,26,26,0.12) 45%, rgba(28,26,26,0.30) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="container-page absolute inset-x-0 bottom-0 z-10 pb-16 lg:pb-20">
        <div key={active} className="max-w-2xl text-white">
          <div className="flex animate-fade-up items-center gap-3">
            <span className="h-px w-9 bg-white/80" aria-hidden="true" />
            <span className="font-body text-[11.5px] font-semibold uppercase tracking-label text-white/90">
              {slide.eyebrow}
            </span>
          </div>
          <h1
            className="mt-4 animate-fade-up font-serif text-[clamp(34px,6vw,76px)] font-semibold uppercase leading-[0.98] tracking-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
            style={{ animationDelay: "90ms" }}
          >
            {slide.title}
          </h1>
          <a
            href={SLIDE_META[active].href}
            className="mt-7 inline-flex animate-fade-up items-center gap-2 border-b border-white/55 pb-1.5 font-body text-[12.5px] font-semibold uppercase tracking-wide2 text-white transition-colors hover:border-white"
            style={{ animationDelay: "180ms" }}
          >
            {slide.cta}
            <ArrowRight size={15} strokeWidth={2} />
          </a>
        </div>
      </div>

      <button
        type="button"
        aria-label="←"
        onClick={() => go(active - 1)}
        className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 group-hover:opacity-100 lg:grid"
      >
        <ChevronLeft size={20} strokeWidth={1.6} />
      </button>
      <button
        type="button"
        aria-label="→"
        onClick={() => go(active + 1)}
        className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-white/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 group-hover:opacity-100 lg:grid"
      >
        <ChevronRight size={20} strokeWidth={1.6} />
      </button>

      <div className="absolute bottom-7 right-6 z-20 flex items-center gap-2.5 lg:right-12">
        {SLIDE_META.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}`}
            aria-current={i === active}
            onClick={() => go(i)}
            className={`h-[3px] transition-all duration-300 ${i === active ? "w-9 bg-white" : "w-5 bg-white/45 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </section>
  );
}
