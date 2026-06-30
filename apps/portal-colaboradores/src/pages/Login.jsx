import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Logo, Button, Field } from "../components/ui";
import AddressFields from "../components/AddressFields";
import { login, firstAccessLookup, ativarConta, loginStaff } from "../lib/auth";
import { useStore } from "../lib/store";
import { supabaseEnabled } from "../lib/supabase";
import { isEmail, checaSenha, maskCpf, enderecoCompleto } from "../lib/validators";

export default function Login() {
  const session = useStore((s) => s.session);
  const nav = useNavigate();
  const [modo, setModo] = useState("login"); // login | lookup | cadastro
  const [lookup, setLookup] = useState(null); // { cpf, nome }
  if (session) return <Navigate to={session.role === "staff" ? "/admin" : "/portal"} replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center"><Logo className="items-center" /></div>
        <div className="card p-7">
          {modo === "login" && <FormLogin irPrimeiroAcesso={() => setModo("lookup")} />}
          {modo === "lookup" && <FormLookup voltar={() => setModo("login")} aoLiberar={(d) => { setLookup(d); setModo("cadastro"); }} />}
          {modo === "cadastro" && <FormCadastro lookup={lookup} nav={nav} voltar={() => setModo("login")} />}
        </div>

        {modo === "login" && (
          <div className="mt-5 text-center">
            {!supabaseEnabled && (
              <button onClick={() => { loginStaff(); nav("/admin"); }} className="text-[12px] text-ink-soft underline hover:text-wine">
                Entrar como equipe Office (mock)
              </button>
            )}
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone">
              <ShieldCheck size={13} /> Acesso restrito a colaboradores cadastrados pelo hospital.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FormLogin({ irPrimeiroAcesso }) {
  const [loginId, setLoginId] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro(""); setBusy(true);
    const r = await login(loginId, senha);
    setBusy(false);
    if (r.ok) return; // a sessão muda e o guard redireciona
    const msgs = {
      credenciais: "E-mail ou senha incorretos.",
      nao_encontrado: "Login não encontrado. Confira o e-mail/CPF.",
      sem_primeiro_acesso: "Este cadastro ainda não foi ativado. Use “Primeiro acesso”.",
      senha_invalida: "Senha incorreta.",
    };
    setErro(msgs[r.reason] || "Não foi possível entrar.");
  }

  return (
    <form onSubmit={entrar} className="space-y-4">
      <h1 className="font-serif text-xl font-semibold">Entrar</h1>
      <Field label="Login" hint="seu e-mail ou CPF">
        <input className="input" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="e-mail ou CPF" autoFocus />
      </Field>
      <Field label="Senha">
        <input type="password" className="input" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="sua senha" />
      </Field>
      {erro && <p className="text-[12px] text-wine">{erro}</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Entrando…" : "Entrar"}</Button>
      <div className="border-t border-line pt-3 text-center">
        <button type="button" onClick={irPrimeiroAcesso} className="text-[13px] font-semibold text-wine hover:underline">
          É meu primeiro acesso → ativar minha conta
        </button>
      </div>
    </form>
  );
}

function FormLookup({ voltar, aoLiberar }) {
  const [cpf, setCpf] = useState("");
  const [estado, setEstado] = useState(null);
  const [busy, setBusy] = useState(false);

  async function continuar(e) {
    e.preventDefault();
    setEstado(null); setBusy(true);
    const r = await firstAccessLookup(cpf);
    setBusy(false);
    if (r.ok) return aoLiberar({ cpf, nome: r.nome });
    setEstado(r);
  }

  return (
    <form onSubmit={continuar} className="space-y-4">
      <button type="button" onClick={voltar} className="flex items-center gap-1 text-[12px] text-stone hover:text-wine"><ArrowLeft size={14} /> Voltar</button>
      <h1 className="font-serif text-xl font-semibold">Primeiro acesso</h1>
      <p className="text-[13px] text-ink-soft">Confirme seu CPF para localizarmos seu cadastro enviado pelo hospital.</p>
      <Field label="CPF" hint="os 7 primeiros dígitos ou o CPF completo">
        <input className="input" value={cpf} onChange={(e) => setCpf(maskCpf(e.target.value))} placeholder="000.000.0…" inputMode="numeric" autoFocus />
      </Field>
      {estado?.reason === "nao_encontrado" && <p className="text-[12px] text-wine">CPF não localizado. Verifique com o seu RH/hospital.</p>}
      {estado?.reason === "aguardando" && <p className="text-[12px] text-warn">Seu cadastro está <strong>aguardando liberação da Office</strong>. Você receberá um aviso quando estiver disponível.</p>}
      {estado?.reason === "ja_ativado" && <p className="text-[12px] text-ink-soft">Este CPF já tem conta ativa. <button type="button" onClick={voltar} className="text-wine underline">Fazer login</button>.</p>}
      {estado?.reason === "erro" && <p className="text-[12px] text-wine">Não foi possível verificar agora. Tente novamente.</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Verificando…" : "Continuar"}</Button>
    </form>
  );
}

function FormCadastro({ lookup, nav, voltar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsappOptin, setOptin] = useState(true);
  const [endereco, setEndereco] = useState({});
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);

  if (!lookup) return (
    <div className="space-y-3 text-center">
      <p className="text-[13px] text-ink-soft">Sessão de cadastro expirada.</p>
      <Button variant="outline" className="w-full" onClick={voltar}>Voltar ao início</Button>
    </div>
  );

  async function concluir(e) {
    e.preventDefault();
    if (!isEmail(email)) return setErro("Informe um e-mail válido.");
    const eSenha = checaSenha(senha);
    if (eSenha) return setErro(eSenha);
    if (senha !== senha2) return setErro("As senhas não conferem.");
    if (!enderecoCompleto(endereco)) return setErro("Complete o endereço de entrega (CEP, logradouro, número, cidade e UF).");
    setErro(""); setBusy(true);
    const r = await ativarConta(lookup.cpf, { email: email.trim().toLowerCase(), senha, telefone, whatsappOptin, endereco });
    setBusy(false);
    if (r.ok) return nav("/portal");
    const msgs = { email_em_uso: "Este e-mail já está em uso.", aguardando: "Cadastro aguardando liberação.", ja_ativado: "Conta já ativada — faça login." };
    setErro(msgs[r.reason] || "Não foi possível ativar a conta.");
  }

  return (
    <form onSubmit={concluir} className="space-y-4">
      <h1 className="font-serif text-xl font-semibold">Ativar conta</h1>
      <p className="text-[13px] text-ink-soft">Olá, <strong>{lookup.nome}</strong>! Defina seu acesso e o endereço de entrega.</p>

      <Field label="E-mail (será seu login)"><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Senha" hint="mín. 6, com letras e números"><input type="password" className="input" value={senha} onChange={(e) => setSenha(e.target.value)} /></Field>
        <Field label="Repita a senha"><input type="password" className="input" value={senha2} onChange={(e) => setSenha2(e.target.value)} /></Field>
      </div>
      <Field label="Telefone / WhatsApp"><input className="input" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 9 0000-0000" /></Field>

      <div>
        <p className="label mb-1">Endereço de entrega</p>
        <p className="mb-2 text-[11px] text-stone">A entrega é na sua casa (não na unidade do hospital).</p>
        <AddressFields value={endereco} onChange={setEndereco} />
      </div>

      <label className="flex items-center gap-2 text-[12px] text-ink-soft">
        <input type="checkbox" checked={whatsappOptin} onChange={(e) => setOptin(e.target.checked)} />
        Aceito receber avisos do pedido por WhatsApp
      </label>
      {erro && <p className="text-[12px] text-wine">{erro}</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Ativando…" : "Ativar e entrar"}</Button>
    </form>
  );
}
