import { useState } from "react";
import { Button, Card, Field, PageTitle, Modal } from "../../components/ui";
import AddressFields from "../../components/AddressFields";
import { currentProfile, updateConta } from "../../lib/auth";
import { useStore } from "../../lib/store";
import { isEmail, checaSenha, enderecoCompleto, enderecoLinha } from "../../lib/validators";

export default function MinhaConta() {
  useStore((s) => s.profiles); // re-render ao salvar
  const p = currentProfile();
  const [confirm, setConfirm] = useState(null); // { titulo, texto, acao }
  const [okMsg, setOkMsg] = useState("");

  const [busy, setBusy] = useState(false);
  const pedir = (titulo, texto, acao) => { setOkMsg(""); setConfirm({ titulo, texto, acao }); };
  const executar = async () => { setBusy(true); try { await confirm.acao(); setConfirm(null); setOkMsg("Dados atualizados com sucesso."); } finally { setBusy(false); } };

  return (
    <div className="max-w-2xl">
      <PageTitle eyebrow="Seus dados" title="Minha conta" />
      {okMsg && <p className="mb-4 rounded border border-ok/30 bg-ok/10 px-3 py-2 text-[13px] text-ok">{okMsg}</p>}

      <div className="space-y-5">
        <BlocoEmail p={p} pedir={pedir} />
        <BlocoSenha p={p} pedir={pedir} />
        <BlocoEndereco p={p} pedir={pedir} />
      </div>

      <Modal
        open={!!confirm}
        title={confirm?.titulo}
        onClose={() => setConfirm(null)}
        onConfirm={executar}
        confirmLabel="Salvar alteração"
        busy={busy}
      >
        {confirm?.texto}
      </Modal>
    </div>
  );
}

function BlocoEmail({ p, pedir }) {
  const [email, setEmail] = useState(p.email || "");
  const [erro, setErro] = useState("");
  const mudou = email.trim().toLowerCase() !== (p.email || "");
  function salvar() {
    setErro("");
    if (!isEmail(email)) return setErro("E-mail inválido.");
    pedir("Confirmar novo e-mail", `Seu login passará a ser ${email.trim().toLowerCase()}.`, () => updateConta(p.id, { email: email.trim().toLowerCase() }));
  }
  return (
    <Card>
      <h3 className="mb-3 font-serif text-lg font-semibold">E-mail (login)</h3>
      <Field label="E-mail"><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      {erro && <p className="mt-2 text-[12px] text-wine">{erro}</p>}
      <div className="mt-3"><Button variant="outline" disabled={!mudou} onClick={salvar}>Atualizar e-mail</Button></div>
    </Card>
  );
}

function BlocoSenha({ p, pedir }) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [nova2, setNova2] = useState("");
  const [erro, setErro] = useState("");
  function salvar() {
    setErro("");
    if (atual !== p.senha) return setErro("Senha atual incorreta.");
    const e = checaSenha(nova);
    if (e) return setErro(e);
    if (nova !== nova2) return setErro("A confirmação não confere.");
    pedir("Confirmar troca de senha", "Você usará a nova senha no próximo login.", () => { updateConta(p.id, { senha: nova }); setAtual(""); setNova(""); setNova2(""); });
  }
  return (
    <Card>
      <h3 className="mb-3 font-serif text-lg font-semibold">Senha</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Senha atual"><input type="password" className="input" value={atual} onChange={(e) => setAtual(e.target.value)} /></Field>
        <Field label="Nova senha"><input type="password" className="input" value={nova} onChange={(e) => setNova(e.target.value)} /></Field>
        <Field label="Repita a nova"><input type="password" className="input" value={nova2} onChange={(e) => setNova2(e.target.value)} /></Field>
      </div>
      {erro && <p className="mt-2 text-[12px] text-wine">{erro}</p>}
      <div className="mt-3"><Button variant="outline" disabled={!atual || !nova} onClick={salvar}>Trocar senha</Button></div>
    </Card>
  );
}

function BlocoEndereco({ p, pedir }) {
  const [endereco, setEndereco] = useState(p.endereco || {});
  const [erro, setErro] = useState("");
  function salvar() {
    setErro("");
    if (!enderecoCompleto(endereco)) return setErro("Complete o endereço (CEP, logradouro, número, cidade e UF).");
    pedir("Confirmar endereço de entrega", `Os próximos pedidos serão enviados para: ${enderecoLinha(endereco)}`, () => updateConta(p.id, { endereco }));
  }
  return (
    <Card>
      <h3 className="mb-1 font-serif text-lg font-semibold">Endereço de entrega</h3>
      <p className="mb-3 text-[12px] text-stone">A entrega é na sua casa — mantenha sempre atualizado.</p>
      <AddressFields value={endereco} onChange={setEndereco} />
      {erro && <p className="mt-2 text-[12px] text-wine">{erro}</p>}
      <div className="mt-3"><Button variant="outline" onClick={salvar}>Salvar endereço</Button></div>
    </Card>
  );
}
