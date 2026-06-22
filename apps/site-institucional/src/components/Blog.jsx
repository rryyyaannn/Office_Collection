import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import Reveal from "./Reveal";
import { useT } from "../i18n";
import { ARTICLES } from "../data/blog";

export default function Blog() {
  const t = useT();
  return (
    <section id="blog" className="scroll-mt-28 bg-cream bg-grain py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading script={t.blog.script} title={t.blog.title} intro={t.blog.intro} />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {t.blog.posts.map((post, i) => (
            <Reveal key={i} delay={i * 90}>
              <Link
                to={`/blog/${ARTICLES[i].slug}`}
                className="group flex h-full flex-col border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="font-body text-[11px] font-semibold uppercase tracking-label text-wine">{post.tag}</span>
                  <span className="font-body text-[11px] uppercase tracking-wide2 text-stone">{post.date}</span>
                </div>
                <h3 className="mt-6 font-serif text-2xl font-semibold leading-snug text-ink">{post.title}</h3>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-soft">{post.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink transition-colors group-hover:text-wine">
                  {t.blog.read}
                  <ArrowUpRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button as={Link} to="/blog" variant="outline">
            {t.blog.visit}
          </Button>
        </div>
      </div>
    </section>
  );
}
