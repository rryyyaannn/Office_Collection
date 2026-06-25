// Dados de TESTE (não-PII) — espelham o supabase/seed.sql.
// Catálogo é estático; colaboradores/pedidos vivem na store (mock).

export const TENANT = {
  id: "einstein",
  nome: "Hospital Albert Einstein",
  config: { cliente_sp: "027298", cliente_go: "030262", frete_contrato_sp: 40 },
};

export const UNIDADES = [
  { codigo: "AEMO", nome: "Unidade Morumbi", uf: "SP" },
  { codigo: "AEPE", nome: "Unidade Perdizes", uf: "SP" },
  { codigo: "AEIB", nome: "Unidade Ibirapuera", uf: "SP" },
  { codigo: "AEOR", nome: "Unidade Goiânia", uf: "GO" },
];

export const POSITIONS = [
  { codigo: "atendimento", nome: "Assistente de Atendimento", kit: "k_atend" },
  { codigo: "medico", nome: "Médico", kit: "k_medico" },
  { codigo: "residente", nome: "Residente", kit: "k_residente" },
  { codigo: "laboratorio", nome: "Laboratório / Biomédico", kit: "k_lab" },
  { codigo: "enfermagem", nome: "Enfermagem", kit: "k_scrub" },
  { codigo: "farmacia", nome: "Farmácia", kit: "k_lab" },
  { codigo: "tecnico", nome: "Técnico", kit: "k_atend" },
  { codigo: "nutricao", nome: "Nutricionista", kit: "k_lab" },
  { codigo: "fisioterapia", nome: "Fisioterapeuta", kit: "k_scrub" },
  { codigo: "administrativo", nome: "Administrativo", kit: "k_atend" },
  { codigo: "servicos", nome: "Serviços", kit: "k_atend" },
  { codigo: "monitor_pesquisa", nome: "Monitor de Pesquisa Clínica", kit: "k_atend" },
];

// aliases explícitos (o matcher por palavra-chave cobre o resto)
export const ALIASES = {
  "assistente atendimento hospital municipa": "atendimento",
  "pcd assist aten mda": "atendimento",
  "lider de copas": "servicos",
};

const NUM = ["36", "38", "40", "42", "44", "46", "48", "50"];
const LET = ["PP", "P", "M", "G", "GG", "XG"];

// modelagem: "fem" | "masc" | "uni" (usada no filtro do catálogo). foto: troque pelos JPGs reais.
export const PRODUCTS = [
  { id: "camf", nome: "Camisa Feminina", tecido: "Oxford", genero: "fem", modelagem: "Feminina", sku: "OC-CAMF", tipo: "numerico", tamanhos: NUM, foto: "/pecas/camisa.svg" },
  { id: "camm", nome: "Camisa Masculina", tecido: "Oxford", genero: "masc", modelagem: "Masculina", sku: "OC-CAMM", tipo: "numerico", tamanhos: NUM, foto: "/pecas/camisa.svg" },
  { id: "calf", nome: "Calça Feminina", tecido: "Sarja", genero: "fem", modelagem: "Feminina", sku: "OC-CALF", tipo: "numerico", tamanhos: NUM, foto: "/pecas/calca.svg" },
  { id: "calm", nome: "Calça Masculina", tecido: "Sarja", genero: "masc", modelagem: "Masculina", sku: "OC-CALM", tipo: "numerico", tamanhos: NUM, foto: "/pecas/calca.svg" },
  // Jaleco médico: corte (masc/fem) × tecido (chemise/gabardine). Fotos reais (frente _1 / costas _2).
  { id: "jcm", nome: "Jaleco Chemise — Masculino", tecido: "Chemise", genero: "masc", modelagem: "Masculina", sku: "OC-JCM", tipo: "letra", tamanhos: LET, foto: "/pecas/15_1.jpg", fotoCostas: "/pecas/15_2.jpg" },
  { id: "jcf", nome: "Jaleco Chemise — Feminino", tecido: "Chemise", genero: "fem", modelagem: "Feminina", sku: "OC-JCF", tipo: "letra", tamanhos: LET, foto: "/pecas/17_1.jpg", fotoCostas: "/pecas/17_2.jpg" },
  { id: "jgm", nome: "Jaleco Gabardine — Masculino", tecido: "Gabardine", genero: "masc", modelagem: "Masculina", sku: "OC-JGM", tipo: "letra", tamanhos: LET, foto: "/pecas/15_1.jpg", fotoCostas: "/pecas/15_2.jpg" },
  { id: "jgf", nome: "Jaleco Gabardine — Feminino", tecido: "Gabardine", genero: "fem", modelagem: "Feminina", sku: "OC-JGF", tipo: "letra", tamanhos: LET, foto: "/pecas/17_1.jpg", fotoCostas: "/pecas/17_2.jpg" },
  // jaleco genérico (residente/uso unissex)
  { id: "jgab", nome: "Jaleco Gabardine", tecido: "Gabardine", genero: "uni", modelagem: "Unissex", sku: "OC-JGAB", tipo: "letra", tamanhos: LET, foto: "/pecas/15_1.jpg", fotoCostas: "/pecas/15_2.jpg" },
  { id: "jlab", nome: "Jaleco Laboratório", tecido: "Microfibra", genero: "uni", modelagem: "Unissex", sku: "OC-JLAB", tipo: "letra", tamanhos: LET, foto: "/pecas/jaleco.svg" },
  { id: "scrb", nome: "Scrub Blusa", tecido: "Malha PV", genero: "uni", modelagem: "Unissex", sku: "OC-SCRB", tipo: "letra", tamanhos: LET, foto: "/pecas/scrub.svg" },
  { id: "scrc", nome: "Scrub Calça", tecido: "Malha PV", genero: "uni", modelagem: "Unissex", sku: "OC-SCRC", tipo: "letra", tamanhos: LET, foto: "/pecas/calca.svg" },
];

