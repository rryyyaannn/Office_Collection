/* ============================================================================
   MANIFESTO DE MÍDIA — Office Collection
   ----------------------------------------------------------------------------
   ÚNICO lugar para plugar vídeos e imagens. Os arquivos vivem em /public/media/.

   >>> Mídia 100% OFICIAL da Office Collection:
       - Hero banner 1: vídeo teaser oficial (hero-teaser.mp4).
       - Hero banners 2/3: fotos oficiais (oc-banner-a/b).
       - Estúdio de Criação: vídeo explicativo oficial do Lookbook (lookbook-oc.mp4).
       - Segmentos e produtos: fotos oficiais de modelo (oc-1..5).
       - Nossa História: foto da premiação (oc-premiacao.png).

   Para trocar qualquer mídia, substitua o arquivo em /public/media/ mantendo
   o nome — ou ajuste o `src` abaixo.

   ⚠ CACHE: ao substituir um arquivo MANTENDO o mesmo nome, o navegador pode
     continuar mostrando o antigo. Solução: use um nome NOVO (e atualize o `src`)
     ou recarregue forçando o cache com Ctrl + Shift + R.
   ============================================================================ */

// Etiquetas indicando os slots de mídia. false = mídia real ativa.
export const SHOW_MEDIA_HINTS = false;

export const MEDIA = {
  // ===== HERO: slider de banners =====
  heroSlides: [
    { type: "video", src: "/media/hero-teaser.mp4", poster: "/media/hero-teaser-poster.jpg", path: "/media/hero-teaser.mp4", note: "Banner 1 · vídeo teaser oficial · 16:9" },
    { type: "image", src: "/media/oc-banner-a.jpg", poster: null, path: "/media/oc-banner-a.jpg", note: "Banner 2 · Social/Corporativo (foto oficial)" },
    { type: "image", src: "/media/oc-banner-b.jpg", poster: null, path: "/media/oc-banner-b.jpg", note: "Banner 3 · Coleção/História (foto oficial)" },
  ],

  // ===== Estúdio de Criação (Lookbook) — vídeo explicativo oficial =====
  estudio: {
    type: "video",
    src: "/media/lookbook-oc-sound.mp4",
    poster: "/media/lookbook-oc-poster.jpg",
    path: "/media/lookbook-oc-sound.mp4",
    note: "Vídeo explicativo do Lookbook (oficial, com áudio) · 16:9",
  },

  // ===== Nossa História — foto da premiação =====
  premiacao: {
    type: "image",
    src: "/media/oc-premiacao.png",
    path: "/media/oc-premiacao.png",
    note: "Premiação · 15 anos melhor fornecedor de hotelaria (foto oficial)",
  },

  // ===== Fotos por segmento (fotos oficiais de modelo) =====
  segments: {
    saude: { type: "image", src: "/media/oc-3.jpg", path: "/media/oc-3.jpg", note: "Saúde · scrub (foto oficial)" },
    hotelaria: { type: "image", src: "/media/oc-5.jpg", path: "/media/oc-5.jpg", note: "Hotelaria (foto oficial)" },
    aviacao: { type: "image", src: "/media/oc-1.jpg", path: "/media/oc-1.jpg", note: "Aviação · uniforme navy (foto oficial)" },
    social: { type: "image", src: "/media/oc-2.jpg", path: "/media/oc-2.jpg", note: "Social · blusa bordô (foto oficial)" },
  },

  // Fotos de produto: pool de fotos oficiais (oc-1..5), em src/data/catalog.js.
};
