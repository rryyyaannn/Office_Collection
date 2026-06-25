// Camada de dados SUPABASE (ativa quando VITE_DATA_SOURCE=supabase).
// Mapeia as linhas do banco para o MESMO formato que as telas já consomem (via store),
// para não reescrever a UI. Catálogo segue estático (seed.js). RLS isola por sessão.
import { supabase } from "./supabase";
import { setState, getState, uid } from "./store";
import { KITS, POSITIONS, productById, STOCK } from "../data/seed";
import { bordadoNome } from "./normalize";

const posByCode = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p]));
const ID = (s) => s; // schema helpers
const ident = () => supabase.schema("identidade");
const ped = () => supabase.schema("pedidos");
const integ = () => supabase.schema("integracao");

// ---------- mappers (DB -> formato do app) ----------
function mapProfile(r) {
  return {
    id: r.id, cpf: r.cpf, nome: r.nome, email: r.email, telefone: r.telefone,
    whatsappOptin: r.whatsapp_optin, status: r.status, ativado: r.ativado,
    endereco: r.endereco, unidade: r.unidade_codigo, cargoTxt: r.cargo_txt,
    position: r.positions?.codigo || null,
  };
}
function mapOrder(r) {
  return {
    id: r.id, numero: r.numero, profileId: r.profile_id, status: r.status,
    createdAt: r.created_at, rastreio: r.rastreio, unidade: r.unidade_codigo,
    entregaTipo: r.entrega_tipo,
    items: (r.order_items || []).map((it) => ({
      productId: it.product_sku, tamanho: it.tamanho, qtd: it.qtd,
      sobMedida: it.sob_medida, bordadoNome: it.bordado_nome, tecido: it.tecido,
    })),
  };
}
function mapNotif(r) {
  return { id: r.id, profileId: r.profile_id, template: r.template, texto: r.payload?.texto || "", status: r.status, createdAt: r.created_at };
}

// ---------- carga por sessão ----------
export async function bootstrap() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { setState((s) => ({ ...s, session: null, profiles: [], orders: [], imports: [], notifications: [] })); return null; }
  const meta = session.user.app_metadata || {};
  const role = meta.role || "colaborador";
  const tenantId = meta.tenant_id;
  if (role === "staff") await loadStaff(tenantId);
  else await loadColaborador(meta.profile_id, tenantId);
  return role;
}

async function loadStaff(tenantId) {
  const [{ data: profs }, { data: orders }, { data: imps }, { data: notifs }] = await Promise.all([
    ident().from("profiles").select("*, positions(codigo)").order("created_at"),
    ped().from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
    integ().from("imports").select("*, import_rows(*)").order("created_at", { ascending: false }),
    integ().from("notifications").select("*").order("created_at", { ascending: false }),
  ]);
  setState((s) => ({
    ...s,
    session: { role: "staff", tenantId },
    profiles: (profs || []).map(mapProfile),
    orders: (orders || []).map(mapOrder),
    imports: (imps || []).map((i) => ({
      id: i.id, fonte: i.fonte, ok: i.ok, erros: i.erros, createdAt: i.created_at,
      rows: (i.import_rows || []).map((r) => ({ raw: r.raw, status: r.status, motivo: r.motivo, cargo: null })),
    })),
    notifications: (notifs || []).map(mapNotif),
  }));
}

async function loadColaborador(profileId, tenantId) {
  const [{ data: profs }, { data: orders }, { data: notifs }] = await Promise.all([
    ident().from("profiles").select("*, positions(codigo)").eq("id", profileId).limit(1),
    ped().from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
    integ().from("notifications").select("*").order("created_at", { ascending: false }),
  ]);
  setState((s) => ({
    ...s,
    session: { role: "colaborador", profileId, tenantId },
    profiles: (profs || []).map(mapProfile),
    orders: (orders || []).map(mapOrder),
    notifications: (notifs || []).map(mapNotif),
    imports: [],
  }));
}

// ---------- AUTH ----------
export async function loginEmail(email, senha) {
  const { error } = await supabase.auth.signInWithPassword({ email: (email || "").trim().toLowerCase(), password: senha });
  if (error) return { ok: false, reason: "senha_invalida" };
  await bootstrap();
  return { ok: true };
}

export async function firstAccessCheck(cpf) {
  const { data, error } = await supabase.functions.invoke("ativar-conta", { body: { cpf, checkOnly: true } });
  if (error) {
    // a function devolve reason no corpo mesmo em status != 2xx
    const ctx = await error.context?.json?.().catch(() => null);
    return { ok: false, reason: ctx?.reason || "erro" };
  }
  return data; // { ok:true, nome }
}

