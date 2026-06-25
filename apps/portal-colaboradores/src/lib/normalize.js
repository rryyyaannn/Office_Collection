// Normalização e matcher de cargo — ESPELHA supabase/functions/importar-cadastro/index.ts
// (mantra: trocar a fonte de ingestão não muda esta lógica)

export const stripAccents = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");

export const normCargoText = (s) => stripAccents((s || "").toLowerCase()).replace(/\s+/g, " ").trim();

// regras em ORDEM de prioridade — residente antes de medico!
const RULES = [
  [/residente|residencia/, "residente"],
  [/medic|plantonista|preceptor|instrutor|professor|anestesiolog|cirurgi|pediatr|endoscopia/, "medico"],
  [/monitor.*pesquisa/, "monitor_pesquisa"],
  [/laborat|biomedic|laboratorista/, "laboratorio"],
  [/farmac|manipulac/, "farmacia"],
  [/enferm/, "enfermagem"],
  [/nutricion/, "nutricao"],
  [/fisioterap/, "fisioterapia"],
  [/tecnic|tec\s|gasoter|gasometr/, "tecnico"],
  [/atendimento|atend/, "atendimento"],
  [/administrativ|analista|consultor|psicolog|assistente social|coordenac|pesquisa|gerenciador/, "administrativo"],
  [/mensageiro|copa|servic/, "servicos"],
];

export function matchPosition(cargoText, aliases = {}) {
  const n = normCargoText(cargoText);
  if (aliases[n]) return aliases[n];
  for (const [re, code] of RULES) if (re.test(n)) return code;
  return null; // desconhecido → exceção
}

export function normCPF(s) {
  const d = (s || "").toString().replace(/\D/g, "");
  if (d.length === 7) return d; // a planilha usa 7 dígitos
  if (d.length === 11) return validaCPF(d) ? d : null;
  return d.length >= 7 ? d.slice(0, 11) : null;
}

function validaCPF(c) {
  if (/^(\d)\1{10}$/.test(c)) return false;
  const calc = (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += parseInt(c[i]) * (n + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === +c[9] && calc(10) === +c[10];
}

// nome de bordado (padrão Einstein): PRIMEIRO nome + ÚLTIMO sobrenome, conforme cadastro.
// Sem título e sem especialidade. Nome social é tratado por fora (via WhatsApp do pedido).
export function bordadoNome(nome) {
  const partes = (nome || "").trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  const base = partes.length === 1 ? partes[0] : `${partes[0]} ${partes[partes.length - 1]}`;
  return base.slice(0, 26);
}
