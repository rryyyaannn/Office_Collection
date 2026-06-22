import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import Tabs from "./Tabs";
import ProductCarousel from "./ProductCarousel";
import Button from "./Button";
import Reveal from "./Reveal";
import { SEGMENTS, PRODUCTS } from "../data/catalog";
import { useT } from "../i18n";

export default function Catalog() {
  const t = useT();
  const tabs = SEGMENTS.map((s) => ({ id: s.id, label: t.seg[s.id].name }));

  return (
    <section id="catalogo" className="scroll-mt-32 bg-surface py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading script={t.catalog.script} title={t.catalog.title} />

        <div className="mt-10">
          <Tabs tabs={tabs}>
            {(active) => (
              <Reveal key={active}>
                <ProductCarousel products={PRODUCTS[active] ?? []} />
              </Reveal>
            )}
          </Tabs>
        </div>

        <div className="mt-12 flex justify-center">
          <Button as={Link} to="/produtos" variant="outline">
            {t.catalog.full}
            <ArrowRight size={15} strokeWidth={2} />
          </Button>
        </div>
      </div>
    </section>
  );
}
