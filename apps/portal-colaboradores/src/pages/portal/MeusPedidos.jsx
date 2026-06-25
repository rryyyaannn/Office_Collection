import { Card, PageTitle, StatusPill } from "../../components/ui";
import { currentProfile } from "../../lib/auth";
import { useStore } from "../../lib/store";
import { productById } from "../../data/seed";

export default function MeusPedidos() {
  const profile = currentProfile();
  const orders = useStore((s) => s.orders.filter((o) => o.profileId === profile.id));

  return (
    <div>
      <PageTitle eyebrow="Acompanhamento" title="Meus pedidos" />
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
              {o.rastreio && (
                <p className="mt-3 text-[13px] text-navy">Rastreio Correios: <strong>{o.rastreio}</strong></p>
              )}
              {o.status === "entregue" && (
                <p className="mt-2 text-[12px] text-stone">Pedido entregue — novo pedido bloqueado até o próximo ciclo.</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
