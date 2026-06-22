/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // === Identidade Office Collection (temas via CSS vars — claro/escuro) ===
        wine: {
          DEFAULT: "rgb(var(--c-wine) / <alpha-value>)", // bordô assinatura
          deep: "rgb(var(--c-wine-deep) / <alpha-value>)", // hover
          soft: "rgb(var(--c-wine-soft) / <alpha-value>)",
          tint: "rgb(var(--c-wine-tint) / <alpha-value>)", // wash de fundo
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)", // texto/headings (inverte no dark)
          soft: "rgb(var(--c-ink-soft) / <alpha-value>)",
        },
        navy: {
          DEFAULT: "rgb(var(--c-navy) / <alpha-value>)",
          soft: "rgb(var(--c-navy-soft) / <alpha-value>)",
        },
        cream: "rgb(var(--c-cream) / <alpha-value>)", // fundo da página
        surface: "rgb(var(--c-surface) / <alpha-value>)", // cards/seções claras
        graphite: "rgb(var(--c-graphite) / <alpha-value>)", // superfície escura fixa (hero/ESG/botões)
        stone: "rgb(var(--c-stone) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        footer: {
          bg: "rgb(var(--c-footer-bg) / <alpha-value>)",
          text: "rgb(var(--c-footer-text) / <alpha-value>)",
          line: "rgb(var(--c-footer-line) / <alpha-value>)",
        },
      },
      fontFamily: {
        // serif editorial de alta-costura — logo "OFFICE" e títulos display
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        // script manuscrita elegante — substituta de "Calendary"
        script: ['"Parisienne"', "cursive"],
        // corpo de texto humanista limpo
        body: ['"Jost"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "1600px",
        content: "1180px",
      },
      borderRadius: {
        DEFAULT: "0",
        btn: "2px",
        pill: "999px",
      },
      letterSpacing: {
        label: "0.22em",
        wide2: "0.12em",
      },
      transitionDuration: {
        image: "600ms",
      },
      boxShadow: {
        card: "0 18px 40px -28px rgba(38,35,35,0.45)",
        lift: "0 30px 60px -30px rgba(38,35,35,0.55)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.45)" },
          "70%": { boxShadow: "0 0 0 16px rgba(37,211,102,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        kenburns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.12) translate(-1.5%, -1%)" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translateY(14px)", opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 40s linear infinite",
        "pulse-ring": "pulse-ring 2.4s infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 1.2s ease both",
        kenburns: "kenburns 18s ease-in-out infinite alternate",
        "scroll-cue": "scroll-cue 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
