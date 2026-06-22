import { useRef, useState } from "react";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import Reveal from "./Reveal";
import { MEDIA } from "../media";
import { useT } from "../i18n";

export default function EstudioCriacao() {
  const t = useT();
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <section id="estudio" className="scroll-mt-28 bg-cream bg-grain py-20 lg:py-28">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Vídeo explicativo oficial */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="group relative aspect-video overflow-hidden border border-line bg-graphite shadow-card">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={MEDIA.estudio.poster}
            >
              <source src={MEDIA.estudio.src} type="video/mp4" />
            </video>
            <button
              type="button"
              onClick={toggleSound}
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-graphite/70 px-3.5 py-2 font-body text-[11px] font-semibold uppercase tracking-wide2 text-white backdrop-blur-sm transition-colors hover:bg-wine"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {muted ? t.estudio.soundOff : t.estudio.soundOn}
            </button>
          </div>
        </Reveal>

        {/* Processo em 5 etapas */}
        <div className="order-1 lg:order-2">
          <SectionHeading align="left" script={t.estudio.script} title={t.estudio.title} intro={t.estudio.intro} />

          <ol className="mt-9 space-y-5">
            {t.estudio.steps.map((s, i) => (
              <Reveal as="li" key={i} delay={i * 70} className="flex gap-5 border-b border-line/70 pb-5 last:border-0">
                <span className="font-serif text-2xl font-semibold leading-none text-wine">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">{s.t}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Button as="a" href="#contato" variant="primary" className="mt-9">
            {t.estudio.cta}
            <ArrowRight size={16} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </section>
  );
}
