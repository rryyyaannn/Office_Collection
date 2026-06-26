import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button, Card, Field, PageTitle } from "../../components/ui";
import { POSITIONS, KITS, productById } from "../../data/seed";
import { matchPosition } from "../../lib/normalize";
import { useStore } from "../../lib/store";
import { cargoService } from "../../lib/services";

const nomePos = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p.nome]));

export default function CargosKits() {
  const aliases = useStore((s) => s.aliases || []);
  const aliasMap = Object.fromEntries(aliases.map((a) => [a.alias_norm, a.position]));
  const [teste, setTeste] = useState("Assist atendimento II MDA");
  const match = matchPosition(teste, aliasMap);

  const [texto, setTexto] = useState("");
  const [cargo, setCargo] = useState(POSITIONS[0].codigo);
  const [busy, setBusy] = useState(false);

  async function adicionar() {
    if (!texto.trim()) return;
    setBusy(true);
    try { await cargoService.addAlias(texto, cargo); setTexto(""); } finally { setBusy(false); }
  }

  return (
    <div>
      <PageTitle eyebrow="Catálogo por cargo" title="Cargos & Kits" />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-1 font-serif text-lg font-semibold">Testar normalização</h3>
          <p className="mb-3 text-[12px] text-stone">Cole um texto da planilha e veja o cargo canônico resolvido (considera as palavras-chave abaixo).</p>
          <input className="input" value={teste} onChange={(e) => setTeste(e.target.value)} />
          <p className="mt-2 text-[14px]">
            → {match ? <strong className="text-ok">{nomePos[match]}</strong> : <span className="text-wine">desconhecido (vai para a fila de exceções)</span>}
          </p>
        </Card>

        <Card>
          <h3 className="mb-1 font-serif text-lg font-semibold">Palavras-chave → cargo</h3>
          <p className="mb-3 text-[12px] text-stone">Quando a planilha trouxer um texto que não cai no cargo certo, cadastre-o aqui. A importação passa a reconhecer.</p>
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-[160px]">
              <Field label="Texto/palavra da planilha"><input className="input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="ex.: assist aten mda" /></Field>
            </div>
            <div className="min-w-[150px]">
              <Field label="Cargo">
                <select className="input" value={cargo} onChange={(e) => setCargo(e.target.value)}>
                  {POSITIONS.map((p) => <option key={p.codigo} value={p.codigo}>{p.nome}</option>)}
                </select>
              </Field>
            </div>
            <Button onClick={adicionar} disabled={busy || !texto.trim()}><Plus size={15} /> Adicionar</Button>
          </div>

          <ul className="mt-4 divide-y divide-line border-t border-line">
            {aliases.length === 0 && <li className="py-2 text-[13px] text-stone">Nenhuma palavra-chave cadastrada.</li>}
            {aliases.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2 text-[13px]">
                <span>"<span className="text-ink">{a.alias_norm}</span>" → <strong>{nomePos[a.position] || a.position}</strong></span>
                <button onClick={() => cargoService.removeAlias(a.id)} className="text-stone hover:text-wine" title="remover"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <h3 className="mb-3 mt-6 font-serif text-lg font-semibold">Kits por cargo</h3>
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
