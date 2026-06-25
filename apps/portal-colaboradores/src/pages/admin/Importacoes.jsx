import { useState } from "react";
import { Button, Card, PageTitle, StatusPill } from "../../components/ui";
import { importService } from "../../lib/services";
import { useStore } from "../../lib/store";
import { TEST_ROWS } from "../../data/seed";

export default function Importacoes() {
  const imports = useStore((s) => s.imports);
  const [json, setJson] = useState(JSON.stringify(TEST_ROWS, null, 2));
  const [erro, setErro] = useState("");

  async function rodar(rows) {
    setErro("");
    try {
      await importService.run(rows, "teste");
    } catch (e) {
      setErro("Falha ao importar. Confira o JSON / conexão.");
    }
  }

  return (
    <div>
      <PageTitle eyebrow="Ingestão" title="Importações da planilha">
        <Button onClick={() => rodar(TEST_ROWS)}>Rodar importação de teste</Button>
      </PageTitle>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-serif text-lg font-semibold">Linhas (simula a planilha)</h3>
          <p className="mb-2 text-[12px] text-stone">
            Cole linhas no formato da planilha (COLABORADOR, CPF, CARGO, UNIDADE, STATUS). Inclui um
            cargo "bagunçado" e um desconhecido para demonstrar normalização e fila de exceções.
          </p>
          <textarea className="input h-64 w-full resize-none py-2 font-mono text-[12px]" value={json} onChange={(e) => setJson(e.target.value)} />
          {erro && <p className="mt-2 text-[12px] text-wine">{erro}</p>}
          <div className="mt-3 flex gap-2">
            <Button variant="outline" onClick={() => { try { rodar(JSON.parse(json)); } catch { setErro("JSON inválido."); } }}>
              Importar estas linhas
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 font-serif text-lg font-semibold">Histórico</h3>
          {imports.length === 0 ? (
            <p className="text-[13px] text-stone">Nenhuma importação ainda.</p>
          ) : (
            <div className="space-y-4">
              {imports.map((imp) => (
                <div key={imp.id} className="border border-line p-3">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-stone">{new Date(imp.createdAt).toLocaleString("pt-BR")} · {imp.fonte}</span>
                    <span>{imp.ok} ok · <span className="text-wine">{imp.erros} exceções</span></span>
                  </div>
                  <ul className="mt-2 space-y-1 text-[12.5px]">
                    {imp.rows.map((r, i) => (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span className="truncate">
                          {r.raw.COLABORADOR} — <span className="text-stone">"{r.raw.CARGO}"</span>
                          {r.cargo && <span className="text-ok"> → {r.cargo}</span>}
                        </span>
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <StatusPill status={r.status} />
                          {r.motivo && <span className="text-[10px] text-wine">{r.motivo}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
