// Store mock reativa (localStorage). Troca por Supabase depois (VITE_DATA_SOURCE).
import { useSyncExternalStore } from "react";
import { COLABORADORES_SEED, POSITIONS } from "../data/seed";
import { matchPosition } from "./normalize";

const KEY = "oc-portal-state-v2"; // v2: status liberado/aguardando, endereço, login e-mail/CPF
const codeByPos = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p]));

function seedProfiles() {
  return COLABORADORES_SEED.map((c, i) => ({
    id: "p_seed_" + i,
    cpf: c.cpf,
    nome: c.nome,
    position: matchPosition(c.cargoTxt),
    cargoTxt: c.cargoTxt,
    unidade: c.unidade,
    status: c.status || "aguardando", // "liberado" | "aguardando"
    ativado: c.ativado || false,
    senha: c.senha || null,
    email: c.email || null,
    telefone: c.telefone || null,
    whatsappOptin: c.whatsappOptin || false,
    endereco: c.endereco || null,
  }));
}

function initialState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { profiles: seedProfiles(), orders: [], imports: [], notifications: [], session: null };
}

let state = initialState();
const listeners = new Set();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}
export function setState(patch) {
  state = typeof patch === "function" ? patch(state) : { ...state, ...patch };
  persist();
  listeners.forEach((l) => l());
}
export function getState() { return state; }
function subscribe(l) { listeners.add(l); return () => listeners.delete(l); }
// Assina o `state` inteiro (identidade só muda em setState). O seletor roda no render,
// então seletores com .filter()/.map() são seguros (não viram o snapshot do store).
export function useStore(selector = (s) => s) {
  const snap = useSyncExternalStore(subscribe, getState, getState);
  return selector(snap);
}

export function resetStore() {
  state = { profiles: seedProfiles(), orders: [], imports: [], notifications: [], session: null };
  persist();
  listeners.forEach((l) => l());
}

export const uid = (p = "") => p + Math.random().toString(36).slice(2, 9);
