import { Link } from "react-router-dom";

/**
 * Logo Office Collection.
 * Composição: "OFFICE" em serif caixa-alta + "Collection" em script sobreposto
 * + microtexto "MODA PROFISSIONAL". Reproduz a assinatura da marca.
 *
 * @param {"dark"|"light"} tone  dark = sobre fundo claro · light = sobre fundo escuro
 * @param {"sm"|"md"|"lg"} size
 */
export default function Logo({ tone = "dark", size = "md", className = "" }) {
  const sizes = {
    sm: { office: "text-xl", script: "text-2xl", micro: "text-[7px]" },
    md: { office: "text-[28px]", script: "text-4xl", micro: "text-[8px]" },
    lg: { office: "text-5xl", script: "text-6xl", micro: "text-[10px]" },
  };
  const s = sizes[size];

  const officeColor = tone === "light" ? "text-white" : "text-ink";
  const microColor = tone === "light" ? "text-footer-text" : "text-stone";

  return (
    <Link
      to="/"
      aria-label="Office Collection — página inicial"
      className={`group inline-flex flex-col items-center leading-none ${className}`}
    >
      <span className="relative inline-flex items-end">
        <span
          className={`font-serif font-semibold uppercase tracking-[0.18em] ${s.office} ${officeColor}`}
        >
          Office
        </span>
        <span
          className={`font-script text-wine ${s.script} -ml-1 -mb-1.5 leading-none transition-transform duration-300 group-hover:-translate-y-0.5`}
        >
          Collection
        </span>
      </span>
      <span
        className={`mt-1 font-body font-medium uppercase tracking-label ${s.micro} ${microColor}`}
      >
        Moda Profissional
      </span>
    </Link>
  );
}
