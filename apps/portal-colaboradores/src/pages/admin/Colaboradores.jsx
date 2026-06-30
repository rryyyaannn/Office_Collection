import { useState } from "react";
import { Card, PageTitle, StatusPill, Modal, Field } from "../../components/ui";
import { useStore } from "../../lib/store";
import { adminService } from "../../lib/services";
import { POSITIONS } from "../../data/seed";
import { enderecoLinha } from "../../lib/validators";

const nomePos = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p.nome]));

export default function Colaboradores() {
  const profiles = useStore((s) => s.profiles);
  const [liberar, setLiberar] = useState(null);
  const [excecao, setExcecao] = useState(null); // profile em edição de regras
  const [kitQtd, setKitQtd] = useState("");
  const [repedido, setRepedido] = useState(false);
  const [busy, setBusy] = useState(false);

  function abrirExcecao(p) {
    setKitQtd(p.regras?.kit_qtd ?? ""); setRepedido(!!p.regras?.repedido); setExcecao(p);
  }
  async function salvarExcecao() {
    setBusy(true);
    const regras = {};
    if (String(kitQtd).trim() !== "") regras.kit_qtd = Number(kitQtd);
    if (repedido) regras.repedido = true;
    try { await adminService.setRegras(excecao.id, regras); } finally { setBusy(false); setExcecao(null); }
  }
  const temExcecao = (p) => p.regras && (p.regras.kit_qtd != null || p.regras.repedido);

  return (
    <div>
      <PageTitle eyebrow="Cadastro" title={`Colaboradores (${profiles.length})`} />
      <p className="mb-4 max-w-3xl text-[13px] text-stone">
        O status vem da planilha. <strong>Aguardando Office</strong> = ainda não fizemos o cadastro manual;
        ao <strong>Liberar</strong>, o 1º acesso fica disponível. Em <strong>Exceção</strong> você ajusta
        regras por colaborador (ex.: médico levar 1 jaleco, ou liberar um 2º pedido).
      </p>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line bg-cream text-[11px] uppercase tracking-wide text-stone">
              <th className="px-4 py-2.5">Nome</th>
              <th className="px-4 py-2.5">CPF</th>
              <th className="px-4 py-2.5">Cargo (canônico)</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Acesso</th>
              <th className="px-4 py-2.5">Exceção</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-line/70 align-top">
                <td className="px-4 py-2.5 font-medium text-ink">{p.nome}</td>
                <td className="px-4 py-2.5 text-stone">{p.cpf}</td>
                <td className="px-4 py-2.5">
                  {p.position ? nomePos[p.position] : <span className="text-wine">— sem cargo —</span>}
                  {p.cargoTxt && <span className="block text-[11px] text-stone">"{p.cargoTxt}"</span>}
                </td>
                <td className="px-4 py-2.5"><StatusPill status={p.status} /></td>
                <td className="px-4 py-2.5 text-[12px] text-stone">{p.ativado ? "ativado" : "aguardando 1º acesso"}</td>
                <td className="px-4 py-2.5 text-[11px] text-stone">
                  {temExcecao(p) ? (
                    <span className="text-wine">
                      {p.regras.kit_qtd != null && `kit: ${p.regras.kit_qtd} `}
                      {p.regras.repedido && "re-pedido"}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-3">
                    {p.status !== "liberado" && (
                      <button onClick={() => setLiberar(p)} className="text-[12px] font-semibold uppercase tracking-wide text-ok hover:underline">Liberar</button>
                    )}
                    <button onClick={() => abrirExcecao(p)} className="text-[12px] font-semibold uppercase tracking-wide text-navy hover:underline">Exceção</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!liberar} title="Liberar colaborador" confirmLabel="Liberar 1º acesso"
        onClose={() => setLiberar(null)}
        onConfirm={async () => { await adminService.liberar(liberar.id); setLiberar(null); }}>
        Confirmar a liberação de <strong>{liberar?.nome}</strong>? O 1º acesso ficará disponível e o status passa a “Liberado”.
      </Modal>

      <Modal open={!!excecao} title={`Exceções — ${excecao?.nome || ""}`} confirmLabel="Salvar exceção" busy={busy}
        onClose={() => setExcecao(null)} onConfirm={salvarExcecao}>
        <p className="mb-3 text-[12px] text-stone">Estas regras valem só para este colaborador e sobrepõem a regra padrão do cargo.</p>
        <Field label="Quantidade do kit (vazio = padrão do cargo)" hint="ex.: médico autorizado a levar 1 jaleco">
          <input className="input" value={kitQtd} inputMode="numeric" onChange={(e) => setKitQtd(e.target.value.replace(/\D/g, ""))} placeholder="padrão" />
        </Field>
        <label className="mt-3 flex items-center gap-2 text-[13px] text-ink-soft">
          <input type="checkbox" checked={repedido} onChange={(e) => setRepedido(e.target.checked)} />
          Liberar novo pedido (re-pedido autorizado pelo hospital)
        </label>
      </Modal>
    </div>
  );
}