// Contato para escolher bordado / nome social (texto oficial do Einstein).
export const WHATSAPP_PEDIDOS = "11 99988-1686";
export const BORDADO_INFO =
  "Composição do Kit: 2 peças, podendo ser 1 em cada tecido. ATENÇÃO! A peça leva o nome bordado no bolso (exceto residentes). " +
  "Por limitação de caracteres, será bordado o PRIMEIRO nome e o ÚLTIMO sobrenome, conforme o cadastro neste site. " +
  `Para escolher o bordado ou informar nome social, fale no WhatsApp ${WHATSAPP_PEDIDOS} com o número do pedido e o nome desejado. ` +
  "A especialidade não é bordada, conforme padrão do Hosp. Albert Einstein.";
export const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

// kits: cada slot = uma escolha (produtos permitidos). "multi" = soma de qtd = max (caso médico).
export const KITS = {
  k_atend: {
    id: "k_atend", nome: "Kit Atendimento", bordado: false,
    slots: [
      { label: "Camisa", produtos: ["camf", "camm"], max: 1 },
      { label: "Calça", produtos: ["calf", "calm"], max: 1 },
    ],
  },
  k_medico: {
    id: "k_medico", nome: "Jaleco Médico (2 peças)", bordado: true,
    regra: "2 jalecos — escolha o corte (masculino/feminino) e o tecido (chemise/gabardine). Pode ser 1 de cada tecido.",
    slots: [{ label: "Jalecos", produtos: ["jcm", "jcf", "jgm", "jgf"], max: 2, modo: "multi" }],
  },
  k_residente: {
    id: "k_residente", nome: "Jaleco Residente", bordado: false,
    slots: [{ label: "Jaleco", produtos: ["jgab"], max: 1 }],
  },
  k_lab: {
    id: "k_lab", nome: "Jaleco Laboratório", bordado: false,
    slots: [{ label: "Jaleco", produtos: ["jlab"], max: 1 }],
  },
  k_scrub: {
    id: "k_scrub", nome: "Conjunto Scrub", bordado: false,
    slots: [
      { label: "Blusa", produtos: ["scrb"], max: 1 },
      { label: "Calça", produtos: ["scrc"], max: 1 },
    ],
  },
};

// estoque por produto/tamanho — grandes zerados (=> produção/sob medida)
export const STOCK = {};
for (const p of PRODUCTS) {
  STOCK[p.id] = {};
  for (const t of p.tamanhos) STOCK[p.id][t] = ["50", "XG", "GG"].includes(t) ? 0 : 120;
}

// colaboradores pré-cadastrados (atalho de demo; também dá pra importar).
// status: "liberado" (1º acesso disponível) | "aguardando" (Office ainda não liberou).
// 1 conta já PRÉ-ATIVADA p/ testar login direto; as demais demonstram 1º acesso e o gate.
export const COLABORADORES_SEED = [
  {
    cpf: "12345678900", nome: "Ana Paula Ribeiro", cargoTxt: "Assistente Atendimento II MDA",
    unidade: "AEMO", status: "liberado", ativado: true,
    email: "ana.ribeiro@teste.com", senha: "teste123", telefone: "11 98888-0001", whatsappOptin: true,
    endereco: { cep: "05402-000", logradouro: "Rua Teodoro Sampaio", numero: "1000", complemento: "Apto 52", bairro: "Pinheiros", cidade: "São Paulo", uf: "SP" },
  },
  { cpf: "7654321", nome: "Carlos Eduardo Nunes", cargoTxt: "Medico Plantonista PA I", unidade: "AEMO", status: "liberado" },
  { cpf: "3216540", nome: "Bruna Carvalho Lima", cargoTxt: "Residente Medica R1", unidade: "AEIB", status: "liberado" },
  { cpf: "9090901", nome: "Marcos Vinícius Souza", cargoTxt: "Enfermeiro Assistencial", unidade: "AEPE", status: "aguardando" },
];

// linhas de teste para o IMPORTADOR (cargo bagunçado, desconhecido, CPF inválido e o status "aguardando")
export const TEST_ROWS = [
  { COLABORADOR: "Mariana Lopes Silva", CPF: "111.222.3", CARGO: "assist atendimento   II MDA", UNIDADE: "Unidade Perdizes (AEPE)", STATUS: "Liberado" },
  { COLABORADOR: "Dr. Gustavo Martinhago", CPF: "9988776", CARGO: "Preceptor Residencia Medica", UNIDADE: "Unidade Morumbi (AEMO)", STATUS: "Liberado" },
  { COLABORADOR: "Beatriz Almeida", CPF: "5544332", CARGO: "Residente Médica", UNIDADE: "Unidade Ibirapuera (AEIB)", STATUS: "Aguardando liberação Office" },
  { COLABORADOR: "João Pedro Reis", CPF: "4477880", CARGO: "Gerenciador de pesquisa", UNIDADE: "Unidade Morumbi", STATUS: "Liberado" },
  { COLABORADOR: "Teste Inválido", CPF: "00", CARGO: "Cargo Que Nao Existe XYZ", UNIDADE: "Morumbi", STATUS: "Liberado" },
];
