// Fachada de auth. Delega ao Supabase quando VITE_DATA_SOURCE=supabase; senão usa o mock.
import { getState, setState } from "./store";
import { onlyDigits } from "./validators";
import { supabaseEnabled } from "./supabase";
import * as db from "./db";

// ---- helpers do mock ----
export function findByCpf(cpf) {
  const d = onlyDigits(cpf);
  if (d.length < 7) return null;
  const sete = d.slice(0, 7);
  return getState().profiles.find((p) => onlyDigits(p.cpf).slice(0, 7) === sete) || null;
}
function findByLogin(login) {
  const v = (login || "").trim().toLowerCase();
  if (!v) return null;
  if (v.includes("@")) return getState().profiles.find((p) => (p.email || "").toLowerCase() === v) || null;
  return findByCpf(v);
}

// ---- API (assíncrona nos dois modos) ----
export function currentProfile() {
  const s = getState();
  return s.session?.profileId ? s.profiles.find((p) => p.id === s.session.profileId) : null;
}

export async function login(loginId, senha) {
  if (supabaseEnabled) {
    const r = await db.loginEmail(loginId, senha);
    return r.ok ? r : { ok: false, reason: "credenciais" };
  }
  const p = findByLogin(loginId);
  if (!p) return { ok: false, reason: "nao_encontrado" };
  if (!p.ativado) return { ok: false, reason: "sem_primeiro_acesso" };
  if (p.senha !== senha) return { ok: false, reason: "senha_invalida" };
  setState((s) => ({ ...s, session: { role: "colaborador", profileId: p.id } }));
  return { ok: true };
}

export async function firstAccessLookup(cpf) {
  if (supabaseEnabled) return db.firstAccessCheck(cpf);
  const p = findByCpf(cpf);
  if (!p) return { ok: false, reason: "nao_encontrado" };
  if (p.status !== "liberado") return { ok: false, reason: "aguardando" };
  if (p.ativado) return { ok: false, reason: "ja_ativado" };
  return { ok: true, nome: p.nome };
}

export async function ativarConta(cpf, dados) {
  if (supabaseEnabled) return db.ativarConta(cpf, dados);
  const p = findByCpf(cpf);
  if (!p) return { ok: false, reason: "nao_encontrado" };
  setState((s) => ({
    ...s,
    profiles: s.profiles.map((x) => (x.id === p.id ? { ...x, ativado: true, ...dados } : x)),
    session: { role: "colaborador", profileId: p.id },
  }));
  return { ok: true };
}

export async function updateConta(profileId, patch) {
  if (supabaseEnabled) return db.updateConta(profileId, patch);
  setState((s) => ({ ...s, profiles: s.profiles.map((x) => (x.id === profileId ? { ...x, ...patch } : x)) }));
  return { ok: true };
}

export async function logout() {
  if (supabaseEnabled) return db.logout();
  setState((s) => ({ ...s, session: null }));
}

// staff: no modo Supabase entra pelo login normal (e-mail+senha). Mock mantém atalho local.
export async function loginStaff() {
  setState((s) => ({ ...s, session: { role: "staff" } }));
}
