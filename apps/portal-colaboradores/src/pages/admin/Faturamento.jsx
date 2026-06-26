import { useMemo, useState } from "react";
import { Download, Save } from "lucide-react";
import { Button, Card, Field, PageTitle } from "../../components/ui";
import { useStore } from "../../lib/store";
import { configService } from "../../lib/services";
import { PRODUCTS, POSITIONS, UNIDADES, productById, KITS } from "../../data/seed";

const posByCode = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p]));
const unidadeUF = Object.fromEntries(UNIDADES.map((u) => [u.codigo, u.uf]));
const money = (v) => "R$ " + (Number(v) || 0).toFixed(2).replace(".", ",");
const mesAtual = new Date().toISOString().slice(0, 7);

export default function Faturamento() {
  const orders = useStore((s) => s.orders);
  const profiles = useStore((s) => s.profiles);
  const config = useStore((s) => s.config) || {};
  const precos = config.precos || {};

  const [mes, setMes] = useState(mesAtual);
  const [fretes, setFretes] = useState({});           // override manual de frete por pedido
  const [editPrecos, setEditPrecos] = useState(false);
  const [precosEdit, setPrecosEdit] = useState(precos);
  const [salvo, setSalvo] = useState("");

  const linhas = useMemo(() => {
    return orders.filter((o) => (o.createdAt || "").slice(0, 7) === mes).map((o) => {
      const profile = profiles.find((p) => p.id === o.profileId);
      const ufEntrega = o.entregaTipo === "unidade" ? unidadeUF[o.unidade] : profile?.endereco?.uf;
      const grupo = ufEntrega === "GO" ? "GOIÂNIA" : "GERAL";
      const cliente = ufEntrega === "GO" ? config.cliente_go : config.cliente_sp;
      const valor = o.items.reduce((a, it) => a + (Number(precos[it.productId]) || 0) * it.qtd, 0);
      const freteDefault = ufEntrega === "SP" ? Number(config.frete_contrato_sp) || 0 : 0;
      const frete = fretes[o.id] !== undefined ? Number(fretes[o.id]) || 0 : freteDefault;
      const kit = KITS[posByCode[profile?.position]?.kit];
      return { o, nome: profile?.nome || "—", kit: kit?.nome || "—", uf: ufEntrega || "?", grupo, cliente, valor, frete, total: valor + frete };
    });
  }, [orders, profiles, mes, fretes, precos, config]);

  const resumo = (g) => {
    const ls = linhas.filter((l) => l.grupo === g);
    return { qtd: ls.length, valor: ls.reduce((a, l) => a + l.valor, 0), frete: ls.reduce((a, l) => a + l.frete, 0), total: ls.reduce((a, l) => a + l.total, 0) };
  };
  const geral = resumo("GERAL"), goiania = resumo("GOIÂNIA");

  function exportCSV() {
    const cols = ["DATA", "PEDIDO", "COLABORADOR", "KIT", "UF", "CLIENTE", "VALOR", "FRETE", "TOTAL", "NOTA"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = linhas.map((l) => [l.o.createdAt.slice(0, 10), l.o.numero, l.nome, l.kit, l.uf, l.cliente, l.valor.toFixed(2), l.frete.toFixed(2), l.total.toFixed(2), l.grupo]);
    const csv = [cols.join(";"), ...rows.map((r) => r.map(esc).join(";"))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `faturamento-${mes}.csv`; a.click(); URL.revokeObjectURL(url);
  }

  async function salvarPrecos() {
    const limpo = {}; for (const k in precosEdit) limpo[k] = Number(precosEdit[k]) || 0;
    await configService.save({ precos: limpo });
    setEditPrecos(false); setSalvo("Tabela de preços salva."); setTimeout(() => setSalvo(""), 2500);
  }

  return (
    <div>
      <PageTitle eyebrow="Financeiro" title="Faturamento mensal">
        <div className="flex items-center gap-2">
          <input type="month" className="input w-40" value={mes} onChange={(e) => setMes(e.target.value)} />
          <Button variant="outline" onClick={exportCSV}><Download size={15} /> CSV</Button>
        </div>
      </PageTitle>

      <p className="mb-4 max-w-3xl text-[13px] text-stone">
        Compila os pedidos do mês por cliente, com preços e frete. <strong>Tudo editável à mão</strong> —
        os valores vêm da planilha como ponto de partida. Gera as <strong>2 notas</strong>: GERAL (Einstein SP) e GOIÂNIA (GO).
      </p>

      {/* 2 notas */}
      <div className="mb-5 grid gap-4 md:grid-cols-2">
        <NotaCard titulo={`NOTA GERAL — Einstein SP (${config.cliente_sp})`} r={geral} />
        <NotaCard titulo={`NOTA GOIÂNIA — Einstein GO (${config.cliente_go})`} r={goiania} />
      </div>

      {/* tabela de pedidos */}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line bg-cream text-[11px] uppercase tracking-wide text-stone">
              <th className="px-3 py-2.5">Pedido</th><th className="px-3 py-2.5">Colaborador</th><th className="px-3 py-2.5">Kit</th>
              <th className="px-3 py-2.5">UF</th><th className="px-3 py-2.5">Nota</th><th className="px-3 py-2.5 text-right">Valor</th>
              <th className="px-3 py-2.5 text-right">Frete</th><th className="px-3 py-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {linhas.length === 0 && <tr><td colSpan={8} className="px-3 py-4 text-stone">Nenhum pedido neste mês.</td></tr>}
            {linhas.map((l) => (
              <tr key={l.o.id} className="border-b border-line/70">
                <td className="px-3 py-2 font-medium">{l.o.numero}</td>
                <td className="px-3 py-2">{l.nome}</td>
                <td className="px-3 py-2 text-stone">{l.kit}</td>
                <td className="px-3 py-2">{l.uf}</td>
                <td className="px-3 py-2 text-[11px]">{l.grupo}</td>
                <td className="px-3 py-2 text-right">{money(l.valor)}</td>
                <td className="px-3 py-2 text-right">
                  <input className="input w-20 py-1 text-right text-[12px]" value={fretes[l.o.id] ?? l.frete}
                    onChange={(e) => setFretes((f) => ({ ...f, [l.o.id]: e.target.value }))} />
                </td>
                <td className="px-3 py-2 text-right font-medium">{money(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* tabela de preços editável */}
      <div className="mt-5">
        <button onClick={() => { setPrecosEdit(precos); setEditPrecos((v) => !v); }} className="text-[13px] font-semibold text-wine hover:underline">
          {editPrecos ? "▾" : "▸"} Tabela de preços (editar à mão)
        </button>
        {salvo && <span className="ml-3 text-[12px] text-ok">{salvo}</span>}
        {editPrecos && (
          <Card className="mt-2">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((p) => (
                <Field key={p.id} label={p.nome}>
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] text-stone">R$</span>
                    <input className="input py-1 text-[13px]" value={precosEdit[p.id] ?? ""} inputMode="decimal"
                      onChange={(e) => setPrecosEdit((pe) => ({ ...pe, [p.id]: e.target.value.replace(",", ".") }))} />
                  </div>
                </Field>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Button onClick={salvarPrecos}><Save size={15} /> Salvar tabela</Button>
              <span className="text-[12px] text-stone">Frete SP (contrato): R$ {Number(config.frete_contrato_sp).toFixed(2)} — ES/MT/GO frete real (ajuste na linha do pedido).</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function NotaCard({ titulo, r }) {
  return (
    <Card>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-wine">{titulo}</p>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        <div><p className="font-serif text-xl font-semibold text-ink">{r.qtd}</p><p className="text-[10px] uppercase text-stone">pedidos</p></div>
        <div><p className="font-serif text-xl font-semibold text-ink">{money(r.valor)}</p><p className="text-[10px] uppercase text-stone">peças</p></div>
        <div><p className="font-serif text-xl font-semibold text-wine">{money(r.total)}</p><p className="text-[10px] uppercase text-stone">total c/ frete</p></div>
      </div>
    </Card>
  );
}
