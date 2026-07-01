import { ArrowRight, Building2, GraduationCap, ShieldCheck } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Button from "../components/Button";
import Reveal from "../components/Reveal";

// Portal dos colaboradores (Einstein). No deploy unificado ele vive em /portal (mesma origem).
// Em dev, roda no Vite do portal (porta 5180, base /portal/).
const PORTAL_COLAB_URL = import.meta.env.DEV ? "http://localhost:5180/portal/" : "/portal";

const PORTAIS = [
  {
    cliente: "Hospital Albert Einstein",
    area: "Colaboradores",
    Icon: Building2,
    desc: "Uniformes corporativos. O colaborador ativa a conta pelo CPF, escolhe o kit do seu cargo e recebe em casa.",
    href: PORTAL_COLAB_URL,
    ativo: true,
  },
  {
    cliente: "Hospital Albert Einstein",
    area: "Alunos",
    Icon: GraduationCap,
    desc: "Uniformes para alunos, com compra online. Em desenvolvimento.",
    href: null,
    ativo: false,
  },
];

export default function Acesso() {
  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading
        script="Acesso"
        title="Portais corporativos"
        intro="Selecione a sua área. Cada cliente tem um portal próprio e seguro."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {PORTAIS.map((p) => (
          <Reveal key={p.cliente + p.area}>
            <div
              className={`flex h-full flex-col border border-line bg-surface p-7 shadow-card transition-all duration-300 ${
                p.ativo ? "hover:-translate-y-1 hover:shadow-lift" : "opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-wine/10 text-wine">
                  <p.Icon size={20} strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide2 text-stone">{p.cliente}</p>
                  <h3 className="font-body text-lg font-bold uppercase tracking-wide2 text-ink">{p.area}</h3>
                </div>
              </div>

              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink-soft">{p.desc}</p>

              <div className="mt-6">
                {p.ativo ? (
                  <Button as="a" href={p.href} target="_blank" rel="noopener noreferrer" variant="primary">
                    Entrar <ArrowRight size={15} strokeWidth={2} />
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-btn border border-line px-5 py-3 text-[12px] font-semibold uppercase tracking-wide2 text-stone">
                    Em breve
                  </span>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mx-auto mt-10 flex max-w-4xl items-center justify-center gap-2 text-center text-[12.5px] text-stone">
        <ShieldCheck size={15} strokeWidth={1.7} />
        Acesso restrito aos cadastrados. Colaboradores do Einstein: use o CPF no primeiro acesso.
      </p>
    </section>
  );
}
