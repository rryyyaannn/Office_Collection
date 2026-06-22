import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { SEGMENTS } from "../data/catalog";
import { MEDIA } from "../media";
import { useT } from "../i18n";

export default function Segments() {
  const t = useT();
  return (
    <section id="segmentos" className="scroll-mt-28 bg-cream py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading script={t.segHead.script} title={t.segHead.title} />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SEGMENTS.map((seg, i) => {
            const Icon = seg.icon;
            const s = t.seg[seg.id];
            return (
              <Reveal key={seg.id} delay={i * 90}>
                <Link
                  id={seg.id}
                  to={`/segmento/${seg.id}`}
                  className="group block scroll-mt-40 border border-line bg-surface transition-shadow duration-300 hover:shadow-lift"
                >
                  <div className="relative overflow-hidden">
                    <MediaFrame
                      media={MEDIA.segments[seg.id]}
                      tone={seg.tone}
                      ratio="aspect-[4/5]"
                      icon={Icon}
                      label={s.tagline}
                      zoom
                      alt={s.name}
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/5"
                      style={{ background: "linear-gradient(to top, rgba(28,26,26,0.55), transparent)" }}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-semibold text-ink">{s.name}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft line-clamp-2">{s.blurb}</p>
                    <span className="mt-4 inline-flex items-center gap-2 font-body text-[12px] font-semibold uppercase tracking-wide2 text-wine">
                      {t.seeMore}
                      <ArrowRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
