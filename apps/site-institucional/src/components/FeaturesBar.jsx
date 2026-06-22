import { Ruler, Sparkles, MessagesSquare, Globe2, Leaf } from "lucide-react";
import Reveal from "./Reveal";
import { useT } from "../i18n";

const ICONS = [Ruler, Sparkles, MessagesSquare, Globe2, Leaf];

export default function FeaturesBar() {
  const t = useT();
  return (
    <section className="border-y border-line bg-surface">
      <div className="container-page grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {t.features.map((label, i) => {
          const Icon = ICONS[i];
          return (
            <Reveal
              key={label}
              delay={i * 80}
              className={`flex flex-col items-center gap-3 px-5 py-8 text-center ${
                i < t.features.length - 1 ? "lg:border-r border-line" : ""
              } ${i % 2 === 0 ? "border-r md:border-r-0 lg:border-r" : ""}`}
            >
              <Icon size={26} strokeWidth={1.4} className="text-wine" />
              <span className="font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink">{label}</span>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
