/* Artigos do blog (conteúdo demonstrativo, em PT). Capas reutilizam fotos oficiais. */

export const ARTICLES = [
  {
    slug: "tecido-sintetico-ou-natural",
    tag: "Tecidos",
    title: "Sintético ou natural? Como escolher o tecido do uniforme",
    excerpt:
      "Conforto, durabilidade e identidade: o que pesar na hora de definir a matéria-prima de cada peça.",
    date: "12 mar 2025",
    readMin: 5,
    cover: "/media/oc-2.jpg",
    body: [
      { p: "A escolha do tecido é a primeira grande decisão de um projeto de uniforme — e talvez a mais subestimada. Antes da cor, do corte e do bordado, é o tecido que define como a peça se comporta no corpo, no tempo e na lavanderia." },
      { h: "Naturais: respirabilidade e toque" },
      { p: "Fibras como o algodão oferecem um toque macio e excelente respirabilidade, ideais para ambientes quentes ou peças em contato direto com a pele, como camisas e jalecos. Em compensação, podem amassar mais e exigir cuidados na conservação." },
      { h: "Sintéticos: resistência e praticidade" },
      { p: "Poliéster, microfibra e suas misturas trazem resistência ao uso intenso, secagem rápida e estabilidade dimensional — a peça mantém o caimento após muitas lavagens. Para operações de alto giro, como hotelaria e saúde, são imbatíveis em durabilidade." },
      { h: "O melhor dos dois mundos" },
      { p: "Na prática, as misturas inteligentes costumam ser a resposta: um sarja com elastano garante mobilidade na alfaiataria; um PV (poliéster/viscose) equilibra toque e resistência. No Estúdio de Criação da Office Collection, testamos gramatura, elasticidade e acabamento para cada função antes de produzir." },
      { p: "A regra de ouro: o tecido certo é aquele que resolve a rotina de quem veste — não o que parece melhor apenas na vitrine." },
    ],
  },
  {
    slug: "andy-warhol-identidade-de-marca",
    tag: "Identidade",
    title: "Andy Warhol e o poder da estética na identidade de marca",
    excerpt:
      "Quando a imagem vira mensagem — e por que o que se veste comunica tanto quanto o que se diz.",
    date: "28 fev 2025",
    readMin: 4,
    cover: "/media/oc-banner-b.jpg",
    body: [
      { p: "“Na arte do futuro, todos serão famosos por 15 minutos.” A frase de Andy Warhol envelheceu como profecia — e ensina algo direto às marcas: a estética não é enfeite, é linguagem." },
      { p: "Warhol transformou objetos comuns em símbolos. Uma lata de sopa, repetida, virou identidade. O mesmo princípio vale para o uniforme: uma peça bem desenhada, vestida por toda uma equipe, transforma pessoas em uma marca viva, reconhecível à distância." },
      { h: "Coerência cria memória" },
      { p: "A repetição consistente — cores, cortes e detalhes que se repetem em cada colaborador — constrói memória visual. É por isso que um uniforme coeso comunica autoridade antes mesmo da primeira palavra trocada com o cliente." },
      { p: "Vestir uma equipe é, no fundo, um exercício de identidade. Cada detalhe é importante para dar valor à sua marca." },
    ],
  },
  {
    slug: "moda-na-aviacao",
    tag: "Aviação",
    title: "A moda que decola: o vestir profissional nas alturas",
    excerpt: "Elegância, funcionalidade e presença de marca a 11 mil metros de altitude.",
    date: "10 fev 2025",
    readMin: 6,
    cover: "/media/oc-1.jpg",
    body: [
      { p: "Poucos uniformes carregam tanto simbolismo quanto os da aviação. Desde a era de ouro dos voos, a tripulação representa, em cada gesto e em cada peça, a identidade da companhia." },
      { h: "Funcionalidade em primeiro lugar" },
      { p: "A bordo, o uniforme precisa resolver desafios reais: cabine pressurizada, longas horas em pé, variações de temperatura. Tecidos com elastano, forros respiráveis e modelagens que permitem movimento são essenciais." },
      { h: "Elegância como assinatura" },
      { p: "Ao mesmo tempo, o caimento impecável e os detalhes — lenços, gravatas, acabamentos — traduzem a sofisticação da marca. É a alfaiataria a serviço da experiência do passageiro." },
      { p: "Vestir as alturas é unir engenharia têxtil e estética. Quando bem resolvido, o uniforme deixa de ser roupa de trabalho para se tornar parte da viagem." },
    ],
  },
  {
    slug: "uniforme-na-hotelaria-de-luxo",
    tag: "Hotelaria",
    title: "O uniforme como primeira impressão na hotelaria de luxo",
    excerpt: "Da recepção ao spa: como o vestir da equipe molda a percepção do hóspede.",
    date: "22 jan 2025",
    readMin: 5,
    cover: "/media/oc-5.jpg",
    body: [
      { p: "No hotel, a hospitalidade começa antes do check-in: começa no olhar para quem recebe. E o uniforme é parte central dessa primeira impressão." },
      { h: "Cada área, uma linguagem" },
      { p: "Recepção, governança, alimentos & bebidas e lazer têm funções e ritmos diferentes — e o uniforme precisa acompanhar. Coleções por área mantêm a identidade do hotel ao mesmo tempo em que respeitam a praticidade de cada operação." },
      { p: "Premiada por 15 anos consecutivos como melhor fornecedora do setor, a Office Collection entende que elegância e resistência não são opostos: são exigências simultâneas da hotelaria de alto padrão." },
    ],
  },
  {
    slug: "esg-na-moda-corporativa",
    tag: "ESG",
    title: "Moda corporativa que cuida do amanhã",
    excerpt: "Usina solar, logística reversa e o projeto Ciclo Reverso por trás de cada peça.",
    date: "08 jan 2025",
    readMin: 4,
    cover: "/media/oc-banner-a.jpg",
    body: [
      { p: "Sustentabilidade deixou de ser diferencial para virar pré-requisito — inclusive no vestuário corporativo. Grandes clientes já exigem práticas ESG auditáveis de seus fornecedores." },
      { h: "Da energia ao resíduo" },
      { p: "Na Office Collection, a produção é abastecida por usina solar própria, reduzindo as emissões de energia. No último mês, 85% dos resíduos têxteis foram reciclados, fora dos aterros." },
      { h: "Ciclo Reverso" },
      { p: "Uniformes que cumpriram sua função ganham nova vida como ecobags, num modelo de economia circular. Vestir bem, afinal, também é cuidar do amanhã." },
    ],
  },
];

export const getArticle = (slug) => ARTICLES.find((a) => a.slug === slug);
