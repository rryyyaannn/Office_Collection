import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../cart";
import { useT } from "../i18n";
import { formatBRL } from "../data/catalog";
import Button from "./Button";

export default function CartDrawer() {
  const t = useT();
  const { items, open, setOpen, remove, setQty, subtotal, itemKey } = useCart();

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-graphite/45 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-[92%] max-w-md flex-col bg-cream shadow-lift transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <span className="flex items-center gap-2 font-body text-[13px] font-bold uppercase tracking-wide2 text-ink">
            <ShoppingBag size={17} /> {t.shop.cart}
          </span>
          <button aria-label="Fechar" onClick={() => setOpen(false)}>
            <X size={22} className="text-ink" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <ShoppingBag size={40} strokeWidth={1} className="text-stone" />
            <p className="font-body text-[15px] text-ink-soft">{t.shop.empty}</p>
            <Button as={Link} to="/#catalogo" variant="primary" onClick={() => setOpen(false)}>
              {t.shop.emptyCta}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="space-y-5">
                {items.map((it) => {
                  const key = itemKey(it);
                  return (
                    <li key={key} className="flex gap-4 border-b border-line/70 pb-5">
                      <img src={it.image} alt={it.title} className="h-24 w-20 shrink-0 border border-line object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to={`/produto/${it.id}`}
                            onClick={() => setOpen(false)}
                            className="font-serif text-[15px] font-semibold leading-snug text-ink hover:text-wine"
                          >
                            {it.title}
                          </Link>
                          <button onClick={() => remove(key)} aria-label={t.shop.remove} className="text-stone hover:text-wine">
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="mt-1 font-body text-[12px] text-stone">
                          {it.size && <span>{t.pdp.size}: {it.size}</span>}
                          {it.logoPos && <span> · {t.shop.logoAt}: {t.pdp.positions[it.logoPos]}</span>}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="inline-flex items-center border border-line">
                            <button onClick={() => setQty(key, it.qty - 1)} className="grid h-8 w-8 place-items-center text-ink hover:bg-surface" aria-label="-">
                              <Minus size={13} />
                            </button>
                            <span className="grid h-8 w-9 place-items-center font-body text-[13px]">{it.qty}</span>
                            <button onClick={() => setQty(key, it.qty + 1)} className="grid h-8 w-8 place-items-center text-ink hover:bg-surface" aria-label="+">
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="font-body text-[14px] font-medium text-ink">
                            {formatBRL(it.priceValue * it.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <footer className="border-t border-line px-6 py-5">
              <div className="flex items-center justify-between font-body">
                <span className="text-[13px] uppercase tracking-wide2 text-stone">{t.shop.subtotal}</span>
                <span className="font-serif text-2xl font-semibold text-ink">{formatBRL(subtotal)}</span>
              </div>
              <p className="mt-1 font-body text-[12px] text-stone">{t.shop.shippingNote}</p>
              <div className="mt-4 grid gap-2">
                <Button as={Link} to="/checkout" variant="dark" className="w-full" onClick={() => setOpen(false)}>
                  {t.shop.checkout}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                  {t.shop.keepShopping}
                </Button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
