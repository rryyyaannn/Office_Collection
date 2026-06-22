import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Minus,
  Plus,
  Ruler,
  Shirt,
  ShieldCheck,
  Truck,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import Button from "../components/Button";
import ProductCarousel from "../components/ProductCarousel";
import Reveal from "../components/Reveal";
import { getProduct, ALL_PRODUCTS, PRODUCTS } from "../data/catalog";
import { useT } from "../i18n";
import { useCart } from "../cart";

const LOGO_POSITIONS = ["bustoEsq", "bustoDir", "central", "bracoEsq", "bracoDir", "costas"];
const PAY = ["Visa", "Mastercard", "Elo", "Amex", "Pix", "Boleto"];
const TAB_KEYS = ["detalhes", "atributos", "indicado", "observacoes", "conservacao", "sustentabilidade"];

function trackViewed(id) {
  try {
    const prev = JSON.parse(localStorage.getItem("oc-viewed") || "[]");
    const next = [id, ...prev.filter((x) => x !== id)].slice(0, 12);
    localStorage.setItem("oc-viewed", JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export default function ProductPage() {
  const { id } = useParams();
  const t = useT();
  const navigate = useNavigate();
  const { add, setOpen } = useCart();
  const product = getProduct(id);

  const [color, setColor] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [logoPos, setLogoPos] = useState(null);
  const [tab, setTab] = useState("detalhes");
  const [mainImg, setMainImg] = useState(0);
  const [showSize, setShowSize] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [needSize, setNeedSize] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setColor(0);
    setSize(null);
    setQty(1);
    setLogoPos(null);
    setTab("detalhes");
    setMainImg(0);
    if (product) trackViewed(product.id);
  }, [id, product]);

  if (!product) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
        <p className="font-serif text-3xl text-ink">{t.pdp.notFound}</p>
        <Button as={Link} to="/" variant="primary">
          {t.pdp.back}
        </Button>
      </div>
    );
  }

  const cat = product.category;
  const catName = t.seg[cat].name;
  const isReady = product.badge === "Pronta Entrega";
  const soldOut = product.soldOut;

  const buildItem = () => ({
    id: product.id,
    title: product.title,
    image: product.image,
    priceValue: product.priceValue,
    size,
    color,
    logoPos,
    qty,
  });
  const handleAdd = () => {
    if (!size) {
      setNeedSize(true);
      return;
    }
    setNeedSize(false);
    add(buildItem());
  };
  const handleBuy = () => {
    if (!size) {
      setNeedSize(true);
      return;
    }
    setNeedSize(false);
    add(buildItem());
    setOpen(false);
    navigate("/checkout");
  };

  const sameFabric = ALL_PRODUCTS.filter((p) => p.fabric === product.fabric && p.id !== product.id).slice(0, 8);
  const sameCat = (PRODUCTS[cat] || []).filter((p) => p.id !== product.id);
  const viewed = (() => {
    try {
      const ids = JSON.parse(localStorage.getItem("oc-viewed") || "[]");
      return ids.map(getProduct).filter((p) => p && p.id !== product.id);
    } catch {
      return [];
    }
  })();

  const tabContent = {
    detalhes: (
      <div className="space-y-3">
        <p>{t.pdp.desc[cat]}</p>
        <p>
          <span className="font-semibold text-ink">{t.pdp.composition}:</span> {product.fabric}
        </p>
      </div>
    ),
    atributos: <p>{t.pdp.attributesText}</p>,
    indicado: <p>{t.pdp.indicado[cat]}</p>,
    observacoes: <p>{t.pdp.observacoesText}</p>,
    conservacao: <p>{t.pdp.conservacaoText}</p>,
    sustentabilidade: <p>{t.pdp.sustentabilidadeText}</p>,
  };

  return (
    <div className="bg-cream">
      {/* Breadcrumb */}
      <div className="border-b border-line bg-surface">
        <nav className="container-page flex items-center gap-2 py-4 font-body text-[12.5px] text-stone">
          <Link to="/" className="hover:text-wine">{t.pdp.home}</Link>
          <ChevronRight size={13} />
          <Link to="/#catalogo" className="hover:text-wine">{catName}</Link>
          <ChevronRight size={13} />
          <span className="truncate text-ink">{product.title}</span>
        </nav>
      </div>

      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ===== Galeria ===== */}
          <div>
            <div className="overflow-hidden border border-line bg-surface">
              <img src={product.gallery[mainImg]} alt={product.title} className="aspect-[3/4] w-full object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(i)}
                  className={`overflow-hidden border bg-surface transition ${
                    mainImg === i ? "border-wine" : "border-line hover:border-ink"
                  }`}
                  aria-label={`Foto ${i + 1}`}
                >
                  <img src={g} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ===== Bloco de compra ===== */}
          <div>
            <h1 className="font-serif text-[clamp(26px,3.4vw,38px)] font-semibold leading-tight text-ink">
              {product.title}
            </h1>

            <p className="mt-4 font-serif text-3xl font-semibold text-wine">{product.price}</p>
            {product.installment && <p className="mt-1 font-body text-[14px] text-ink-soft">{product.installment}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`px-2.5 py-1 font-body text-[10.5px] font-semibold uppercase tracking-wide2 text-white ${
                  soldOut ? "bg-graphite/80" : isReady ? "bg-navy/90" : "bg-wine/90"
                }`}
              >
                {soldOut ? t.shop.soldOut : isReady ? t.card.ready : t.card.mtm}
              </span>
              <span className="font-body text-[12px] uppercase tracking-wide2 text-stone">
                {t.pdp.ref}: {product.sku}
              </span>
            </div>

            {/* Descrição curta + tabela de medidas */}
            <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-ink-soft">{t.pdp.desc[cat]}</p>
            <button
              onClick={() => setShowSize((v) => !v)}
              className="mt-3 inline-flex items-center gap-2 border-b border-ink/40 pb-0.5 font-body text-[12.5px] font-semibold uppercase tracking-wide2 text-ink transition-colors hover:border-wine hover:text-wine"
            >
              <Ruler size={15} /> {t.pdp.sizeTable}
            </button>
            {showSize && (
              <div className="mt-4 border border-line bg-surface p-4">
                <table className="w-full text-left font-body text-[13px]">
                  <thead>
                    <tr className="border-b border-line text-stone">
                      <th className="py-1.5 font-medium uppercase tracking-wide2 text-[11px]">{t.pdp.size}</th>
                      <th className="py-1.5 font-medium uppercase tracking-wide2 text-[11px]">Busto (cm)</th>
                      <th className="py-1.5 font-medium uppercase tracking-wide2 text-[11px]">Cintura (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizes.map(({ size: sz }, i) => (
                      <tr key={sz} className="border-b border-line/60 last:border-0 text-ink-soft">
                        <td className="py-1.5">{sz}</td>
                        <td className="py-1.5">{84 + i * 4}–{88 + i * 4}</td>
                        <td className="py-1.5">{66 + i * 4}–{70 + i * 4}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cor */}
            <div className="mt-8">
              <p className="font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink">{t.pdp.color}</p>
              <div className="mt-3 flex gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColor(i)}
                    aria-label={`${t.pdp.color} ${i + 1}`}
                    style={{ backgroundColor: c }}
                    className={`h-8 w-8 rounded-full border transition-all ${
                      color === i ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-cream" : "border-line hover:border-ink"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tamanho */}
            <div className="mt-7">
              <p className="font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink">{t.pdp.size}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map(({ size: sz, available }) => (
                  <button
                    key={sz}
                    disabled={!available}
                    onClick={() => setSize(sz)}
                    className={`grid h-11 w-11 place-items-center border font-body text-[14px] transition-all ${
                      !available
                        ? "cursor-not-allowed border-line/70 text-stone/50 line-through"
                        : size === sz
                          ? "border-ink bg-graphite text-white"
                          : "border-line text-ink hover:border-ink"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantidade */}
            <div className="mt-7">
              <p className="font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink">{t.pdp.quantity}</p>
              <div className="mt-3 inline-flex items-center border border-line">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-ink hover:bg-cream" aria-label="-">
                  <Minus size={15} />
                </button>
                <span className="grid h-11 w-12 place-items-center font-body text-[15px] text-ink">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-11 w-11 place-items-center text-ink hover:bg-cream" aria-label="+">
                  <Plus size={15} />
                </button>
              </div>
            </div>

            {/* Personalização com a logo */}
            <div className="mt-8 border border-line bg-surface p-5">
              <p className="font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">
                {t.pdp.personalize} <span className="font-semibold text-wine">{t.pdp.personalizeExtra}</span>
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {LOGO_POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setLogoPos((p) => (p === pos ? null : pos))}
                    className={`flex flex-col items-center gap-1.5 border px-2 py-3 transition-all ${
                      logoPos === pos ? "border-wine bg-wine/5 text-wine" : "border-line text-ink-soft hover:border-ink"
                    }`}
                  >
                    <Shirt size={22} strokeWidth={1.3} />
                    <span className="text-center font-body text-[10.5px] leading-tight">{t.pdp.positions[pos]}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 border-l-2 border-wine bg-cream px-4 py-3 font-body text-[12.5px] leading-relaxed text-ink-soft">
                {t.pdp.embroideryNote}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-7">
              {needSize && <p className="mb-3 font-body text-[13px] text-wine">{t.shop.selectSize}</p>}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button variant="outline" className="w-full" onClick={handleAdd} disabled={soldOut}>
                  <ShoppingBag size={16} strokeWidth={1.8} /> {soldOut ? t.shop.soldOut : t.pdp.addCart}
                </Button>
                <Button variant="dark" className="w-full" onClick={handleBuy} disabled={soldOut}>
                  {t.pdp.buyNow}
                </Button>
              </div>
            </div>

            {/* Pagamento */}
            <div className="mt-8 border-t border-line pt-6">
              <p className="font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink">{t.pdp.payWith}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PAY.map((p) => (
                  <span key={p} className="grid h-8 min-w-[52px] place-items-center border border-line px-2 font-body text-[10.5px] font-semibold uppercase tracking-wide text-ink-soft">
                    {p}
                  </span>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 font-body text-[12px] text-stone">
                <ShieldCheck size={14} className="text-wine" /> {t.pdp.secure}
              </p>
            </div>

            {/* Frete */}
            <div className="mt-6">
              <p className="flex items-center gap-2 font-body text-[12px] font-semibold uppercase tracking-wide2 text-ink">
                <Truck size={15} className="text-wine" /> {t.pdp.shipping}
              </p>
              <form className="mt-3 flex max-w-xs items-center border border-line" onSubmit={(e) => e.preventDefault()}>
                <input
                  placeholder={t.pdp.cep}
                  className="h-11 flex-1 bg-transparent px-3 font-body text-[14px] text-ink outline-none placeholder:text-stone"
                />
                <button className="h-11 bg-graphite px-5 font-body text-[12px] font-semibold uppercase tracking-wide2 text-white hover:bg-wine">
                  {t.pdp.calc}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ===== Abas de detalhe ===== */}
        <div className="mt-16 border-t border-line pt-10">
          <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-line">
            {TAB_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`-mb-px border-b-2 pb-3 font-body text-[12.5px] font-semibold uppercase tracking-wide2 transition-colors ${
                  tab === k ? "border-wine text-wine" : "border-transparent text-stone hover:text-ink"
                }`}
              >
                {t.pdp.tabs[k]}
              </button>
            ))}
          </div>
          <div className="mt-7 max-w-3xl text-[15px] leading-relaxed text-ink-soft">{tabContent[tab]}</div>
        </div>
      </div>

      {/* ===== Relacionados ===== */}
      <div className="space-y-16 bg-surface py-16">
        {sameFabric.length > 0 && <RelatedRow title={t.pdp.related.fabric} products={sameFabric} />}
        {sameCat.length > 0 && <RelatedRow title={t.pdp.related.category} products={sameCat} />}
        {viewed.length > 0 && <RelatedRow title={t.pdp.related.viewed} products={viewed} />}
      </div>

      {/* ===== FAQ ===== */}
      <div className="border-t border-line bg-cream py-16 lg:py-20">
        <div className="container-content">
          <h2 className="text-center font-body text-[clamp(20px,2.4vw,28px)] font-bold uppercase tracking-wide2 text-ink">
            {t.pdp.faqTitle}
          </h2>
          <div className="mx-auto mt-10 max-w-2xl divide-y divide-line border-y border-line">
            {t.pdp.faq.map((f, i) => {
              const open = faqOpen === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setFaqOpen(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-serif text-lg text-ink">{f.q}</span>
                    <ChevronDown size={18} className={`shrink-0 text-wine transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <p className="pb-5 text-[14.5px] leading-relaxed text-ink-soft">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedRow({ title, products }) {
  return (
    <section className="container-page">
      <Reveal>
        <h2 className="mb-8 font-body text-[clamp(18px,2vw,24px)] font-bold uppercase tracking-wide2 text-ink">{title}</h2>
        <ProductCarousel products={products} />
      </Reveal>
    </section>
  );
}
