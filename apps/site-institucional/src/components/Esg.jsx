import { Gauge, Sun, Recycle, Package, Repeat, ShieldCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { useT } from "../i18n";

const ICONS = [Gauge, Sun, Recycle, Package, Repeat, ShieldCheck];

export default function Esg() {
  const t = useT();
  return (
    <section id="esg" className="relative scroll-mt-28 overflow-hidden bg-footer-bg py-20 text-white lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 80% 0%, rgba(45,47,146,0.35), transparent 70%), radial-gradient(45% 45% at 10% 100%, rgba(112,31,32,0.45), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-page relative">
        <SectionHeading tone="light" script={t.esg.script} title={t.esg.title} intro={t.esg.intro} />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border border-footer-line bg-footer-line sm:grid-cols-2 lg:grid-cols-3">
          {t.esg.pillars.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={i} delay={i * 70} className="group bg-footer-bg p-8 transition-colors duration-300 hover:bg-[#262323]">
                <div className="flex items-center justify-between">
                  <Icon size={26} strokeWidth={1.4} className="text-[#7FB069] transition-transform duration-300 group-hover:-translate-y-0.5" />
                  <span className="font-serif text-3xl font-semibold text-white/90">{p.stat}</span>
                </div>
                <h3 className="mt-6 font-body text-[13px] font-semibold uppercase tracking-wide2 text-white">{p.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-footer-text">{p.text}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
