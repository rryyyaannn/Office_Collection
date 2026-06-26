import { useLocation } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { Card, PageTitle, StatusPill } from "../../components/ui";
import { currentProfile } from "../../lib/auth";
import { useStore } from "../../lib/store";
import { productById, WHATSAPP_PEDIDOS } from "../../data/seed";

export default function MeusPedidos() {
  const profile = currentProfile();
  const orders = useStore((s) => s.orders.filter((o) => o.profileId === profile.id));
  const novo = useLocation().state?.novo;

  return (
    <div>
      <PageTitle eyebrow="Acompanhamento" title="Meus pedidos" />

      {novo && (
        <div className="mb-4 flex items-start gap-3 rounded border border-ok/30 bg-ok/10 p-4">
          <CheckCircle2 size={20} className="mt-0.5 text-ok" />
          <div className="text-[13px]">
            <p className="font-medium text-ink">Pedido <strong>{novo}</strong> registrado! Avisaremos o envio por WhatsApp.</p>
            <p className="mt-1 text-stone">
              Precisa corrigir endereço, tamanho ou o nome do bordado? Fale com a Office no WhatsApp{" "}
              <a href={`https://wa.me/55${WHATSAPP_PEDIDOS.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="font-semibold text-wine underline">
                {WHATSAPP_PEDIDOS}
              </a>{" "}informando o número do pedido.
            </p>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <Card>Você ainda não fez nenhum pedido.</Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.id}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div>
                  <span className="font-serif text-lg font-semibold">{o.numero}</span>
                  <span className="ml-3 text-[12px] text-stone">{new Date(o.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
                <StatusPill status={o.status} />
              </div>
              <ul className="mt-3 space-y-1.5 text-[14px]">
                {o.items.map((it, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span>
                      {productById[it.productId]?.nome} · tam {it.tamanho} · {it.qtd}x
                      {it.bordadoNome && <span className="text-wine"> · bordado: {it.bordadoNome}</span>}
                    </span>
                    <span className="text-[11px] text-stone">{it.sobMedida ? "produção (sob medida)" : "pronta entrega"}</span>
                  </li>
                ))}
              </ul>
              {o.rastreio && <p className="mt-3 text-[13px] text-navy">Rastreio Correios: <strong>{o.rastreio}</strong></p>}
              {o.status === "entregue" && (
                <p className="mt-2 text-[12px] text-stone">Pedido entregue — novo pedido bloqueado até o próximo ciclo.</p>
              )}
              <p className="mt-3 flex items-center gap-1.5 border-t border-line pt-2 text-[11px] text-stone">
                <MessageCircle size={13} /> Algo errado? Ajustes com a Office: WhatsApp {WHATSAPP_PEDIDOS} (informe {o.numero}).
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
