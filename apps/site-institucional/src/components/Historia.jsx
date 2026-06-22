import SectionHeading from "./SectionHeading";
import MediaFrame from "./MediaFrame";
import Reveal from "./Reveal";
import { MEDIA } from "../media";
import { useT } from "../i18n";

export default function Historia() {
  const t = useT();
  const h = t.historia;
  return (
    <section id="historia" className="scroll-mt-28 bg-cream bg-grain py-20 lg:py-28">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Foto da premiação */}
        <Reveal className="relative">
          <MediaFrame media={MEDIA.premiacao} tone="wine" ratio="aspect-[4/5]" alt={h.badge} />
          <div className="absolute -bottom-6 -right-4 hidden border border-line bg-surface p-6 text-center shadow-card sm:block">
            <p className="font-serif text-4xl font-semibold text-wine">15</p>
            <p className="mt-1 max-w-[120px] font-body text-[11px] uppercase leading-snug tracking-wide2 text-stone">{h.badge}</p>
          </div>
        </Reveal>

        {/* Texto institucional + CEO */}
        <div>
          <SectionHeading align="left" script={h.script} title={h.title} />

          <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-ink-soft">
            {h.p.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <figure className="mt-8 border-l-2 border-wine pl-6">
            <blockquote className="font-serif text-xl italic leading-snug text-ink">“{h.quote}”</blockquote>
            <figcaption className="mt-3 font-body text-[12.5px] uppercase tracking-wide2 text-stone">{h.ceo}</figcaption>
          </figure>

          <dl className="mt-9 grid grid-cols-2 gap-4 border-t border-line pt-7">
            {h.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-serif text-2xl font-semibold text-wine sm:text-3xl">{s.value}</dt>
                <dd className="mt-1 font-body text-[11px] uppercase leading-snug tracking-wide2 text-stone">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
