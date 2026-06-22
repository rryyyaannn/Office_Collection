# Office Collection — Landing Page

Recriação da landing page da **Office Collection** (_Moda Profissional_), no
espírito editorial/image-led da referência (Dash Uniformes), com a **identidade
da marca Office Collection**: bordô assinatura, serif de alta-costura, script
manuscrita e forte agenda ESG.

> _"Cada detalhe é importante para dar valor à sua marca."_

## Stack

- **Vite** + **React 18** + **React Router** (home `/` + produto `/produto/:id`)
- **Tailwind CSS 3** (tokens da marca em `tailwind.config.js`)
- **lucide-react** (ícones)
- Fontes (Google Fonts): **Cormorant Garamond** (serif display + logo),
  **Parisienne** (script) e **Jost** (corpo)

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produção em dist/
npm run preview
```

## ▶ Onde entram os vídeos e as imagens — `src/media.js`

Todo o controle de mídia fica em **um único arquivo**: [`src/media.js`](src/media.js).

- Enquanto não há mídia real, cada slot mostra um **placeholder editorial** na
  paleta da marca, com uma **etiqueta tracejada** indicando exatamente qual
  arquivo entra ali (tipo + caminho).
- A flag **`SHOW_MEDIA_HINTS`** liga/desliga essas etiquetas
  (`true` = modo entrega · `false` = produção/apresentação).

Para plugar uma mídia real: coloque o arquivo em `public/media/` e preencha o
`src` no manifesto (para vídeo, preencha também `poster` e use `type: "video"`).

| Slot                | Onde aparece              | Mídia atual (oficial)               |
| ------------------- | ------------------------- | ----------------------------------- |
| `heroSlides[0..2]`  | Hero (slider de banners)  | Vídeo teaser + 2 fotos oficiais     |
| `estudio`           | Estúdio de Criação        | Vídeo explicativo do Lookbook       |
| `premiacao`         | Nossa História            | Foto da premiação (15 anos)         |
| `segments.{id}`     | Cards de segmento         | Fotos oficiais de modelo (oc-1..5)  |
| produtos (pool)     | Cards do catálogo         | Fotos oficiais (em `src/data/catalog.js`) |

> O hero é um **slider**: cada banner pode ser imagem ou vídeo independentemente.

## Identidade visual

| Token       | Valor     | Uso                                        |
| ----------- | --------- | ------------------------------------------ |
| `wine`      | `#701F20` | Assinatura: logo, CTAs, títulos script     |
| `ink`       | `#262323` | Grafite quase-preto — textos/headings      |
| `navy`      | `#2D2F92` | Acento secundário                          |
| `cream`     | `#FAF9F5` | Fundo off-white                            |
| `footer.bg` | `#1C1A1A` | Rodapé e seções escuras (Hero/ESG)         |

## Animações

- **Hero slider** com crossfade automático, setas e dots
- **Carrossel de produtos** com scroll-snap, barra de progresso e setas
- **Vídeo do Lookbook** com toggle "Ativar som"
- **Reveal** escalonado (fade-up via IntersectionObserver)
- **Marquees** (faixa de anúncio + rodapé), **hover-zoom 1.05** nas imagens,
  **pulse** no botão WhatsApp
- Respeita `prefers-reduced-motion`

## Estrutura

```
src/
├─ App.jsx                  # composição da página (ordem em funil)
├─ index.css                # base, tokens e utilitários
├─ media.js                 # ▶ manifesto de mídia (vídeos/imagens)
├─ i18n.jsx                 # 🌐 textos PT/EN/ES + LanguageProvider/useT
├─ cart.jsx                 # 🛍️ carrinho client-side (CartProvider/useCart)
├─ data/catalog.js          # segmentos + catálogo (slug, sku, tamanhos, galeria…)
├─ data/blog.js             # artigos do blog
├─ pages/
│  ├─ Home.jsx              # landing (funil de seções)
│  ├─ ProductPage.jsx       # página de produto (PDP)
│  ├─ SegmentPage.jsx       # /segmento/:id (vitrine por segmento)
│  ├─ BlogIndex.jsx · Article.jsx   # /blog e /blog/:slug
│  ├─ Checkout.jsx          # /checkout (sem backend)
│  └─ Account.jsx           # /conta (login mock + painel)
└─ components/
   ├─ Logo · Button · SectionHeading · Reveal               # primitivas
   ├─ EditorialImage · MediaFrame                           # mídia (placeholder + real)
   ├─ AnnouncementBar · Navbar                              # topo
   ├─ Hero (slider) · FeaturesBar                           # abertura + USPs
   ├─ Segments · Tabs · ProductCard · ProductCarousel · Catalog
   ├─ EstudioCriacao · Clientes · Blog                      # lookbook · prova social · conteúdo
   ├─ Historia · Esg · Diferenciais                         # institucional
   ├─ Newsletter · Footer · WhatsappFloat
```

## Notas de adaptação

- A fonte de marca **"Calendary"** (script proprietária) foi substituída por
  **Parisienne** — troque em `tailwind.config.js` (`fontFamily.script`) se obtiver
  a original.
- Telefones, e-mails e CNPJ são **placeholders** — substitua pelos dados reais.
- Catálogo (`src/data/catalog.js`) usa preços ilustrativos; projetos corporativos
  seguem orçamento consultivo.
