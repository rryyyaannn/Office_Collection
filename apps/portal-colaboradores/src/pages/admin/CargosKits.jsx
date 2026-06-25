import { useState } from "react";
import { Card, Field, PageTitle } from "../../components/ui";
import { POSITIONS, KITS, productById } from "../../data/seed";
import { matchPosition } from "../../lib/normalize";

const nomePos = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p.nome]));

export default function CargosKits() {
  const [teste, setTeste] = useState("Assist atendimento II MDA");
  const match = matchPosition(teste);

  return (
    <div>
      <PageTitle eyebrow="Catálogo por cargo" title="Cargos & Kits" />

      <Card className="mb-5 max-w-lg">
        <Field label="Testar normalização de cargo" hint="Cole um texto da planilha e veja o cargo canônico resolvido.">
          <input className="input" value={teste} onChange={(e) => setTeste(e.target.value)} />
        </Field>
        <p className="mt-2 text-[14px]">
          → {match ? <strong className="text-ok">{nomePos[match]}</strong> : <span className="text-wine">desconhecido (vai para a fila de exceções)</span>}
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {POSITIONS.map((pos) => {
          const kit = KITS[pos.kit];
          return (
            <Card key={pos.codigo}>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold">{pos.nome}</h3>
                <code className="text-[11px] text-stone">{pos.codigo}</code>
              </div>
              {kit ? (
                <div className="mt-2">
                  <p className="text-[13px] font-medium text-ink">{kit.nome}{kit.bordado && <span className="text-wine"> · bordado</span>}</p>
                  <ul className="mt-1 text-[12.5px] text-stone">
                    {kit.slots.map((s, i) => (
                      <li key={i}>{s.label}: {s.produtos.map((id) => productById[id]?.nome).join(" / ")}{s.max > 1 ? ` (${s.max}x)` : ""}</li>
                    ))}
                  </ul>
                </div>
              ) : <p className="mt-2 text-[12px] text-wine">sem kit</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
