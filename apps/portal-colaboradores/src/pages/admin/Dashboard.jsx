import { Link } from "react-router-dom";
import { Card, PageTitle } from "../../components/ui";
import { useStore } from "../../lib/store";

function Stat({ n, label, to }) {
  const body = (
    <Card className="text-center">
      <p className="font-serif text-3xl font-semibold text-wine">{n}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-stone">{label}</p>
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

export default function Dashboard() {
  const s = useStore((x) => x);
  const liberados = s.profiles.filter((p) => p.status === "liberado").length;
  const aguardando = s.profiles.filter((p) => p.status === "aguardando").length;
  const pendentes = s.orders.filter((o) => o.status !== "entregue" && o.status !== "cancelado").length;

  return (
    <div>
      <PageTitle eyebrow="Back-office · Einstein" title="Painel" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat n={s.profiles.length} label="Colaboradores" to="/admin/colaboradores" />
        <Stat n={liberados} label="Liberados" to="/admin/colaboradores" />
        <Stat n={aguardando} label="Aguardando Office" to="/admin/colaboradores" />
        <Stat n={pendentes} label="Pedidos em andamento" to="/admin/pedidos" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-serif text-lg font-semibold">Comece por aqui</h3>
          <ol className="list-decimal space-y-1 pl-5 text-[14px] text-ink-soft">
            <li><Link to="/admin/importacoes" className="text-wine underline">Importações</Link> — rode a importação de teste (simula a planilha).</li>
            <li>Saia e entre como um colaborador (CPF) para fazer um pedido.</li>
            <li>Volte aqui em <Link to="/admin/pedidos" className="text-wine underline">Pedidos</Link> para ver a ficha/exportar e avançar o status.</li>
          </ol>
        </Card>
        <Card>
          <h3 className="mb-2 font-serif text-lg font-semibold">Notificações (WhatsApp · mock)</h3>
          {s.notifications.length === 0 ? (
            <p className="text-[13px] text-stone">Nenhuma ainda. Elas aparecem ao criar/avançar pedidos.</p>
          ) : (
            <ul className="space-y-2 text-[13px]">
              {s.notifications.slice(0, 5).map((n) => (
                <li key={n.id} className="border-b border-line pb-2">
                  <span className="text-[10px] uppercase tracking-wide text-stone">{n.template}</span>
                  <p className="text-ink-soft">{n.texto}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
