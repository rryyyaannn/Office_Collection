import { useT } from "../i18n";

/** Faixa fina superior em bordô com mensagens-chave (marquee infinito). */
export default function AnnouncementBar() {
  const t = useT();
  const loop = [...t.announce, ...t.announce];
  return (
    <div className="bg-wine text-white">
      <div className="flex overflow-hidden">
        <div className="marquee-track flex w-max shrink-0 animate-marquee items-center py-2">
          {loop.map((item, i) => (
            <span key={i} className="flex items-center font-body text-[11px] uppercase tracking-wide2 font-medium">
              {item}
              <span className="mx-6 text-white/45" aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