export async function ativarConta(cpf, dados) {
  const { data, error } = await supabase.functions.invoke("ativar-conta", {
    body: { cpf, email: dados.email, senha: dados.senha, telefone: dados.telefone, whatsapp_optin: dados.whatsappOptin, endereco: dados.endereco },
  });
  if (error) { const ctx = await error.context?.json?.().catch(() => null); return { ok: false, reason: ctx?.reason || "erro" }; }
  if (!data?.ok) return data;
  return loginEmail(dados.email, dados.senha);
}

export async function logout() {
  await supabase.auth.signOut();
  setState((s) => ({ ...s, session: null, profiles: [], orders: [], imports: [], notifications: [] }));
}

// ---------- PEDIDOS ----------
function buildItems(profile, kit, items) {
  return items.map((it) => {
    const saldo = STOCK[it.productId]?.[it.tamanho] ?? 0;
    const sobMedida = saldo < (it.qtd || 1);
    return {
      product_sku: it.productId, product_nome: productById[it.productId]?.nome,
      tecido: productById[it.productId]?.tecido, tamanho: it.tamanho, qtd: it.qtd || 1,
      sob_medida: sobMedida, bordado_nome: kit?.bordado ? bordadoNome(profile.nome) : null,
    };
  });
}

export async function orderCreate({ profileId, unidade, items, entregaTipo = "casa" }) {
  const st = getState();
  const profile = st.profiles.find((p) => p.id === profileId);
  const kit = KITS[posByCode[profile.position]?.kit];
  const built = buildItems(profile, kit, items);

  const { data: order, error } = await ped().from("orders").insert({
    tenant_id: st.session.tenantId, profile_id: profileId,
    unidade_codigo: unidade || profile.unidade, entrega_tipo: entregaTipo, status: "recebido",
  }).select().single();
  if (error) throw error;

  await ped().from("order_items").insert(built.map((b) => ({ ...b, order_id: order.id })));
  await integ().from("notifications").insert({
    tenant_id: st.session.tenantId, profile_id: profileId, canal: "whatsapp", template: "pedido_criado",
    payload: { texto: `Olá! Seu pedido ${order.numero} foi recebido. Avisaremos o envio. 🧵` }, status: "mock",
  });
  await bootstrap();
  return getState().orders.find((o) => o.id === order.id) || mapOrder({ ...order, order_items: built.map((b) => ({ ...b })) });
}

const SEQ = ["recebido", "em_separacao", "despachado", "entregue"];
export async function orderAdvance(orderId, rastreioInformado) {
  const cur = getState().orders.find((o) => o.id === orderId);
  const next = SEQ[Math.min(SEQ.indexOf(cur.status) + 1, SEQ.length - 1)];
  const patch = { status: next };
  if (next === "despachado") patch.rastreio = (rastreioInformado || "").trim() || "AB" + Math.floor(1e8 + Math.random() * 8e8) + "BR";
  await ped().from("orders").update(patch).eq("id", orderId);

  const st = getState();
  if (next === "despachado")
    await integ().from("notifications").insert({ tenant_id: st.session.tenantId, profile_id: cur.profileId, template: "despachado", payload: { texto: `Seu pedido ${cur.numero} foi despachado! Rastreio Correios: ${patch.rastreio}.` }, status: "mock" });
  if (next === "entregue")
    await integ().from("notifications").insert({ tenant_id: st.session.tenantId, profile_id: cur.profileId, template: "entregue", payload: { texto: `Seu pedido ${cur.numero} foi entregue. 💜 Responda a pesquisa de satisfação quando puder.` }, status: "mock" });
  await bootstrap();
}

export async function liberar(profileId) {
  await ident().from("profiles").update({ status: "liberado" }).eq("id", profileId);
  await bootstrap();
}

export async function runImport(rows, fonte = "app") {
  const st = getState();
  const { error } = await supabase.functions.invoke("importar-cadastro", { body: { tenant_id: st.session.tenantId, fonte, rows } });
  if (error) throw error;
  await bootstrap();
}

export async function updateConta(profileId, patch) {
  if (patch.senha) await supabase.auth.updateUser({ password: patch.senha });
  if (patch.email) await supabase.auth.updateUser({ email: patch.email });
  const upd = {};
  if (patch.email) upd.email = patch.email;
  if (patch.telefone !== undefined) upd.telefone = patch.telefone;
  if (patch.endereco) upd.endereco = patch.endereco;
  if (Object.keys(upd).length) await ident().from("profiles").update(upd).eq("id", profileId);
  await bootstrap();
}

// pedido já existe? (bloqueio de re-pedido)
export function jaPediu(profileId) {
  return getState().orders.some((o) => o.profileId === profileId && o.status !== "cancelado");
}
