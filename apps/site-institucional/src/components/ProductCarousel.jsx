import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

/**
 * Carrossel de produtos com scroll-snap, barra de progresso e setas —
 * inspirado no slider "Mais Vendidos" da referência. Mostruário em destaque.
 */
export default function ProductCarousel({ products }) {
  const trackRef = useRef(null);
  const [thumb, setThumb] = useState({ w: 30, left: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = el.clientWidth / el.scrollWidth;
    const w = Math.min(ratio * 100, 100);
    const left = max > 0 ? (el.scrollLeft / max) * (100 - w) : 0;
    setThumb({ w, left });
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  // Reinicia ao trocar de aba/segmento
  useEffect(() => {
    const el = trackRef.current;
    if (el) el.scrollLeft = 0;
    update();
  }, [products, update]);

  const scrollByCards = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-slide]");
    const amount = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={trackRef}
        onScroll={update}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1"
      >
        {products.map((p, i) => (
          <li
            data-slide
            key={i}
            className="w-[80%] shrink-0 snap-start sm:w-[47%] lg:w-[calc(25%-15px)]"
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      {/* Controles: barra de progresso + setas */}
      <div className="mt-9 flex items-center gap-6">
        <div className="relative h-[2px] flex-1 bg-line">
          <span
            className="absolute top-0 h-full bg-wine transition-all duration-200"
            style={{ width: `${thumb.w}%`, left: `${thumb.left}%` }}
          />
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByCards(-1)}
            disabled={atStart}
            className="grid h-11 w-11 place-items-center border border-line text-ink transition-all hover:border-wine hover:text-wine disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ArrowLeft size={17} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label="Próximo"
            onClick={() => scrollByCards(1)}
            disabled={atEnd}
            className="grid h-11 w-11 place-items-center border border-line text-ink transition-all hover:border-wine hover:text-wine disabled:cursor-not-allowed disabled:opacity-25"
          >
            <ArrowRight size={17} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}
