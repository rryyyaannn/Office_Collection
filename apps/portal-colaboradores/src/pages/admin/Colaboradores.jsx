import { useState } from "react";
import { Button, Card, PageTitle, StatusPill, Modal } from "../../components/ui";
import { useStore } from "../../lib/store";
import { adminService } from "../../lib/services";
import { POSITIONS } from "../../data/seed";
import { enderecoLinha } from "../../lib/validators";

const nomePos = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p.nome]));

export default function Colaboradores() {
  const profiles = useStore((s) => s.profiles);
  const [liberar, setLiberar] = useState(null);

  return (
    <div>
      <PageTitle eyebrow="Cadastro" title={`Colaboradores (${profiles.length})`} />
      <p className="mb-4 max-w-3xl text-[13px] text-stone">
        O status vem da planilha. <strong>Aguardando Office</strong> = ainda não fizemos o cadastro manual;
        ao <strong>Liberar</strong>, o 1º acesso fica disponível (devolutiva para o hospital).
      </p>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line bg-cream text-[11px] uppercase tracking-wide text-stone">
              <th className="px-4 py-2.5">Nome</th>
              <th className="px-4 py-2.5">CPF</th>
              <th className="px-4 py-2.5">Cargo (canônico)</th>
              <th className="px-4 py-2.5">Entrega</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Acesso</th>
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
                <td className="px-4 py-2.5 text-[12px] text-stone">{p.endereco ? enderecoLinha(p.endereco) : "—"}</td>
                <td className="px-4 py-2.5"><StatusPill status={p.status} /></td>
                <td className="px-4 py-2.5 text-[12px] text-stone">{p.ativado ? "ativado" : "aguardando 1º acesso"}</td>
                <td className="px-4 py-2.5">
                  {p.status !== "liberado" && (
                    <button onClick={() => setLiberar(p)} className="text-[12px] font-semibold uppercase tracking-wide text-ok hover:underline">
                      Liberar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        open={!!liberar}
        title="Liberar colaborador"
        confirmLabel="Liberar 1º acesso"
        onClose={() => setLiberar(null)}
        onConfirm={async () => { await adminService.liberar(liberar.id); setLiberar(null); }}
      >
        Confirmar a liberação de <strong>{liberar?.nome}</strong>? O 1º acesso ficará disponível e o status passa a “Liberado”.
      </Modal>
    </div>
  );
}
