import { Award, Layers, Globe2, Gem, PenTool, MessagesSquare, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import Reveal from "./Reveal";
import { useT } from "../i18n";

const ICONS = [Award, PenTool, Layers, Gem, Globe2, MessagesSquare];

export default function Diferenciais() {
  const t = useT();
  const d = t.dif;
  return (
    <section id="diferenciais" className="bg-surface py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading script={d.script} title={d.title} intro={d.intro} />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {d.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={i} delay={i * 70} className="group bg-surface p-8 transition-colors duration-300 hover:bg-cream">
                <Icon size={28} strokeWidth={1.3} className="text-wine transition-transform duration-300 group-hover:-translate-y-0.5" />
                <h3 className="mt-6 font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{item.text}</p>
              </Reveal>
            );
          })}
        </div>

        {/* CTA de orçamento */}
        <Reveal
          id="contato"
          className="mt-12 flex scroll-mt-28 flex-col items-center gap-5 border border-line bg-cream px-8 py-12 text-center"
        >
          <p className="font-script text-4xl leading-none text-wine md:text-5xl">{d.ctaScript}</p>
          <p className="max-w-xl text-[15.5px] leading-relaxed text-ink-soft">{d.ctaText}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Button as="a" href="https://wa.me/message/X5MTMAWYZESNO1" target="_blank" rel="noopener noreferrer" variant="primary">
              {d.quote}
              <ArrowRight size={16} strokeWidth={2} />
            </Button>
            <Button as="a" href="#estudio" variant="outline">
              {d.studio}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
