# Office Collection — Monorepo

Repositório dos projetos digitais da **Office Collection · Moda Profissional**.
Estruturado para crescer: cada produto (site, portais, lojas) vive em `apps/`, com
componentes compartilhados em `packages/`.

## Estrutura

```
.
├── apps/
│   └── site-institucional/     # Site institucional + vitrine (React + Vite) — NO AR
│   # (próximos) portal-colaboradores/   e-commerce corporativo (ex.: Einstein)
│   # (próximos) loja-alunos/            e-commerce com checkout (ex.: Alunos Einstein)
├── packages/                   # (futuro) UI/brand kit, libs compartilhadas
├── docs/                       # 🔒 documentos internos — NÃO versionado (ver abaixo)
└── README.md
```

> **`docs/` é interno e não vai para o Git** (proposta, arquitetura, levantamento e
> documentos de clientes). Serve para a organização e a troca interna do time. Está no
> `.gitignore`.

## Apps

### `apps/site-institucional`
Site institucional + vitrine de produtos (React + Vite + Tailwind), com i18n (PT/EN/ES),
dark mode e catálogo. Deploy na Vercel.

```bash
cd apps/site-institucional
npm install
npm run dev      # desenvolvimento
npm run build    # produção (dist/)
```

## Roadmap de produtos
1. **Site institucional** — ✅ no ar (geração de leads).
2. **Portal de colaboradores** (corporativo, sem checkout) — caso Einstein. **Em desenho.**
3. **Loja de alunos** (e-commerce com checkout) — Alunos Einstein. Fase posterior.

## Convenções
- Cada app é autocontido (seu `package.json`, build e deploy).
- Código compartilhado → `packages/` (quando houver mais de um app consumindo).
- Documentação de projeto/cliente → `docs/` (local/interno, fora do Git).
