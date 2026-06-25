import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Download, Printer, ArrowRight, ArrowLeft } from "lucide-react";
import { Button, StatusPill } from "../../components/ui";
import { useStore } from "../../lib/store";
import { orderService, erpService } from "../../lib/services";
import { POSITIONS } from "../../data/seed";

const nomePos = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p.nome]));

function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function PedidoFicha() {
  const { id } = useParams();
  const nav = useNavigate();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  const profile = useStore((s) => s.profiles.find((p) => p.id === order?.profileId));
  if (!order) return <Navigate to="/admin/pedidos" replace />;
  const rows = erpService.pedidoRows(order);
  const r0 = rows[0];

  return (
    <div>
      {/* Ações (não imprimem) */}
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => nav("/admin/pedidos")}><ArrowLeft size={15} /> Voltar</Button>
        <div className="flex flex-wrap gap-2">
          {order.status !== "entregue" && (
            <Button variant="outline" onClick={() => orderService.advance(order.id)}><ArrowRight size={15} /> Avançar status</Button>
          )}
          <Button variant="outline" onClick={() => download(`${order.numero}.csv`, erpService.toCSV(order), "text/csv")}><Download size={15} /> CSV</Button>
          <Button variant="outline" onClick={() => download(`${order.numero}.json`, erpService.toJSON(order), "application/json")}><Download size={15} /> JSON</Button>
          <Button onClick={() => window.print()}><Printer size={15} /> Imprimir / PDF</Button>
        </div>
      </div>

      {/* Ficha (imprimível) */}
      <div className="mx-auto max-w-3xl border border-line bg-white p-8">
        <div className="flex items-start justify-between border-b-2 border-wine pb-4">
          <div>
            <p className="font-serif text-xl font-semibold uppercase tracking-wide text-ink">Office <span className="italic text-wine">Collection</span></p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Ficha de pedido — Hospital Albert Einstein</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-2xl font-semibold text-wine">{order.numero}</p>
            <p className="text-[12px] text-stone">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
            <div className="mt-1"><StatusPill status={order.status} /></div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 text-[13px]">
          <Info label="Colaborador" value={profile?.nome} />
          <Info label="CPF" value={profile?.cpf} />
          <Info label="Cargo" value={nomePos[profile?.position] || "—"} />
          <Info label="Unidade (referência)" value={r0.UNIDADE} />
        </div>

        <div className="mt-4 rounded border border-line bg-cream/60 px-3 py-2 text-[13px]">
          <p className="text-[10px] uppercase tracking-wide text-stone">Entrega (Correios) — endereço do colaborador</p>
          <p className="font-medium text-ink">{r0.ENDERECO || "— endereço não informado —"}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-[13px]">
          <Info label="Faturamento (cliente / UF)" value={`${r0.CLIENTE} · ${r0.UF}`} />
          <Info label="Frete" value={r0.FRETE} />
          <Info label="PO (ordem de compra)" value={r0.PO || "—"} />
          <Info label="Rastreio Correios" value={order.rastreio || "—"} />
        </div>

        <table className="mt-6 w-full text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line text-[10px] uppercase tracking-wide text-stone">
              <th className="py-2">Kit</th><th className="py-2">Peça</th><th className="py-2">Tam</th>
              <th className="py-2">Qtd</th><th className="py-2">Estoque</th><th className="py-2">Produzir</th><th className="py-2">Bordado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="py-2">{r.KIT}</td>
                <td className="py-2">{r.PECA}</td>
                <td className="py-2">{r.TAM}</td>
                <td className="py-2">{r.QTD}</td>
                <td className="py-2">{r.ESTOQUE}</td>
                <td className="py-2">{r.PRODUZIR ? <span className="font-semibold text-wine">{r.PRODUZIR}</span> : "—"}</td>
                <td className="py-2">{r.BORDADO || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-6 border-t border-line pt-3 text-[11px] text-stone">
          Itens "Produzir" seguem para o ERP (Organiza Têxtil) — sob medida/sem estoque. Os de pronta
          entrega seguem para a expedição. Faturamento mensal consolidado por cliente.
        </p>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-stone">{label}</p>
      <p className="font-medium text-ink">{value || "—"}</p>
    </div>
  );
}
