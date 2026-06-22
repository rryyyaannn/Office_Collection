import { useState } from "react";

/**
 * Abas/pills de filtro reutilizáveis (render-prop).
 * Pill ativa em bordô preenchido; inativas com contorno fino.
 *
 * @param {{id:string,label:string}[]} tabs
 * @param {(activeId:string)=>React.ReactNode} children  recebe o id da aba ativa
 */
export default function Tabs({ tabs, defaultTab, children }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0].id);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filtrar por segmento"
        className="flex flex-wrap items-center justify-center gap-2.5"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className={`rounded-pill px-5 py-2.5 font-body text-[13.5px] tracking-wide transition-all duration-200 ${
                isActive
                  ? "border border-wine bg-wine text-white shadow-[0_10px_22px_-16px_rgba(112,31,32,0.95)]"
                  : "border border-line bg-transparent text-ink-soft hover:border-wine hover:text-wine"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-12">{children(active)}</div>
    </div>
  );
}
