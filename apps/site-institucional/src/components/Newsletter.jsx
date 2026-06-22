import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import { useT } from "../i18n";

export default function Newsletter() {
  const t = useT();
  const n = t.news;
  const [sent, setSent] = useState(false);

  return (
    <section className="border-t border-line bg-wine-tint/60">
      <div className="container-page py-16 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="font-script text-4xl md:text-5xl leading-none text-wine">{n.script}</span>
            <h2 className="mt-2 font-body text-[clamp(20px,2.2vw,28px)] font-bold uppercase tracking-wide2 text-ink">{n.title}</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">{n.text}</p>
          </Reveal>

          <Reveal delay={120}>
            <form
              className="lg:ml-auto lg:max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              {sent ? (
                <p className="flex items-center gap-2 border-b border-wine pb-3 font-body text-[15px] text-wine">
                  <Check size={18} strokeWidth={2} />
                  {n.confirm}
                </p>
              ) : (
                <div className="flex items-center border-b border-ink/30 transition-colors focus-within:border-wine">
                  <input
                    type="email"
                    required
                    placeholder={n.placeholder}
                    aria-label="E-mail"
                    className="flex-1 border-0 bg-transparent py-3 font-body text-[15px] text-ink outline-none placeholder:text-stone"
                  />
                  <button type="submit" aria-label="OK" className="px-2 text-ink transition-colors hover:text-wine">
                    <ArrowRight size={20} strokeWidth={1.8} />
                  </button>
                </div>
              )}
              <p className="mt-3 font-body text-[12px] text-stone">{n.privacy}</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
