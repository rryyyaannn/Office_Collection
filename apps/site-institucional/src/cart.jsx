import { createContext, useContext, useEffect, useMemo, useState } from "react";

/* Carrinho 100% client-side (persistido em localStorage). */

const CartContext = createContext(null);
const KEY = "oc-cart";

const itemKey = (i) => `${i.id}|${i.size || ""}|${i.color ?? ""}|${i.logoPos || ""}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = (item) => {
    setItems((prev) => {
      const key = itemKey(item);
      const found = prev.find((p) => itemKey(p) === key);
      if (found) {
        return prev.map((p) => (itemKey(p) === key ? { ...p, qty: p.qty + (item.qty || 1) } : p));
      }
      return [...prev, { ...item, qty: item.qty || 1 }];
    });
    setOpen(true);
  };

  const remove = (key) => setItems((prev) => prev.filter((p) => itemKey(p) !== key));
  const setQty = (key, qty) =>
    setItems((prev) => prev.map((p) => (itemKey(p) === key ? { ...p, qty: Math.max(1, qty) } : p)));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + (i.priceValue || 0) * i.qty, 0), [items]);

  const value = { items, add, remove, setQty, clear, count, subtotal, open, setOpen, itemKey };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
