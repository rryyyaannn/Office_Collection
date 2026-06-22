import Reveal from "./Reveal";

/**
 * Cabeçalho de seção no padrão da marca:
 *   palavra/expressão em script bordô  ›  título em caixa-alta sans bold
 *   ›  parágrafo de apoio opcional.
 *
 * @param {string} script   texto cursivo (ex.: "Nossa História")
 * @param {string} title    título em caixa-alta
 * @param {string} [intro]  parágrafo de apoio
 * @param {"center"|"left"} [align="center"]
 * @param {"dark"|"light"} [tone="dark"]
 */
export default function SectionHeading({
  script,
  title,
  intro,
  align = "center",
  tone = "dark",
  className = "",
}) {
  const isLight = tone === "light";
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <Reveal className={`flex flex-col ${alignment} ${className}`}>
      {script && (
        <span className="font-script text-wine text-4xl md:text-5xl leading-none">
          {script}
        </span>
      )}
      {title && (
        <h2
          className={`mt-2 font-body font-bold uppercase tracking-wide2 text-[clamp(20px,2.4vw,30px)] leading-tight ${
            isLight ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
      )}
      <span
        className={`mt-5 h-px w-14 ${isLight ? "bg-white/40" : "bg-wine"}`}
        aria-hidden="true"
      />
      {intro && (
        <p
          className={`mt-6 max-w-2xl text-balance text-[15.5px] leading-relaxed ${
            isLight ? "text-footer-text" : "text-ink-soft"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
