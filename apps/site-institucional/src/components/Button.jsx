/**
 * Botão da Office Collection.
 *  - primary : bordô preenchido (CTA principal)
 *  - dark    : grafite preenchido
 *  - outline : contorno fino "VER MAIS" (padrão do site)
 *  - ghost   : texto + seta, sem caixa
 * Tipografia em caixa-alta com tracking, cantos retos (estética editorial premium).
 */
const base =
  "inline-flex items-center justify-center gap-2 font-body font-semibold uppercase " +
  "text-[12.5px] tracking-wide2 transition-all duration-300 cursor-pointer select-none " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-wine text-white px-7 py-3.5 rounded-btn hover:bg-wine-deep " +
    "shadow-[0_12px_24px_-16px_rgba(112,31,32,0.9)] hover:shadow-[0_16px_30px_-14px_rgba(112,31,32,0.9)]",
  dark: "bg-graphite text-white px-7 py-3.5 rounded-btn hover:bg-black",
  outline:
    "border border-ink/70 text-ink px-7 py-3 rounded-none hover:bg-graphite hover:text-white hover:border-ink",
  "outline-light":
    "border border-white/50 text-white px-7 py-3 rounded-none hover:bg-white hover:text-ink",
  ghost:
    "text-wine px-0 py-1 rounded-none border-b border-transparent hover:border-wine",
};

export default function Button({
  variant = "primary",
  as: Tag = "button",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
