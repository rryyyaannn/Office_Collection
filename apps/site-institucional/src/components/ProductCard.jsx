import { useState } from "react";
import { Link } from "react-router-dom";
import MediaFrame from "./MediaFrame";
import { useT } from "../i18n";

/**
 * Card de produto: imagem (link p/ PDP) com zoom, badge, título, preço +
 * parcelamento, swatches de cor e CTA "Escolher opções".
 */
export default function ProductCard({ product }) {
  const t = useT();
  const { title, price, installment, badge, tone, colors = [], image = null, id } = product;
  const [selected, setSelected] = useState(0);

  const isReady = badge === "Pronta Entrega";
  const badgeLabel = isReady ? t.card.ready : t.card.mtm;
  const to = `/produto/${id}`;

  return (
    <article className="group flex h-full flex-col border border-line bg-surface transition-shadow duration-300 hover:shadow-card">
      <div className="relative overflow-hidden">
        {badge && (
          <span
            className={`absolute left-3 top-3 z-10 px-2.5 py-1 font-body text-[10.5px] font-semibold uppercase tracking-wide2 text-white ${
              isReady ? "bg-navy/90" : "bg-wine/90"
            }`}
          >
            {badgeLabel}
          </span>
        )}
        <Link to={to} aria-label={title}>
          <MediaFrame
            media={{ type: "image", src: image, path: "src/data/catalog.js → image" }}
            tone={tone}
            ratio="aspect-[3/4]"
            alt={title}
            zoom
            hint={false}
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            to={to}
            className="pointer-events-auto block w-full bg-graphite/95 py-3 text-center font-body text-[12px] font-semibold uppercase tracking-wide2 text-white transition-colors hover:bg-wine"
          >
            {t.card.choose}
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-6 pt-4 text-center">
        <Link to={to} className="font-serif text-xl font-semibold leading-snug text-ink transition-colors hover:text-wine">
          {title}
        </Link>
        <p className="mt-2 font-body text-[15px] font-medium text-ink">{price}</p>
        {installment && <p className="mt-1 font-body text-[12.5px] text-stone">{installment}</p>}

        {colors.length > 0 && (
          <div className="mt-auto pt-5">
            <p className="mb-2 font-body text-[11px] uppercase tracking-wide2 text-stone">
              {colors.length} {colors.length > 1 ? t.card.colors : t.card.color}
            </p>
            <div className="flex items-center justify-center gap-2">
              {colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${t.card.color} ${i + 1}`}
                  aria-pressed={selected === i}
                  onClick={() => setSelected(i)}
                  style={{ backgroundColor: c }}
                  className={`h-5 w-5 rounded-full border transition-all ${
                    selected === i ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-surface" : "border-line hover:border-ink"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
