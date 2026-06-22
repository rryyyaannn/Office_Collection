import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import MediaFrame from "../components/MediaFrame";
import ProductCarousel from "../components/ProductCarousel";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import { SEGMENTS, PRODUCTS } from "../data/catalog";
import { MEDIA } from "../media";
import { useT } from "../i18n";

export default function SegmentPage() {
  const { id } = useParams();
  const t = useT();
  const seg = SEGMENTS.find((s) => s.id === id);

  if (!seg) return <Navigate to="/" replace />;

  const s = t.seg[id];
  const sp = t.segPage;
  const Icon = seg.icon;
  const products = PRODUCTS[id] ?? [];
  const benefits = sp.benefits[id] ?? [];

  return (
    <div className="bg-cream">
      {/* Breadcrumb */}
      <div className="border-b border-line bg-surface">
        <nav className="container-page flex items-center gap-2 py-4 font-body text-[12.5px] text-stone">
          <Link to="/" className="hover:text-wine">{t.pdp.home}</Link>
          <ChevronRight size={13} />
          <span className="text-ink">{s.name}</span>
        </nav>
      </div>

      {/* Hero do segmento */}
      <section className="container-page grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <Reveal>
          <MediaFrame media={MEDIA.segments[id]} tone={seg.tone} ratio="aspect-[4/5]" alt={s.name} />
        </Reveal>
        <Reveal delay={120}>
          <span className="inline-flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-label text-wine">
            <Icon size={16} strokeWidth={1.6} /> {sp.collection}
          </span>
          <h1 className="mt-3 font-serif text-[clamp(34px,5vw,64px)] font-semibold uppercase leading-[0.98] text-ink">
            {s.name}
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-soft">{s.blurb}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button as="a" href="#produtos-segmento" variant="primary">
              {sp.viewAll}
              <ArrowRight size={16} strokeWidth={2} />
            </Button>
            <Button as="a" href="https://wa.me/message/X5MTMAWYZESNO1" target="_blank" rel="noopener noreferrer" variant="outline">
              {sp.cta}
              <MessageCircle size={16} strokeWidth={1.8} />
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Benefícios do segmento */}
      <section className="border-y border-line bg-surface">
        <div className="container-page grid grid-cols-1 md:grid-cols-3">
          {benefits.map((b, i) => (
            <Reveal
              key={i}
              delay={i * 80}
              className={`px-7 py-9 ${i < benefits.length - 1 ? "md:border-r border-line" : ""}`}
            >
              <Sparkles size={24} strokeWidth={1.4} className="text-wine" />
              <h3 className="mt-5 font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">{b.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Banner em vídeo (ambiente da marca) */}
      <section className="relative h-[44vh] min-h-[320px] w-full overflow-hidden bg-graphite">
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" poster={MEDIA.estudio.poster}>
          <source src={MEDIA.estudio.src} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[5]" style={{ background: "linear-gradient(90deg, rgba(28,26,26,0.7) 0%, rgba(28,26,26,0.2) 70%, transparent 100%)" }} />
        <div className="container-page relative z-10 flex h-full items-center">
          <Reveal className="max-w-md text-white">
            <span className="font-script text-4xl leading-none md:text-5xl">{t.estudio.script}</span>
            <p className="mt-3 font-body text-[clamp(16px,2vw,24px)] font-bold uppercase leading-tight tracking-wide2">
              {t.estudio.title}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Produtos do segmento */}
      <section id="produtos-segmento" className="scroll-mt-28 bg-cream py-20 lg:py-24">
        <div className="container-page">
          <h2 className="mb-10 text-center font-body text-[clamp(20px,2.4vw,30px)] font-bold uppercase tracking-wide2 text-ink">
            {sp.products}
          </h2>
          <ProductCarousel products={products} />
        </div>
      </section>
    </div>
  );
}
