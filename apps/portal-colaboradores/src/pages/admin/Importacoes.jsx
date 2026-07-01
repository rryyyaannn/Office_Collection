import { useMemo, useState } from "react";
import { Trash2, ClipboardPaste, Upload } from "lucide-react";
import { Button, Card, PageTitle, StatusPill } from "../../components/ui";
import { importService } from "../../lib/services";
import { useStore } from "../../lib/store";
import { TEST_ROWS } from "../../data/seed";
import { matchPosition, normCPF } from "../../lib/normalize";

const CAMPOS = [
  ["colaborador", "Colaborador"],
  ["cpf", "CPF"],
  ["cargo", "Cargo"],
  ["unidade", "Unidade"],
  ["status", "Status"],
];
const strip = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
// palpite automático de qual coluna é cada campo (pelos nomes de cabeçalho da planilha)
const GUESS = {
  colaborador: ["colaborador", "nome", "nome do medico"],
  cpf: ["cpf", "chave", "codigo funcional", "crm"],
  cargo: ["cargo"],
  unidade: ["unidade", "centro_custo", "centro custo", "area"],
  status: ["status"],
};

function parseTable(text) {
  const linhas = text.replace(/\r/g, "").split("\n").filter((l) => l.trim() !== "");
  if (!linhas.length) return { headers: [], rows: [] };
  const delim = linhas[0].includes("\t") ? "\t" : linhas[0].includes(";") ? ";" : ",";
  const cells = (l) => l.split(delim).map((c) => c.trim());
  return { headers: cells(linhas[0]), rows: linhas.slice(1).map(cells) };
}
function autoMap(headers) {
  const m = {};
  for (const [f] of CAMPOS) {
    const i = headers.findIndex((h) => GUESS[f].some((g) => strip(h) === g || strip(h).startsWith(g)));
    m[f] = i;
  }
  return m;
}

