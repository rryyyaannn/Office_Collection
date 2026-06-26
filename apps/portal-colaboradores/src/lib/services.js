// Camada de serviços (ports & adapters). Hoje: implementação MOCK sobre a store.
// Pontos de acoplamento futuros marcados com [ACOPLAR].
import { getState, setState, uid } from "./store";
import { normCPF, matchPosition, bordadoNome, normCargoText } from "./normalize";
import { enderecoLinha } from "./validators";
import { supabaseEnabled } from "./supabase";
import * as db from "./db";
import { TENANT, UNIDADES, POSITIONS, KITS, productById, STOCK } from "../data/seed";

const STATUS_LIBERADO = /liberad|ativo|sim|ok/i;
const posByCode = Object.fromEntries(POSITIONS.map((p) => [p.codigo, p]));
const unidadeByCodigo = (cod) => UNIDADES.find((u) => cod && cod.includes(u.codigo)) || UNIDADES.find((u) => u.codigo === cod);

// ---------- IMPORTADOR (mesma lógica da Edge Function) ----------
// [ACOPLAR] a fonte das linhas será o Make.com → Edge Function; a lógica é esta.
export const importService = {
  run(rows, fonte = "teste") {
    if (supabaseEnabled) return db.runImport(rows, fonte);
    const result = { id: uid("imp_"), fonte, total: rows.length, ok: 0, erros: 0, rows: [], createdAt: new Date().toISOString() };
    let profiles = [...getState().profiles];
    for (const raw of rows) {
      const cpf = normCPF(raw.CPF ?? raw.cpf);
      const code = matchPosition(raw.CARGO ?? raw.cargo ?? "");
      if (!cpf || !code) {
        result.erros++;
        result.rows.push({ raw, status: "excecao", motivo: !cpf ? "cpf_invalido" : "cargo_desconhecido" });
        continue;
      }
      const liberado = STATUS_LIBERADO.test(raw.STATUS ?? raw.status ?? "");
      const existing = profiles.find((p) => p.cpf === cpf);
      const data = {
        cpf, nome: raw.COLABORADOR ?? raw.nome, position: code, cargoTxt: raw.CARGO ?? raw.cargo,
        unidade: raw.UNIDADE ?? raw.unidade, status: liberado ? "liberado" : "aguardando",
      };
      // não sobrescreve cadastro/ativação de quem já existe; só atualiza dados da planilha
      if (existing) Object.assign(existing, data);
      else profiles.push({ id: uid("p_"), ativado: false, senha: null, email: null, telefone: null, whatsappOptin: false, endereco: null, ...data });
      result.ok++;
      result.rows.push({ raw, status: "ok", cargo: code });
    }
    setState((s) => ({ ...s, profiles, imports: [result, ...s.imports] }));
    return result;
  },
};

// ---------- NOTIFICAÇÃO (mock; [ACOPLAR] WhatsApp Cloud API) ----------
export const notificationService = {
  send(profileId, template, texto) {
    const n = { id: uid("ntf_"), profileId, canal: "whatsapp", template, texto, status: "mock", createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, notifications: [n, ...s.notifications] }));
    return n;
  },
};

// ---------- PEDIDOS ----------
export const orderService = {
  // items: [{ productId, tamanho, qtd, tecido }]
  create({ profileId, unidade, items, entregaTipo }) {
    if (supabaseEnabled) return db.orderCreate({ profileId, unidade, items, entregaTipo });
    const profile = getState().profiles.find((p) => p.id === profileId);
    const kit = KITS[posByCode[profile.position]?.kit];
    const built = items.map((it) => {
      const saldo = STOCK[it.productId]?.[it.tamanho] ?? 0;
      const sobMedida = saldo < (it.qtd || 1);
      return {
        productId: it.productId, kitId: kit?.id, tamanho: it.tamanho, qtd: it.qtd || 1,
        tecido: productById[it.productId]?.tecido, sobMedida,
        bordadoNome: kit?.bordado ? bordadoNome(profile.nome) : null,
      };
    });
    const order = {
      id: uid("ord_"),
      numero: "OC" + String(getState().orders.length + 1001).padStart(6, "0"),
      profileId, unidade: unidade || profile.unidade, status: "recebido",
      createdAt: new Date().toISOString(),
      slaDue: slaUtil(new Date()).toISOString(),
      items: built,
    };
    setState((s) => ({ ...s, orders: [order, ...s.orders] }));
    notificationService.send(profileId, "pedido_criado",
      `Olá! Seu pedido ${order.numero} foi recebido. Acompanhe por aqui que avisaremos o envio. 🧵`);
    return order;
  },
  // No fluxo real, ao despachar a equipe informa o código de rastreio dos Correios.
  // rastreioInformado: string opcional (se vazio ao chegar em "despachado", gera um p/ demo).
  advance(orderId, rastreioInformado) {
    if (supabaseEnabled) return db.orderAdvance(orderId, rastreioInformado);
    const seq = ["recebido", "em_separacao", "despachado", "entregue"];
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        const i = seq.indexOf(o.status);
        const next = seq[Math.min(i + 1, seq.length - 1)];
        const upd = { ...o, status: next };
        if (next === "despachado")
          upd.rastreio = (rastreioInformado || "").trim() || "AB" + Math.floor(100000000 + Math.random() * 8e8) + "BR";
        return upd;
      }),
    }));
    const o = getState().orders.find((x) => x.id === orderId);
    if (o.status === "despachado")
      notificationService.send(o.profileId, "despachado",
        `Seu pedido ${o.numero} foi despachado! Rastreio Correios: ${o.rastreio}.`);
    if (o.status === "entregue")
      notificationService.send(o.profileId, "entregue",
        `Seu pedido ${o.numero} foi entregue. 💜 Obrigado! Responda a pesquisa de satisfação quando puder.`);
    return o;
  },
  // volta um passo no fluxo (correção). Limpa rastreio se sair de "despachado".
  revert(orderId) {
    if (supabaseEnabled) return db.orderRevert(orderId);
    const seq = ["recebido", "em_separacao", "despachado", "entregue"];
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        const prev = seq[Math.max(seq.indexOf(o.status) - 1, 0)];
        const upd = { ...o, status: prev };
        if (o.status === "despachado") upd.rastreio = undefined;
        return upd;
      }),
    }));
  },
  // bloqueio de re-pedido: já existe pedido não-cancelado para o colaborador?
  jaPediu(profileId) {
    return getState().orders.some((o) => o.profileId === profileId && o.status !== "cancelado");
  },
};

