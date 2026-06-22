import Reveal from "./Reveal";
import { useT } from "../i18n";

const LOGOS = [
  { src: "/media/logos/einstein.png", alt: "Hospital Israelita Albert Einstein" },
  { src: "/media/logos/sirio.png", alt: "Hospital Sírio-Libanês" },
  { src: "/media/logos/dasa.jpg", alt: "Dasa" },
  { src: "/media/logos/fleury.jpg", alt: "Grupo Fleury" },
  { src: "/media/logos/unimed.jpg", alt: "Unimed" },
  { src: "/media/logos/atlantica.png", alt: "Atlântica Hotels" },
  { src: "/media/logos/accor.png", alt: "Accor Hotels" },
  { src: "/media/logos/sheraton.png", alt: "Sheraton Hotels & Resorts" },
  { src: "/media/logos/hilton.jpg", alt: "Hilton Hotels & Resorts" },
  { src: "/media/logos/gjp.jpg", alt: "GJP Hotels & Resorts" },
  { src: "/media/logos/bhg.jpg", alt: "Brazil Hospitality Group" },
  { src: "/media/logos/fgv.png", alt: "Fundação Getúlio Vargas" },
  { src: "/media/logos/ancar.jpg", alt: "Ancar Ivanhoe" },
];

export default function Clientes() {
  const t = useT();
  // Duplicado para o loop contínuo (translateX -50%)
  const loop = [...LOGOS, ...LOGOS];

  return (
    <section className="border-y border-line bg-surface py-16 lg:py-20">
      <div className="container-page">
        <Reveal className="text-center">
          <span className="font-script text-3xl leading-none text-wine md:text-4xl">{t.clientes.heading}</span>
          <p className="mt-2 font-body text-[11px] uppercase tracking-label text-stone">{t.clientes.sub}</p>
        </Reveal>
      </div>

      {/* Carrossel automático (não interativo) */}
      <div className="relative mt-12 select-none">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-surface to-transparent" />

        <div className="flex overflow-hidden">
          <div className="marquee-track flex w-max shrink-0 animate-marquee-slow items-center gap-5">
            {loop.map((logo, i) => (
              <div
                key={i}
                title={logo.alt}
                className="grid h-32 w-[240px] shrink-0 place-items-center border border-line bg-surface px-8"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  draggable="false"
                  className="max-h-16 w-auto object-contain opacity-70 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