export default function Importacoes() {
  const imports = useStore((s) => s.imports);
  const aliases = useStore((s) => s.aliases || []);
  const aliasMap = Object.fromEntries(aliases.map((a) => [a.alias_norm, a.position]));
  const [raw, setRaw] = useState("");
  const [linhas, setLinhas] = useState([]); // [{colaborador,cpf,cargo,unidade,status}]
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);
  const [okMsg, setOkMsg] = useState("");

  function processar(text) {
    setErro(""); setOkMsg("");
    const { headers, rows } = parseTable(text);
    if (!rows.length) return setErro("Nada para processar. Cole as linhas (com cabeçalho) ou envie um arquivo.");
    const m = autoMap(headers);
    const out = rows.map((r) => ({
      colaborador: m.colaborador >= 0 ? r[m.colaborador] || "" : "",
      cpf: m.cpf >= 0 ? r[m.cpf] || "" : "",
      cargo: m.cargo >= 0 ? r[m.cargo] || "" : "",
      unidade: m.unidade >= 0 ? r[m.unidade] || "" : "",
      status: m.status >= 0 ? r[m.status] || "" : "",
    }));
    setLinhas(out);
  }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { setRaw(String(rd.result)); processar(String(rd.result)); };
    rd.readAsText(f, "utf-8");
  }

  const setCell = (i, f, v) => setLinhas((ls) => ls.map((r, idx) => (idx === i ? { ...r, [f]: v } : r)));
  const delRow = (i) => setLinhas((ls) => ls.filter((_, idx) => idx !== i));

  // pré-visualização: cada linha vira ok ou exceção (mesma regra do importador)
  const preview = useMemo(() => linhas.map((r) => {
    const cpf = normCPF(r.cpf); const cargo = matchPosition(r.cargo, aliasMap);
    return { ...r, _cpfOk: !!cpf, _cargo: cargo, _ok: !!cpf && !!cargo, _motivo: !cpf ? "CPF inválido" : !cargo ? "cargo desconhecido" : "" };
  }), [linhas, aliasMap]);
  const nOk = preview.filter((p) => p._ok).length;

  async function importar() {
    setBusy(true); setErro(""); setOkMsg("");
    try {
      const rows = linhas.map((r) => ({ COLABORADOR: r.colaborador, CPF: r.cpf, CARGO: r.cargo, UNIDADE: r.unidade, STATUS: r.status }));
      const res = await importService.run(rows, "manual");
      setOkMsg(`Importado: ${res?.ok ?? nOk} ok · ${res?.erros ?? preview.length - nOk} exceções.`);
      setLinhas([]); setRaw("");
    } catch { setErro("Falha ao importar. Tente novamente."); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <PageTitle eyebrow="Ingestão" title="Importar cadastros">
        <Button variant="outline" onClick={() => importService.run(TEST_ROWS, "teste")}>Dados de teste</Button>
      </PageTitle>

      <Card className="mb-5">
        <h3 className="mb-2 font-serif text-lg font-semibold">1. Traga as linhas da planilha</h3>
        <p className="mb-2 text-[12px] text-stone">
          Copie as células no Excel (com o cabeçalho) e <strong>cole abaixo</strong>, ou envie um
          <strong> CSV</strong>. Reconhecemos as colunas automaticamente (Colaborador/Nome, CPF/Chave, Cargo, Unidade, Status).
        </p>
        <textarea
          className="input h-32 w-full resize-none py-2 font-mono text-[12px]"
          placeholder="Cole aqui (Ctrl+V) as linhas copiadas do Excel…"
          value={raw} onChange={(e) => setRaw(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button onClick={() => processar(raw)} disabled={!raw.trim()}><ClipboardPaste size={15} /> Processar colado</Button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-ink/40 px-4 py-2 text-[13px] font-semibold uppercase tracking-wide text-ink hover:bg-ink hover:text-white">
            <Upload size={15} /> Enviar CSV
            <input type="file" accept=".csv,.tsv,.txt" className="hidden" onChange={onFile} />
          </label>
          {erro && <span className="text-[12px] text-wine">{erro}</span>}
        </div>
      </Card>

      {linhas.length > 0 && (
        <Card className="mb-5 p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
            <h3 className="font-serif text-lg font-semibold">2. Confira, edite e importe ({linhas.length} linhas)</h3>
            <div className="flex items-center gap-3 text-[12px]">
              <span className="text-ok">{nOk} ok</span>
              <span className="text-wine">{preview.length - nOk} exceções</span>
              <Button onClick={importar} disabled={busy}>{busy ? "Importando…" : `Importar ${linhas.length}`}</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-line bg-cream text-[11px] uppercase tracking-wide text-stone">
                  <th className="px-3 py-2">Colaborador</th><th className="px-3 py-2">CPF</th>
                  <th className="px-3 py-2">Cargo (texto)</th><th className="px-3 py-2">Unidade</th>
                  <th className="px-3 py-2">Status</th><th className="px-3 py-2">Resultado</th><th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {preview.map((p, i) => (
                  <tr key={i} className={`border-b border-line/60 ${p._ok ? "" : "bg-wine/5"}`}>
                    {CAMPOS.map(([f]) => (
                      <td key={f} className="px-2 py-1">
                        <input className="input w-full py-1 text-[12px]" value={linhas[i][f]} onChange={(e) => setCell(i, f, e.target.value)} />
                      </td>
                    ))}
                    <td className="px-3 py-1 text-[11px]">
                      {p._ok ? <span className="text-ok">✓ {p._cargo}</span> : <span className="text-wine">{p._motivo}</span>}
                    </td>
                    <td className="px-2 py-1">
                      <button onClick={() => delRow(i)} className="text-stone hover:text-wine" title="excluir linha"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {okMsg && <p className="mb-4 rounded border border-ok/30 bg-ok/10 px-3 py-2 text-[13px] text-ok">{okMsg}</p>}

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
                      <span className="truncate">{r.raw.COLABORADOR} — <span className="text-stone">"{r.raw.CARGO}"</span>{r.cargo && <span className="text-ok"> → {r.cargo}</span>}</span>
                      <span className="flex items-center gap-2 whitespace-nowrap"><StatusPill status={r.status} />{r.motivo && <span className="text-[10px] text-wine">{r.motivo}</span>}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