// ---------- CARGOS (palavras-chave → cargo canônico) ----------
export const cargoService = {
  addAlias(texto, positionCode) {
    if (supabaseEnabled) return db.addAlias(texto, positionCode);
    setState((s) => ({ ...s, aliases: [...(s.aliases || []), { id: uid("a_"), alias_norm: normCargoText(texto), position: positionCode }] }));
  },
  removeAlias(id) {
    if (supabaseEnabled) return db.removeAlias(id);
    setState((s) => ({ ...s, aliases: (s.aliases || []).filter((a) => a.id !== id) }));
  },
};

// ---------- CONFIG (preços/frete editáveis à mão) ----------
export const configService = {
  save(patch) {
    if (supabaseEnabled) return db.saveConfig(patch);
    setState((s) => ({ ...s, config: { ...s.config, ...patch } }));
  },
};

// ---------- BACK-OFFICE (cadastro manual / liberação) ----------
// Office faz o cadastro manual e libera o colaborador → vira "liberado" (1º acesso disponível).
// [ACOPLAR] devolutiva real: escrever "Liberado" de volta na planilha (Make) e/ou no ERP.
export const adminService = {
  liberar(profileId) {
    if (supabaseEnabled) return db.liberar(profileId);
    setState((s) => ({
      ...s,
      profiles: s.profiles.map((p) => (p.id === profileId ? { ...p, status: "liberado" } : p)),
    }));
  },
  bloquear(profileId) {
    setState((s) => ({
      ...s,
      profiles: s.profiles.map((p) => (p.id === profileId ? { ...p, status: "aguardando" } : p)),
    }));
  },
};

// ---------- ERP / OUTPUT (mock; [ACOPLAR] API Organiza Têxtil) ----------
// Gera as linhas no layout da aba "Pedidos" + exports.
export const erpService = {
  pedidoRows(order) {
    const profile = getState().profiles.find((p) => p.id === order.profileId);
    const kit = KITS[posByCode[profile.position]?.kit];
    const u = unidadeByCodigo(order.unidade);
    const ufFat = u?.uf || "SP"; // UF de faturamento (cliente do contrato)
    const cliente = ufFat === "GO" ? TENANT.config.cliente_go : TENANT.config.cliente_sp;
    const frete = ufFat === "SP" ? `R$ ${TENANT.config.frete_contrato_sp},00 (contrato)` : "frete real";
    const naUnidade = order.entregaTipo === "unidade";
    const end = profile.endereco; // entrega padrão: casa do colaborador (Correios)
    const enderecoEntrega = naUnidade ? `Retirada na ${u?.nome || order.unidade || "unidade"}` : (end ? enderecoLinha(end) : "");
    const cidadeUf = naUnidade ? `${(u?.nome || "").replace("Unidade ", "")} / ${u?.uf || ""}` : (end ? `${end.cidade} / ${end.uf}` : "");
    return order.items.map((it) => ({
      DATA: order.createdAt.slice(0, 10),
      DESTINATARIO: profile.nome,
      ENTREGA: naUnidade ? "Unidade Einstein" : "Casa (Correios)",
      ENDERECO: enderecoEntrega,
      "CIDADE/UF": cidadeUf,
      UNIDADE: u?.nome || order.unidade || "",
      PO: order.po || "",
      KIT: kit?.nome || "",
      PECA: productById[it.productId]?.nome || "",
      TAM: it.tamanho,
      QTD: it.qtd,
      ESTOQUE: it.sobMedida ? "—" : "pronta entrega",
      PRODUZIR: it.sobMedida ? it.qtd : 0,
      BORDADO: it.bordadoNome || "",
      STATUS: order.status,
      OBJETO: order.rastreio || "",
      UF: naUnidade ? (u?.uf || ufFat) : (end?.uf || ufFat),
      CLIENTE: cliente,
      FRETE: frete,
    }));
  },
  toCSV(order) {
    const rows = this.pedidoRows(order);
    const cols = Object.keys(rows[0]);
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    return [cols.join(";"), ...rows.map((r) => cols.map((c) => esc(r[c])).join(";"))].join("\n");
  },
  toJSON(order) {
    return JSON.stringify({ pedido: order.numero, linhas: this.pedidoRows(order) }, null, 2);
  },
};

// SLA: 48h úteis (simplificado: +2 dias úteis)
function slaUtil(d) {
  const r = new Date(d);
  let add = 2;
  while (add > 0) { r.setDate(r.getDate() + 1); if (r.getDay() !== 0 && r.getDay() !== 6) add--; }
  return r;
}
