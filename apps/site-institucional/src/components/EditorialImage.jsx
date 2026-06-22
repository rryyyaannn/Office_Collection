/**
 * Placeholder editorial em duotone na paleta da marca (gradiente + textura +
 * monograma). Usado pelo MediaFrame quando ainda não há mídia real plugada.
 *
 * @param {"wine"|"navy"|"ink"|"sand"|"stone"} [tone="sand"]
 * @param {boolean} [fill=false]   preenche o pai (absolute inset-0) em vez de usar ratio
 * @param {string}  [ratio]        proporção quando não é fill
 * @param {string}  [label]        rótulo discreto sobreposto
 * @param {React.ComponentType} [icon]  ícone lucide opcional
 * @param {boolean} [zoom=false]   zoom no hover do grupo pai (.group)
 * @param {boolean} [motion=false] aplica Ken Burns lento (simula vídeo vivo)
 */
const TONES = {
  wine: {
    bg: "linear-gradient(150deg,#8E3A3B 0%,#701F20 48%,#3F0F10 100%)",
    glow: "radial-gradient(60% 50% at 30% 20%, rgba(255,255,255,0.22), transparent 70%)",
    fg: "text-white/85",
    mono: "text-white/10",
  },
  navy: {
    bg: "linear-gradient(150deg,#4A4CB0 0%,#2D2F92 50%,#191A55 100%)",
    glow: "radial-gradient(60% 50% at 30% 20%, rgba(255,255,255,0.22), transparent 70%)",
    fg: "text-white/85",
    mono: "text-white/10",
  },
  ink: {
    bg: "linear-gradient(150deg,#4A4644 0%,#262323 55%,#100F0F 100%)",
    glow: "radial-gradient(60% 50% at 30% 20%, rgba(255,255,255,0.16), transparent 70%)",
    fg: "text-white/80",
    mono: "text-white/[0.08]",
  },
  sand: {
    bg: "linear-gradient(150deg,#F2ECE2 0%,#E4DACB 55%,#CDBFAB 100%)",
    glow: "radial-gradient(60% 50% at 28% 18%, rgba(255,255,255,0.6), transparent 70%)",
    fg: "text-ink/70",
    mono: "text-wine/10",
  },
  stone: {
    bg: "linear-gradient(150deg,#B9B4AD 0%,#959595 55%,#6E6C6A 100%)",
    glow: "radial-gradient(60% 50% at 30% 20%, rgba(255,255,255,0.3), transparent 70%)",
    fg: "text-white/85",
    mono: "text-white/10",
  },
};

export default function EditorialImage({
  tone = "sand",
  fill = false,
  ratio = "aspect-[3/4]",
  label,
  icon: Icon,
  zoom = false,
  motion = false,
  className = "",
}) {
  const t = TONES[tone] ?? TONES.sand;
  const shape = fill ? "absolute inset-0" : `relative ${ratio}`;

  return (
    <div className={`overflow-hidden ${shape} ${className}`}>
      <div
        role="img"
        aria-label={label || "Imagem Office Collection"}
        className={`relative h-full w-full transition-transform duration-image ${
          zoom ? "group-hover:scale-105" : ""
        } ${motion ? "animate-kenburns" : ""}`}
        style={{ backgroundImage: t.bg }}
      >
        <div className="absolute inset-0" style={{ backgroundImage: t.glow }} aria-hidden="true" />
        <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-grain" aria-hidden="true" />
        <span
          className={`pointer-events-none absolute -bottom-6 -right-3 font-serif font-semibold leading-none ${t.mono} text-[180px] select-none`}
          aria-hidden="true"
        >
          OC
        </span>
        {(Icon || label) && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${t.fg}`}>
            {Icon && <Icon size={30} strokeWidth={1.25} />}
            {label && (
              <span className="font-body uppercase tracking-label text-[11px] font-semibold">
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
