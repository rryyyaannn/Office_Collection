import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import { ALL_PRODUCTS, SEGMENTS } from "../data/catalog";
import { useT } from "../i18n";

const norm = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export default function CatalogPage() {
  const t = useT();
  const cp = t.catalogPage;

  const [query, setQuery] = useState("");
  const [seg, setSeg] = useState("all");
  const [avail, setAvail] = useState("all"); // all | ready | mtm
  const [sort, setSort] = useState("relevance");

  const segTabs = [{ id: "all", label: cp.all }, ...SEGMENTS.map((s) => ({ id: s.id, label: t.seg[s.id].name }))];
  const availTabs = [
    { id: "all", label: cp.all },
    { id: "ready", label: t.card.ready },
    { id: "mtm", label: t.card.mtm },
  ];

  const filtered = useMemo(() => {
    const q = norm(query);
    let list = ALL_PRODUCTS.filter((p) => {
      if (seg !== "all" && p.category !== seg) return false;
      if (avail === "ready" && p.badge !== "Pronta Entrega") return false;
      if (avail === "mtm" && p.badge !== "Sob Medida") return false;
      if (q && !norm(p.title).includes(q)) return false;
      return true;
    });
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.priceValue - b.priceValue);
    else if (sort === "priceDesc") list = [...list].sort((a, b) => b.priceValue - a.priceValue);
    else if (sort === "nameAsc") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [query, seg, avail, sort, t]);

  const hasFilters = query || seg !== "all" || avail !== "all" || sort !== "relevance";
  const clearAll = () => {
    setQuery("");
    setSeg("all");
    setAvail("all");
    setSort("relevance");
  };

  return (
    <div className="bg-cream">
      {/* Cabeçalho */}
      <div className="border-b border-line bg-surface bg-grain">
        <div className="container-page py-12 lg:py-16">
          <span className="font-script text-4xl leading-none text-wine md:text-5xl">{cp.title}</span>
          <h1 className="mt-1 font-body text-[clamp(22px,2.6vw,32px)] font-bold uppercase tracking-wide2 text-ink">
            {t.nav.produtos}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft">{cp.subtitle}</p>
        </div>
      </div>

      {/* Toolbar de filtros */}
      <div className="border-b border-line bg-surface/80 backdrop-blur-sm">
        <div className="container-page py-5">
          {/* Busca */}
          <div className="flex items-center border border-line bg-cream px-4 transition-colors focus-within:border-wine">
            <Search size={18} className="text-stone" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={cp.search}
              className="h-12 flex-1 bg-transparent px-3 font-body text-[15px] text-ink outline-none placeholder:text-stone"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="x" className="text-stone hover:text-wine">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filtros + ordenação */}
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {segTabs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeg(s.id)}
                  className={`rounded-pill border px-4 py-2 font-body text-[13px] transition-colors ${
                    seg === s.id ? "border-wine bg-wine text-white" : "border-line text-ink-soft hover:border-wine hover:text-wine"
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
              {availTabs.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAvail(a.id)}
                  className={`rounded-pill border px-3.5 py-2 font-body text-[12.5px] transition-colors ${
                    avail === a.id ? "border-ink bg-graphite text-white" : "border-line text-ink-soft hover:border-ink"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 font-body text-[12px] uppercase tracking-wide2 text-stone">
                <SlidersHorizontal size={14} /> {cp.sort}
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-10 border border-line bg-cream px-3 font-body text-[13.5px] text-ink outline-none focus:border-wine"
              >
                <option value="relevance">{cp.sortBy.relevance}</option>
                <option value="priceAsc">{cp.sortBy.priceAsc}</option>
                <option value="priceDesc">{cp.sortBy.priceDesc}</option>
                <option value="nameAsc">{cp.sortBy.nameAsc}</option>
              </select>
            </div>
          </div>

          {/* Contagem + limpar */}
          <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3">
            <p className="font-body text-[13px] text-stone">
              <span className="font-semibold text-ink">{filtered.length}</span>{" "}
              {filtered.length === 1 ? cp.result : cp.results}
            </p>
            {hasFilters && (
              <button onClick={clearAll} className="inline-flex items-center gap-1.5 font-body text-[12.5px] font-semibold uppercase tracking-wide2 text-wine hover:underline">
                <X size={13} /> {cp.clear}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grade */}
      <div className="container-page py-12 lg:py-16">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
            <Search size={40} strokeWidth={1} className="text-stone" />
            <p className="font-serif text-2xl text-ink">{cp.empty}</p>
            <button onClick={clearAll} className="font-body text-[13px] font-semibold uppercase tracking-wide2 text-wine hover:underline">
              {cp.clear}
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal as="li" key={p.id} delay={Math.min(i, 8) * 50}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
