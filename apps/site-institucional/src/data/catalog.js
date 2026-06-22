import {
  Stethoscope,
  BedDouble,
  Plane,
  Briefcase,
} from "lucide-react";

/**
 * Segmentos atendidos pela Office Collection.
 * `tone` controla o duotone do placeholder editorial; `icon` é um ícone lucide.
 * Compartilhado entre o menu, a seção de segmentos e o catálogo.
 */
export const SEGMENTS = [
  {
    id: "saude",
    name: "Saúde",
    tagline: "Scrubs & Jalecos",
    icon: Stethoscope,
    tone: "navy",
    blurb:
      "Scrubs, jalecos e pijamas cirúrgicos com acabamento antimicrobiano e modelagem que acompanha longas jornadas em clínicas e hospitais.",
    menu: ["Scrubs", "Jalecos", "Pijamas cirúrgicos", "Clínicas & Estética"],
  },
  {
    id: "hotelaria",
    name: "Hotelaria",
    tagline: "A marca mais premiada",
    icon: BedDouble,
    tone: "wine",
    blurb:
      "Premiada por 15 anos consecutivos como melhor fornecedora do setor. Recepção, governança, A&B e spa com a elegância que o hóspede percebe.",
    menu: ["Recepção", "Governança", "Alimentos & Bebidas", "Spa & Lazer"],
  },
  {
    id: "aviacao",
    name: "Aviação",
    tagline: "Alta performance em voo",
    icon: Plane,
    tone: "ink",
    blurb:
      "Uniformes de tripulação e solo com caimento impecável, conforto pressurizado e a identidade da companhia em cada detalhe.",
    menu: ["Tripulação", "Solo & Rampa", "Atendimento VIP"],
  },
  {
    id: "social",
    name: "Social & Corporativo",
    tagline: "Alfaiataria de escritório",
    icon: Briefcase,
    tone: "sand",
    blurb:
      "Blazers, camisas, blusas, saias e calças em alfaiataria versátil — o DNA da sua marca traduzido para o dia a dia corporativo.",
    menu: ["Blazers", "Camisas sociais", "Blusas & Saias", "Calças & Alfaiataria"],
  },
];

/**
 * Catálogo por segmento (id do segmento → lista de peças).
 * Preços ilustrativos; projetos corporativos seguem orçamento consultivo.
 */
