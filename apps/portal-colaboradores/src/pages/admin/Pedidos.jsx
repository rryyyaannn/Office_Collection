import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Field, PageTitle, StatusPill, Modal } from "../../components/ui";
import { useStore } from "../../lib/store";
import { orderService } from "../../lib/services";

const SEQ = ["recebido", "em_separacao", "despachado", "entregue"];
const proximo = (st) => SEQ[Math.min(SEQ.indexOf(st) + 1, SEQ.length - 1)];
const LABEL = { recebido: "Iniciar separação", em_separacao: "Despachar", despachado: "Marcar entregue" };

export default function Pedidos() {
  const orders = useStore((s) => s.orders);
  const profiles = useStore((s) => s.profiles);
  const nomeOf = (id) => profiles.find((p) => p.id === id)?.nome || "—";
  const [despacho, setDespacho] = useState(null); // pedido a despachar
  const [rastreio, setRastreio] = useState("");

  async function avancar(o) {
    if (proximo(o.status) === "despachado") { setRastreio(""); setDespacho(o); return; }
    await orderService.advance(o.id);
  }

  return (
    <div>
      <PageTitle eyebrow="Operação" title={`Pedidos (${orders.length})`} />
      {orders.length === 0 ? (
        <Card>Nenhum pedido ainda. Entre como colaborador e faça um pedido.</Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-line bg-cream text-[11px] uppercase tracking-wide text-stone">
                <th className="px-4 py-2.5">Pedido</th>
                <th className="px-4 py-2.5">Colaborador</th>
                <th className="px-4 py-2.5">Itens</th>
                <th className="px-4 py-2.5">Rastreio</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line/70">
                  <td className="px-4 py-2.5 font-medium">{o.numero}</td>
                  <td className="px-4 py-2.5">{nomeOf(o.profileId)}</td>
                  <td className="px-4 py-2.5 text-stone">
                    {o.items.length} · {o.items.some((i) => i.sobMedida) ? "tem produção" : "pronta entrega"}
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-stone">{o.rastreio || "—"}</td>
                  <td className="px-4 py-2.5"><StatusPill status={o.status} /></td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-3">
                      {o.status !== "entregue" && (
                        <button onClick={() => avancar(o)} className="text-[12px] font-semibold uppercase tracking-wide text-navy hover:underline">
                          {LABEL[o.status]}
                        </button>
                      )}
                      <Link to={`/admin/pedido/${o.id}`} className="text-[12px] font-semibold uppercase tracking-wide text-wine hover:underline">
                        Ficha →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={!!despacho}
        title={`Despachar ${despacho?.numero || ""}`}
        confirmLabel="Despachar e notificar"
        onClose={() => setDespacho(null)}
        onConfirm={async () => { await orderService.advance(despacho.id, rastreio); setDespacho(null); }}
      >
        <p className="mb-3">Informe o código de rastreio dos Correios. O colaborador é avisado no WhatsApp com esse código.</p>
        <Field label="Rastreio Correios" hint="deixe em branco para gerar um código de teste">
          <input className="input" value={rastreio} onChange={(e) => setRastreio(e.target.value.toUpperCase())} placeholder="AB123456789BR" />
        </Field>
      </Modal>
    </div>
  );
}
