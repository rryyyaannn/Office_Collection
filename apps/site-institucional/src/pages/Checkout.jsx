import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Lock } from "lucide-react";
import { useCart } from "../cart";
import { useT } from "../i18n";
import { formatBRL } from "../data/catalog";
import Button from "../components/Button";

const field =
  "h-11 w-full border border-line bg-surface px-3 font-body text-[14px] text-ink outline-none transition-colors focus:border-wine";
const label = "mb-1.5 block font-body text-[11px] font-semibold uppercase tracking-wide2 text-stone";

export default function Checkout() {
  const t = useT();
  const s = t.shop;
  const { items, subtotal, clear, itemKey } = useCart();
  const [pay, setPay] = useState("card");
  const [done, setDone] = useState(null);

  const placeOrder = (e) => {
    e.preventDefault();
    const n = "OC" + Math.floor(100000 + Math.random() * 899999);
    setDone(n);
    clear();
    window.scrollTo(0, 0);
  };

  if (done) {
    return (
      <div className="container-content flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <CheckCircle2 size={56} strokeWidth={1.2} className="text-[#7FB069]" />
        <h1 className="font-serif text-4xl font-semibold text-ink">{s.confirmedTitle}</h1>
        <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">{s.confirmedText}</p>
        <p className="font-body text-[13px] uppercase tracking-wide2 text-stone">
          {s.orderNo} <span className="font-semibold text-wine">{done}</span>
        </p>
        <Button as={Link} to="/" variant="primary" className="mt-2">
          {s.backHome}
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-content flex min-h-[50vh] flex-col items-center justify-center gap-5 py-20 text-center">
        <p className="font-serif text-2xl text-ink">{s.emptyCheckout}</p>
        <Button as={Link} to="/#catalogo" variant="primary">
          {s.emptyCta}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-cream">
      <div className="container-page py-12 lg:py-16">
        <h1 className="font-serif text-[clamp(28px,3.4vw,40px)] font-semibold text-ink">{s.checkoutTitle}</h1>

        <form onSubmit={placeOrder} className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Formulário */}
          <div className="space-y-10">
            <section>
              <h2 className="mb-5 font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">{s.contact}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className={label}>{s.name}</label><input required className={field} /></div>
                <div><label className={label}>{s.email}</label><input type="email" required className={field} /></div>
                <div><label className={label}>{s.phone}</label><input required className={field} /></div>
              </div>
            </section>

            <section>
              <h2 className="mb-5 font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">{s.delivery}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
                <div className="col-span-2"><label className={label}>{s.cep}</label><input required className={field} /></div>
                <div className="col-span-2 sm:col-span-4"><label className={label}>{s.address}</label><input required className={field} /></div>
                <div className="col-span-1 sm:col-span-1"><label className={label}>{s.number}</label><input required className={field} /></div>
                <div className="col-span-1 sm:col-span-2"><label className={label}>{s.complement}</label><input className={field} /></div>
                <div className="col-span-2 sm:col-span-2"><label className={label}>{s.city}</label><input required className={field} /></div>
                <div className="col-span-2 sm:col-span-1"><label className={label}>{s.state}</label><input required className={field} /></div>
              </div>
            </section>

            <section>
              <h2 className="mb-5 font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">{s.payment}</h2>
              <div className="grid grid-cols-3 gap-3">
                {[["card", s.card], ["pix", s.pix], ["boleto", s.boleto]].map(([k, lbl]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setPay(k)}
                    className={`border px-3 py-3 font-body text-[13px] transition-colors ${
                      pay === k ? "border-wine bg-wine/5 text-wine" : "border-line text-ink-soft hover:border-ink"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
              {pay === "card" && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="col-span-2 sm:col-span-4"><label className={label}>{s.cardNumber}</label><input required className={field} placeholder="0000 0000 0000 0000" /></div>
                  <div className="col-span-2 sm:col-span-2"><label className={label}>{s.cardName}</label><input required className={field} /></div>
                  <div className="col-span-1"><label className={label}>{s.cardExp}</label><input required className={field} placeholder="MM/AA" /></div>
                  <div className="col-span-1"><label className={label}>{s.cardCvv}</label><input required className={field} placeholder="000" /></div>
                </div>
              )}
            </section>
          </div>

          {/* Resumo */}
          <aside className="h-fit border border-line bg-surface p-6 lg:sticky lg:top-28">
            <h2 className="font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">{s.orderSummary}</h2>
            <ul className="mt-5 space-y-4">
              {items.map((it) => (
                <li key={itemKey(it)} className="flex gap-3">
                  <img src={it.image} alt="" className="h-16 w-14 shrink-0 border border-line object-cover" />
                  <div className="flex-1">
                    <p className="font-serif text-[14px] font-semibold leading-snug text-ink">{it.title}</p>
                    <p className="font-body text-[11.5px] text-stone">
                      {it.size && <>{t.pdp.size} {it.size} · </>}{it.qty}×
                    </p>
                  </div>
                  <span className="font-body text-[13px] text-ink">{formatBRL(it.priceValue * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-1.5 border-t border-line pt-4 font-body text-[14px]">
              <div className="flex justify-between text-ink-soft">
                <span>{s.subtotal}</span><span>{formatBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>{s.delivery}</span><span className="text-[#7FB069]">{s.freeShipping}</span>
              </div>
              <div className="flex justify-between pt-2 text-ink">
                <span className="font-bold uppercase tracking-wide2 text-[12px]">{s.total}</span>
                <span className="font-serif text-2xl font-semibold text-wine">{formatBRL(subtotal)}</span>
              </div>
            </div>
            <Button variant="dark" className="mt-5 w-full">
              {s.placeOrder}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 font-body text-[11.5px] text-stone">
              <Lock size={12} /> {s.demoNote}
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}