export const PRODUCTS = {
  saude: [
    {
      title: "Scrub Antimicrobiano Helena",
      price: "A partir de R$ 219,00",
      installment: "ou em 6x de R$ 36,50 sem juros",
      badge: "Pronta Entrega",
      tone: "navy",
      colors: ["#2D2F92", "#3E7C7B", "#262323", "#6E7B8F"],
    },
    {
      title: "Jaleco Premium Dr. Antônio",
      price: "A partir de R$ 289,00",
      installment: "ou em 6x de R$ 48,16 sem juros",
      badge: "Sob Medida",
      tone: "sand",
      colors: ["#FAF9F5", "#E7E2DA", "#2D2F92"],
    },
    {
      title: "Pijama Cirúrgico Vita",
      price: "A partir de R$ 198,00",
      installment: "ou em 6x de R$ 33,00 sem juros",
      badge: "Pronta Entrega",
      tone: "ink",
      colors: ["#3E7C7B", "#2D2F92", "#5C6B6A"],
    },
    {
      title: "Avental Clínico Estética",
      price: "A partir de R$ 169,00",
      installment: "ou em 6x de R$ 28,16 sem juros",
      badge: "Sob Medida",
      tone: "stone",
      colors: ["#FAF9F5", "#959595", "#701F20"],
    },
    {
      title: "Conjunto Scrub Slim Marina",
      price: "A partir de R$ 234,00",
      installment: "ou em 6x de R$ 39,00 sem juros",
      badge: "Pronta Entrega",
      tone: "navy",
      colors: ["#2D2F92", "#3E7C7B", "#262323"],
    },
    {
      title: "Jaleco Clínico Acquablock",
      price: "A partir de R$ 309,00",
      installment: "ou em 6x de R$ 51,50 sem juros",
      badge: "Sob Medida",
      tone: "sand",
      colors: ["#FAF9F5", "#E7E2DA", "#701F20"],
    },
  ],
  hotelaria: [
    {
      title: "Blazer Recepção Concierge",
      price: "A partir de R$ 459,00",
      installment: "ou em 6x de R$ 76,50 sem juros",
      badge: "Sob Medida",
      tone: "wine",
      colors: ["#701F20", "#262323", "#2D2F92"],
    },
    {
      title: "Conjunto Governança Áurea",
      price: "A partir de R$ 329,00",
      installment: "ou em 6x de R$ 54,83 sem juros",
      badge: "Pronta Entrega",
      tone: "sand",
      colors: ["#E7E2DA", "#701F20", "#262323"],
    },
    {
      title: "Dólmã A&B Gourmet",
      price: "A partir de R$ 279,00",
      installment: "ou em 6x de R$ 46,50 sem juros",
      badge: "Pronta Entrega",
      tone: "ink",
      colors: ["#262323", "#FAF9F5", "#701F20"],
    },
    {
      title: "Uniforme Spa Serenità",
      price: "A partir de R$ 239,00",
      installment: "ou em 6x de R$ 39,83 sem juros",
      badge: "Sob Medida",
      tone: "stone",
      colors: ["#FAF9F5", "#959595", "#8E3A3B"],
    },
    {
      title: "Avental Bistrô Couro Vegano",
      price: "A partir de R$ 259,00",
      installment: "ou em 6x de R$ 43,16 sem juros",
      badge: "Pronta Entrega",
      tone: "ink",
      colors: ["#262323", "#701F20", "#959595"],
    },
    {
      title: "Lenço & Gravata Signature",
      price: "A partir de R$ 129,00",
      installment: "ou em 6x de R$ 21,50 sem juros",
      badge: "Sob Medida",
      tone: "wine",
      colors: ["#701F20", "#2D2F92", "#E7E2DA"],
    },
  ],
  aviacao: [
    {
      title: "Blazer Tripulação Altitude",
      price: "A partir de R$ 689,00",
      installment: "ou em 6x de R$ 114,83 sem juros",
      badge: "Sob Medida",
      tone: "ink",
      colors: ["#262323", "#2D2F92", "#701F20"],
    },
    {
      title: "Tailleur Comissária Skyline",
      price: "A partir de R$ 629,00",
      installment: "ou em 6x de R$ 104,83 sem juros",
      badge: "Sob Medida",
      tone: "navy",
      colors: ["#2D2F92", "#262323", "#959595"],
    },
    {
      title: "Camisa Solo & Rampa Logística",
      price: "A partir de R$ 219,00",
      installment: "ou em 6x de R$ 36,50 sem juros",
      badge: "Pronta Entrega",
      tone: "sand",
      colors: ["#FAF9F5", "#2D2F92", "#959595"],
    },
    {
      title: "Colete Atendimento VIP",
      price: "A partir de R$ 259,00",
      installment: "ou em 6x de R$ 43,16 sem juros",
      badge: "Sob Medida",
      tone: "wine",
      colors: ["#701F20", "#262323", "#E7E2DA"],
    },
    {
      title: "Sobretudo Tripulação Horizonte",
      price: "A partir de R$ 749,00",
      installment: "ou em 6x de R$ 124,83 sem juros",
      badge: "Sob Medida",
      tone: "ink",
      colors: ["#262323", "#2D2F92", "#701F20"],
    },
    {
      title: "Echarpe Identidade de Bordo",
      price: "A partir de R$ 149,00",
      installment: "ou em 6x de R$ 24,83 sem juros",
      badge: "Pronta Entrega",
      tone: "navy",
      colors: ["#2D2F92", "#701F20", "#959595"],
    },
  ],
  social: [
    {
      title: "Blazer Alfaiataria Luciana",
      price: "A partir de R$ 549,00",
      installment: "ou em 6x de R$ 91,50 sem juros",
      badge: "Sob Medida",
      tone: "ink",
      colors: ["#262323", "#701F20", "#2D2F92"],
    },
    {
      title: "Camisa Social Atelier",
      price: "A partir de R$ 199,00",
      installment: "ou em 6x de R$ 33,16 sem juros",
      badge: "Pronta Entrega",
      tone: "sand",
      colors: ["#FAF9F5", "#E7E2DA", "#2D2F92"],
    },
    {
      title: "Blusa Executiva Stadtlander",
      price: "A partir de R$ 229,00",
      installment: "ou em 6x de R$ 38,16 sem juros",
      badge: "Pronta Entrega",
      tone: "wine",
      colors: ["#701F20", "#FAF9F5", "#262323"],
    },
    {
      title: "Calça Alfaiataria Corporate",
      price: "A partir de R$ 289,00",
      installment: "ou em 6x de R$ 48,16 sem juros",
      badge: "Sob Medida",
      tone: "stone",
      colors: ["#262323", "#959595", "#2D2F92"],
    },
    {
      title: "Saia Lápis Corporate",
      price: "A partir de R$ 219,00",
      installment: "ou em 6x de R$ 36,50 sem juros",
      badge: "Pronta Entrega",
      tone: "ink",
      colors: ["#262323", "#701F20", "#959595"],
    },
    {
      title: "Vestido Chemise Executiva",
      price: "A partir de R$ 339,00",
      installment: "ou em 6x de R$ 56,50 sem juros",
      badge: "Sob Medida",
      tone: "wine",
      colors: ["#701F20", "#FAF9F5", "#2D2F92"],
    },
  ],
};

