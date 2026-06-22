import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { ARTICLES, getArticle } from "../data/blog";
import { useT } from "../i18n";

export default function Article() {
  const { slug } = useParams();
  const t = useT();
  const bp = t.blogPage;
  const art = getArticle(slug);

  if (!art) return <Navigate to="/blog" replace />;

  const related = ARTICLES.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="bg-cream">
      {/* Breadcrumb */}
      <div className="border-b border-line bg-surface">
        <nav className="container-page flex items-center gap-2 py-4 font-body text-[12.5px] text-stone">
          <Link to="/" className="hover:text-wine">{t.pdp.home}</Link>
          <ChevronRight size={13} />
          <Link to="/blog" className="hover:text-wine">{t.nav.blog}</Link>
          <ChevronRight size={13} />
          <span className="truncate text-ink">{art.title}</span>
        </nav>
      </div>

      {/* Cabeçalho */}
      <article>
        <header className="container-content pt-12 text-center lg:pt-16">
          <span className="font-body text-[11px] font-semibold uppercase tracking-label text-wine">{art.tag}</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-[clamp(30px,4.5vw,54px)] font-semibold leading-[1.05] text-ink text-balance">
            {art.title}
          </h1>
          <p className="mt-5 font-body text-[12.5px] uppercase tracking-wide2 text-stone">
            {art.date} · {art.readMin} {bp.minRead}
          </p>
        </header>

        <div className="container-content mt-10">
          <img src={art.cover} alt={art.title} className="aspect-[16/9] w-full border border-line object-cover" />
        </div>

        {/* Corpo */}
        <div className="container-content py-12 lg:py-16">
          <div className="mx-auto max-w-2xl space-y-6">
            <p className="font-serif text-xl italic leading-relaxed text-ink">{art.excerpt}</p>
            {art.body.map((block, i) =>
              block.h ? (
                <h2 key={i} className="pt-2 font-serif text-2xl font-semibold text-ink">{block.h}</h2>
              ) : (
                <p key={i} className="text-[16px] leading-[1.75] text-ink-soft">{block.p}</p>
              )
            )}
          </div>

          <div className="mx-auto mt-12 max-w-2xl border-t border-line pt-8">
            <Link to="/blog" className="inline-flex items-center gap-2 font-body text-[12.5px] font-semibold uppercase tracking-wide2 text-ink hover:text-wine">
              <ArrowLeft size={15} /> {bp.back}
            </Link>
          </div>
        </div>
      </article>

      {/* Relacionados */}
      <section className="border-t border-line bg-surface py-16">
        <div className="container-page">
          <h2 className="mb-8 font-body text-[clamp(18px,2vw,24px)] font-bold uppercase tracking-wide2 text-ink">{bp.related}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((a) => (
              <Reveal key={a.slug}>
                <Link to={`/blog/${a.slug}`} className="group flex h-full flex-col border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <div className="overflow-hidden">
                    <img src={a.cover} alt={a.title} className="aspect-[4/3] w-full object-cover transition-transform duration-image group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="font-body text-[11px] font-semibold uppercase tracking-label text-wine">{a.tag}</span>
                    <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-ink">{a.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink transition-colors group-hover:text-wine">
                      {bp.readMore}
                      <ArrowUpRight size={14} strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
