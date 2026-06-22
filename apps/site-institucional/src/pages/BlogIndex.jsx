import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { ARTICLES } from "../data/blog";
import { useT } from "../i18n";

export default function BlogIndex() {
  const t = useT();
  const bp = t.blogPage;

  return (
    <div className="bg-cream bg-grain">
      <div className="border-b border-line bg-surface">
        <nav className="container-page flex items-center gap-2 py-4 font-body text-[12.5px] text-stone">
          <Link to="/" className="hover:text-wine">{t.pdp.home}</Link>
          <ChevronRight size={13} />
          <span className="text-ink">{t.nav.blog}</span>
        </nav>
      </div>

      <div className="container-page py-16 lg:py-20">
        <SectionHeading script={t.blog.script} title={bp.title} intro={bp.intro} />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((art, i) => (
            <Reveal key={art.slug} delay={(i % 3) * 90}>
              <Link
                to={`/blog/${art.slug}`}
                className="group flex h-full flex-col border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="overflow-hidden">
                  <img
                    src={art.cover}
                    alt={art.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-image group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[11px] font-semibold uppercase tracking-label text-wine">{art.tag}</span>
                    <span className="font-body text-[11px] uppercase tracking-wide2 text-stone">
                      {art.readMin} {bp.minRead}
                    </span>
                  </div>
                  <h2 className="mt-4 font-serif text-xl font-semibold leading-snug text-ink">{art.title}</h2>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-soft">{art.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink transition-colors group-hover:text-wine">
                    {bp.readMore}
                    <ArrowUpRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
