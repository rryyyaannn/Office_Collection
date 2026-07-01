export function Logo({ className = "" }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="flex items-end gap-1">
        <span className="font-serif text-lg font-semibold uppercase tracking-[0.18em] text-ink">Office</span>
        <span className="font-serif text-base italic text-wine">Collection</span>
      </span>
      <span className="text-[8px] uppercase tracking-[0.22em] text-stone">Portal Corporativo</span>
    </span>
  );
}

const variants = {
  primary: "bg-wine text-white hover:bg-wine-deep",
  dark: "bg-ink text-white hover:bg-black",
  outline: "border border-ink/40 text-ink hover:bg-ink hover:text-white",
  ghost: "text-wine hover:underline",
};
export function Button({ variant = "primary", className = "", as: Tag = "button", ...props }) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded px-4 py-2 font-body text-[13px] font-semibold uppercase tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Card({ className = "", children }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="label mb-1">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-stone">{hint}</span>}
    </label>
  );
}

const STATUS = {
  recebido: ["Recebido", "bg-info/10 text-info"],
  em_separacao: ["Em separação", "bg-warn/10 text-warn"],
  em_producao: ["Em produção", "bg-warn/10 text-warn"],
  despachado: ["Despachado", "bg-navy/10 text-navy"],
  entregue: ["Entregue", "bg-ok/10 text-ok"],
  devolvido: ["Devolvido · retirar Morumbi", "bg-wine/10 text-wine"],
  cancelado: ["Cancelado", "bg-stone/15 text-stone"],
  liberado: ["Liberado", "bg-ok/10 text-ok"],
  aguardando: ["Aguardando Office", "bg-warn/10 text-warn"],
  ativo: ["Ativo", "bg-ok/10 text-ok"],
  bloqueado: ["Bloqueado", "bg-stone/15 text-stone"],
  pre_cadastrado: ["Pré-cadastrado", "bg-warn/10 text-warn"],
  ok: ["OK", "bg-ok/10 text-ok"],
  excecao: ["Exceção", "bg-wine/10 text-wine"],
};
export function StatusPill({ status }) {
  const [label, cls] = STATUS[status] || [status, "bg-stone/15 text-stone"];
  return <span className={`pill ${cls}`}>{label}</span>;
}

export function PageTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-wine">{eyebrow}</p>}
        <h1 className="font-serif text-2xl font-semibold text-ink">{title}</h1>
      </div>
      {children}
    </div>
  );
}

// Modal de confirmação (poka-yoke antes de ações definitivas).
export function Modal({ open, title, children, onClose, onConfirm, confirmLabel = "Confirmar", busy }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="mb-2 font-serif text-lg font-semibold text-ink">{title}</h3>}
        <div className="text-[14px] text-ink-soft">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancelar</Button>
          {onConfirm && <Button onClick={onConfirm} disabled={busy}>{confirmLabel}</Button>}
        </div>
      </div>
    </div>
  );
}