// Mídia de demonstração: distribui um pool de fotos de vestuário pelos produtos
// (por índice) sem precisar editar cada item. Para usar a foto real de uma peça,
// basta adicionar `image: "/media/produtos/..."` diretamente no produto acima.
const PRODUCT_IMAGE_POOL = [
  "/media/oc-1.jpg",
  "/media/oc-2.jpg",
  "/media/oc-4.jpg",
  "/media/oc-5.jpg",
  "/media/oc-3.jpg",
];

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const FABRICS = [
  "Microfibra · 92% Poliéster, 8% Elastano",
  "Oxford · 67% Poliéster, 33% Algodão",
  "Sarja com elastano · 97% Algodão, 3% Elastano",
  "Malha PV · 67% Poliéster, 33% Viscose",
  "Tricoline · 100% Algodão",
];
const SIZE_SET = ["36", "38", "40", "42", "44", "46", "48", "50"];
const PREFIX = { saude: "SA", hotelaria: "HO", aviacao: "AV", social: "SO" };

// Enriquece cada produto com os dados da página de produto (PDP).
Object.entries(PRODUCTS).forEach(([category, list]) => {
  list.forEach((product, i) => {
    if (!product.image) product.image = PRODUCT_IMAGE_POOL[i % PRODUCT_IMAGE_POOL.length];
    const idx = Math.max(0, PRODUCT_IMAGE_POOL.indexOf(product.image));
    product.category = category;
    product.id = slugify(product.title);
    product.sku = `OC-${PREFIX[category] ?? "OC"}${String(i + 1).padStart(3, "0")}`;
    product.fabric = FABRICS[(idx + i) % FABRICS.length];
    product.sizes = SIZE_SET.map((size, si) => ({ size, available: (i + si) % 7 !== 0 }));
    product.gallery = [
      product.image,
      PRODUCT_IMAGE_POOL[(idx + 2) % PRODUCT_IMAGE_POOL.length],
      PRODUCT_IMAGE_POOL[(idx + 4) % PRODUCT_IMAGE_POOL.length],
    ];
    // Valor numérico para o carrinho (a partir do texto "R$ 219,00")
    const m = product.price.match(/([\d.]+),(\d{2})/);
    product.priceValue = m ? parseFloat(m[1].replace(/\./g, "") + "." + m[2]) : 0;
    // Demonstração de "esgotado": última peça de cada segmento
    product.soldOut = i % 6 === 5;
  });
});

/** Formata número para moeda brasileira (R$). */
export const formatBRL = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ALL_PRODUCTS = Object.values(PRODUCTS).flat();
export const getProduct = (id) => ALL_PRODUCTS.find((p) => p.id === id);
