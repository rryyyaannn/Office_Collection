import { Link } from "react-router-dom";
import { Button, Card, PageTitle, StatusPill } from "../../components/ui";
import { currentProfile } from "../../lib/auth";
import { orderService } from "../../lib/services";
import { useStore } from "../../lib/store";
import { POSITIONS, KITS, productById } from "../../data/seed";

const posByCode = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p]));

export default function Catalogo() {
  useStore((s) => s.orders); // re-render quando pedidos mudam
  const profile = currentProfile();
  const pos = posByCode[profile.position];
  const kit = KITS[pos?.kit];
  const jaPediu = orderService.jaPediu(profile.id);

  return (
    <div>
      <PageTitle eyebrow={`Cargo: ${pos?.nome || "—"}`} title="Seu uniforme" />
      {!kit ? (
        <Card>Seu cargo ainda não tem kit configurado. Fale com o RH/Office.</Card>
      ) : (
        <Card className="max-w-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-semibold">{kit.nome}</h2>
              {kit.regra && <p className="mt-1 text-[13px] text-ink-soft">{kit.regra}</p>}
              {kit.bordado && <p className="mt-1 text-[12px] text-wine">Inclui bordado do seu nome no bolso.</p>}
            </div>
            {jaPediu ? <StatusPill status="entregue" /> : null}
          </div>

          <div className="mt-4 space-y-4 border-y border-line py-4">
            {kit.slots.map((slot, i) => (
              <div key={i}>
                <p className="mb-2 text-[13px] font-medium text-ink">{slot.label}{slot.max > 1 ? ` — escolha ${slot.max}` : ""}</p>
                <div className="flex flex-wrap gap-3">
                  {slot.produtos.map((id) => {
                    const p = productById[id];
                    return (
                      <div key={id} className="w-36 rounded border border-line p-2 text-center">
                        <div className="flex items-end justify-center gap-1">
                          <img src={p.foto} alt={`${p.nome} frente`} className="h-24 w-auto" />
                          {p.fotoCostas && <img src={p.fotoCostas} alt={`${p.nome} costas`} className="h-20 w-auto opacity-80" />}
                        </div>
                        {p.fotoCostas && <p className="text-[9px] uppercase tracking-wide text-stone">frente · costas</p>}
                        <p className="mt-1 text-[11px] font-medium leading-tight text-ink">{p.nome}</p>
                        <p className="text-[10px] text-stone">{p.tecido}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            {jaPediu ? (
              <p className="text-[13px] text-ink-soft">
                Você já tem um pedido neste ciclo. Acompanhe em{" "}
                <Link to="/loja/meus-pedidos" className="text-wine underline">Meus pedidos</Link>.
              </p>
            ) : (
              <Button as={Link} to="/loja/pedido">Fazer meu pedido</Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
