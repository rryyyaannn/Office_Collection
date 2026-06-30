import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { Button, Card, Field, PageTitle, Modal } from "../../components/ui";
import { currentProfile } from "../../lib/auth";
import { orderService } from "../../lib/services";
import { POSITIONS, KITS, productById, STOCK, BORDADO_INFO } from "../../data/seed";
import { bordadoOpcoes, BORDADO_MAX } from "../../lib/normalize";
import { enderecoLinha } from "../../lib/validators";

const posByCode = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p]));
const MODEL = [["todas", "Todas"], ["fem", "Feminina"], ["masc", "Masculina"], ["uni", "Unissex"]];

export default function Pedido() {
  const nav = useNavigate();
  const profile = currentProfile();
  const kit = KITS[posByCode[profile.position]?.kit];
  const opcoesBordado = bordadoOpcoes(profile.nome);
  const [form, setForm] = useState({});
  const [bordado, setBordado] = useState(opcoesBordado[0] || "");
  const [filtro, setFiltro] = useState("todas");
  const [erro, setErro] = useState("");
  const [review, setReview] = useState(null); // resumo p/ confirmação
  const [busy, setBusy] = useState(false);

  if (!kit) return <Navigate to="/portal" replace />;
  if (orderService.jaPediu(profile.id)) return <Navigate to="/portal/meus-pedidos" replace />;

  // exceção por colaborador: regras.kit_qtd sobrepõe a quantidade do kit (ex.: médico = 1 jaleco)
  const kitQtd = profile.regras?.kit_qtd;
  const slots = kit.slots.map((s) => ({
    ...s,
    max: s.modo === "multi" && kitQtd != null ? kitQtd : s.max,
    produtos: s.produtos.map((id) => productById[id]),
  }));
  const temFiltro = slots.some((s) => new Set(s.produtos.map((p) => p.genero)).size > 1);
  const aplicaFiltro = (ps) => (filtro === "todas" ? ps : ps.filter((p) => p.genero === filtro));
  const setSingle = (i, patch) => setForm((f) => ({ ...f, [i]: { ...f[i], ...patch } }));
  const setPick = (i, pid, patch) =>
    setForm((f) => ({ ...f, [i]: { picks: { ...(f[i]?.picks || {}), [pid]: { ...(f[i]?.picks?.[pid] || { qtd: 0, tamanho: "" }), ...patch } } } }));

  // valida + monta os itens; abre a tela de confirmação
  function revisar() {
    setErro("");
    if (!profile.endereco) return setErro("Cadastre o endereço de entrega em “Minha conta” antes de pedir.");
    const items = [];
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]; const v = form[i] || {};
      if (slot.modo === "multi") {
        const picks = v.picks || {};
        const total = Object.values(picks).reduce((a, p) => a + (p.qtd || 0), 0);
        if (total !== slot.max) return setErro(`Escolha exatamente ${slot.max} ${slot.label.toLowerCase()}.`);
        for (const [pid, p] of Object.entries(picks)) {
          if (p.qtd > 0) {
            if (!p.tamanho) return setErro(`Selecione o tamanho de ${productById[pid].nome}.`);
            items.push({ productId: pid, tamanho: p.tamanho, qtd: p.qtd });
          }
        }
      } else {
        if (!v.productId) return setErro(`Selecione a peça em ${slot.label}.`);
        if (!v.tamanho) return setErro(`Selecione o tamanho em ${slot.label}.`);
        items.push({ productId: v.productId, tamanho: v.tamanho, qtd: 1 });
      }
    }
    const preview = items.map((it) => ({
      ...it, nome: productById[it.productId]?.nome,
      sobMedida: (STOCK[it.productId]?.[it.tamanho] ?? 0) < it.qtd,
      bordado: kit.bordado ? bordado : null,
    }));
    setReview({ items, preview });
  }

  async function confirmar() {
    setBusy(true);
    try {
      const order = await orderService.create({ profileId: profile.id, unidade: profile.unidade, items: review.items, entregaTipo: "casa", bordado: kit.bordado ? bordado : null });
      nav("/portal/meus-pedidos", { state: { novo: order.numero } });
    } catch {
      setBusy(false); setReview(null); setErro("Não foi possível registrar o pedido. Tente novamente.");
    }
  }

  const destinoTexto = profile.endereco ? enderecoLinha(profile.endereco) : "—";

  return (
    <div>
      <PageTitle eyebrow={kit.nome} title="Fazer pedido">
        <Button variant="outline" onClick={() => nav("/portal")}>Voltar</Button>
      </PageTitle>

      {temFiltro && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-stone">Filtrar modelagem:</span>
          {MODEL.map(([v, label]) => (
            <button key={v} onClick={() => setFiltro(v)}
              className={`rounded-full border px-3 py-1 text-[12px] ${filtro === v ? "border-wine bg-wine text-white" : "border-line text-ink-soft hover:border-ink/40"}`}>
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {slots.map((slot, i) =>
            slot.modo === "multi"
              ? <SlotMulti key={i} slot={slot} value={form[i]} filtroFn={aplicaFiltro} onPick={(pid, patch) => setPick(i, pid, patch)} />
              : <SlotSingle key={i} slot={slot} value={form[i] || {}} filtroFn={aplicaFiltro} onChange={(patch) => setSingle(i, patch)} />
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-2 font-serif text-lg font-semibold">Entrega</h3>
            <p className="text-[10px] uppercase tracking-wide text-stone">Endereço cadastrado</p>
            <p className="text-[13px] font-medium text-ink">{profile.endereco ? enderecoLinha(profile.endereco) : "nenhum endereço cadastrado"}</p>
            <p className="mt-2 text-[11px] text-stone">Endereço errado? Ajuste em <a href="/portal/conta" className="text-wine underline">Minha conta</a> antes de pedir.</p>
          </Card>

          {kit.bordado && (
            <Card>
              <h3 className="mb-2 font-serif text-lg font-semibold">Bordado do nome</h3>
              <p className="mb-1 text-[11px] text-stone">Escolha como o nome vai bordado (máx. {BORDADO_MAX} letras):</p>
              <select className="input" value={bordado} onChange={(e) => setBordado(e.target.value)}>
                {opcoesBordado.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <p className="mt-1 text-right text-[10px] text-stone">{bordado.length}/{BORDADO_MAX}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-stone">{BORDADO_INFO}</p>
            </Card>
          )}

          {erro && <p className="rounded border border-wine/30 bg-wine/5 px-3 py-2 text-[13px] text-wine">{erro}</p>}
          <Button className="w-full" onClick={revisar}>Revisar pedido</Button>
        </div>
      </div>

      {/* Confirmação (poka-yoke: confere tudo antes de enviar) */}
      <Modal open={!!review} title="Confirme seu pedido" onClose={() => setReview(null)} onConfirm={confirmar} confirmLabel="Confirmar pedido" busy={busy}>
        {review && (
          <div className="space-y-3 text-[13px]">
            <ul className="divide-y divide-line border-y border-line">
              {review.preview.map((it, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span>{it.nome} · <strong>tam {it.tamanho}</strong> · {it.qtd}x</span>
                  <span className="text-[11px] text-stone">{it.sobMedida ? "sob medida" : "pronta entrega"}</span>
                </li>
              ))}
            </ul>
            {review.preview[0]?.bordado && <p>Bordado: <strong>{review.preview[0].bordado}</strong></p>}
            <div>
              <p className="text-[10px] uppercase tracking-wide text-stone">Entrega</p>
              <p className="font-medium text-ink">{destinoTexto}</p>
            </div>
            <p className="text-[11px] text-stone">Confira tudo — após confirmar, alterações são feitas com a Office pelo WhatsApp.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function PieceCard({ product, selected, onClick, children }) {
  return (
    <div onClick={onClick} className={`cursor-pointer rounded border p-3 text-center transition ${selected ? "border-wine bg-wine/5 ring-1 ring-wine" : "border-line hover:border-ink/40"}`}>
      <img src={product.foto} alt={product.nome} className="mx-auto h-28 w-auto" />
      <p className="mt-2 text-[13px] font-medium text-ink">{product.nome}</p>
      <p className="text-[11px] text-stone">{product.tecido} · {product.modelagem}</p>
      {children}
    </div>
  );
}

function SizeSelect({ product, value, onChange }) {
  return (
    <select className="input mt-2" value={value || ""} onClick={(e) => e.stopPropagation()} onChange={(e) => onChange(e.target.value)}>
      <option value="">tamanho…</option>
      {product.tamanhos.map((t) => {
        const semEstoque = (STOCK[product.id]?.[t] ?? 0) <= 0;
        return <option key={t} value={t}>{t}{semEstoque ? " (sob medida)" : ""}</option>;
      })}
    </select>
  );
}

function SlotSingle({ slot, value, filtroFn, onChange }) {
  const produtos = filtroFn(slot.produtos);
  const unico = slot.produtos.length === 1 ? slot.produtos[0] : null;
  const selId = value.productId || (unico ? unico.id : null);
  return (
    <Card>
      <h3 className="mb-1 font-serif text-lg font-semibold">{slot.label}</h3>
      <p className="mb-3 text-[12px] text-stone">Escolha o corte pela imagem.</p>
      {produtos.length === 0 ? <p className="text-[13px] text-wine">Nenhuma peça nesse filtro.</p> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {produtos.map((p) => {
            const sel = selId === p.id;
            return (
              <PieceCard key={p.id} product={p} selected={sel} onClick={() => onChange({ productId: p.id })}>
                {sel && <SizeSelect product={p} value={value.tamanho} onChange={(t) => onChange({ productId: p.id, tamanho: t })} />}
              </PieceCard>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function SlotMulti({ slot, value, filtroFn, onPick }) {
  const produtos = filtroFn(slot.produtos);
  const picks = value?.picks || {};
  const total = Object.values(picks).reduce((a, p) => a + (p.qtd || 0), 0);
  const restante = slot.max - total;
  return (
    <Card>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold">{slot.label}</h3>
        <span className={`pill ${total === slot.max ? "bg-ok/10 text-ok" : "bg-warn/10 text-warn"}`}>{total} de {slot.max}</span>
      </div>
      <p className="mb-3 text-[12px] text-stone">{slot.regra || `Escolha ${slot.max} peças.`}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {produtos.map((p) => {
          const pick = picks[p.id] || { qtd: 0, tamanho: "" };
          const podeMais = restante > 0;
          return (
            <PieceCard key={p.id} product={p} selected={pick.qtd > 0}>
              <div className="mt-2 flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                <button type="button" disabled={pick.qtd === 0} onClick={() => onPick(p.id, { qtd: pick.qtd - 1 })}
                  className="grid h-7 w-7 place-items-center rounded border border-line disabled:opacity-30"><Minus size={14} /></button>
                <span className="w-5 text-center text-[14px] font-semibold">{pick.qtd}</span>
                <button type="button" disabled={!podeMais} onClick={() => onPick(p.id, { qtd: pick.qtd + 1 })}
                  className="grid h-7 w-7 place-items-center rounded border border-line disabled:opacity-30"><Plus size={14} /></button>
              </div>
              {pick.qtd > 0 && <SizeSelect product={p} value={pick.tamanho} onChange={(t) => onPick(p.id, { tamanho: t })} />}
            </PieceCard>
          );
        })}
      </div>
    </Card>
  );
}
