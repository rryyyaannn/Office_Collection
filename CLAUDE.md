# CLAUDE.md — Office Collection (parceria de TI)

> Memória viva do projeto. **Leia isto no início de cada sessão.** Mantenha atualizado:
> sempre que tomarmos uma decisão, descobrirmos algo ou definirmos um processo, registre aqui
> (resumo) e em `docs/` (detalhe). Antes de **grandes saltos**, consulte os **ADRs** (`docs/decisoes/`).

## Quem somos
Atuamos como **consultoria sênior de TI** da **Office Collection** (fabricante de uniformes
corporativos, Porto Alegre/RS): **dev sênior, design sênior, consultoria de TI, segurança de
dados**. Escopo de longo prazo: deste projeto (automação do contrato Einstein) até **integrar os
sistemas num middleware** e, no futuro, **substituir o site**. O Claude é parceiro do projeto —
deve **anotar, organizar e não se perder**.

## O que estamos construindo
1. **Site institucional** — ✅ no ar (geração de leads). `apps/site-institucional`.
2. **Portal de colaboradores** (e-commerce corporativo, sem checkout) — **caso Hospital Albert
   Einstein**. **Foco atual** (em desenho/Fase 1).
3. **Loja de alunos** (e-commerce com checkout) — Alunos Einstein. **Fase posterior.**
4. **Middleware/integrações** (ERP, SharePoint, WhatsApp, Correios) — evolução.

## Estrutura do repositório (monorepo)
```
apps/        # cada produto (site, portais, lojas) — autocontido
packages/    # (futuro) UI/brand kit, db, clients de integração compartilhados
supabase/    # migrations + seed + Edge Functions do banco (migrations-as-code)
docs/        # 🔒 documentação interna — NÃO versionada (ver índice docs/README.md)
.claude/     # 🔒 skills/agents/config locais — NÃO versionado
CLAUDE.md    # este arquivo
```
> `docs/` e `.claude/` estão no `.gitignore`. **CLAUDE.md é versionado.**

## Stack e infraestrutura
- **Front**: React + Vite + Tailwind (institucional). Portais autenticados serão rotas/apps.
- **Back/dados**: **Supabase** (Postgres + Auth + **RLS** + Edge Functions + Storage).
  - **DEV** = projeto **`Office_Collection`** (ref `sbtzpgkzcpicnenpjros`, org `rmmvm…` — separada do DeHu).
    Schema (18 tabelas + RLS) + seed + Edge Function `importar-cadastro` **aplicados e testados** (jun/2026).
    **PROD** = projeto separado, criado só no go-live (estratégia DEV+PROD separados).
  - **Acesso**: o **MCP do Supabase só enxerga o DeHu** (outra org). O Office gerencia-se via **CLI/
    Management API** com o token do Ryan (`supabase/.env`, gitignored). Atalho local: `supabase/_apply.py`
    (roda .sql) e `supabase/_q.py` (roda query) usando a Management API (não precisa de senha do banco).
  - ⚠️ `ndvdpjdqhnuxvmpensxy` é o banco do **app DeHu** (produção real) — **NUNCA** tocar.
  - **nunca** commitar segredo; segredos só em `supabase/.env`.
- **Hospedagem**: Vercel (deploy do `apps/site-institucional`).
- **Região de dados**: **Brasil (São Paulo / `sa-east-1`)** — LGPD + latência.

## Decisões-chave (resumo — detalhe em `docs/decisoes/`)
| ADR | Decisão |
|-----|---------|
| 0001 | Stack: Supabase + Vercel + React; dados no Brasil/SP |
| 0002 | **Monorepo** (apps/packages/supabase); rever se a fronteira de segurança/time exigir separar |
| 0003 | **ERP = Organiza Têxtil** (substituiu o CIGAM) — integrar via API |
| 0004 | **Ingestão da planilha**: **Make.com (gatilho) → Supabase Edge Function (importador idempotente)** — **nunca** inserir com anon key; service_role no servidor; + poll de reconciliação; trocável por Graph/Power Automate |
| 0005 | **Faturamento mensal** mantém o modelo do contrato; tudo vai ao ERP; **NF mensal consolidada por cliente** (027298 SP / 030262 GO) sai do ERP (fallback: relatório da plataforma). Acaba a planilha manual |
| 0006 | **Onboarding seguro**: cadastro automático pela planilha + ativação por **CPF + 2º fator + senha própria** + e-mail verificado. **Sem** "CPF = senha" |
| 0007 | **Ambientes e dados**: separar dev/staging/prod; **NUNCA usar dados de produção em dev**; RLS multi-tenant desde o dia 1; migrations-as-code |
| 0008 | **`supabase/` NÃO versionado** (decisão do Ryan, jun/2026): migrations/seed/functions + segredos ficam **locais** (`.gitignore /supabase/`). Segredos só em `supabase/.env`. Tradeoff: sem histórico no git — avaliar repo **privado** só p/ o SQL depois |

### Confirmações do Einstein (jun/2026) — impactam o desenho
- **Entrega**: normalmente na **casa do colaborador**; **eventualmente** numa unidade do Einstein → pedido tem **destino selecionável** (casa/unidade).
- **Quantidade do kit**: regra é **kit completo**, mas há **exceções liberadas** (ex.: médico levar 1 jaleco) → **Office precisa de autonomia**: **Painel ADM configurável** (quantidade/regra por cargo e exceção por colaborador). *Requisito reforçado 2x.*
- **Planilha morre**: ela só compilava cliente+pedido+Correios para **emitir a NF no fim do mês** → nosso sistema gera o **registro + fechamento/faturamento mensal** (substitui a planilha). Confirma ADR-0005.
- **Organiza Têxtil**: integração com **e-commerce NÃO estava no escopo inicial** — precisa acordar com eles → **não depender** do ERP agora; nosso **registro/output é a fonte de verdade**; integração fica opcional/posterior (ADR-0003 segue, mas sem bloquear).

## Regras de trabalho (importante)
- **Nunca mexer em dados de produção.** Testar em ambiente isolado (Supabase **branch** ou
  projeto de dev) com **dados sintéticos/anonimizados**. Ver `docs/seguranca/`.
- **Segredos fora do repo** (env/variáveis; nunca em código ou commit).
- **RLS desde o dia 1** (isolamento por `tenant_id`); **migrations-as-code** (Supabase CLI).
- **Antes de grandes saltos**, ler os **ADRs** e a **política de segurança**. Mudou uma decisão?
  Crie/atualize um ADR.
- **Documentar**: decisão/descoberta/processo → resumo aqui + detalhe em `docs/`.
- **Confirmar antes** de ações irreversíveis/externas (deploy, push, mexer em terceiros).
- **PII**: do Einstein recebemos só nome/CPF/cargo; contato é autopreenchido com consentimento.

## Documentação (índice em `docs/README.md`)
- `docs/decisoes/` — **ADRs** (decisões freezadas).
- `docs/arquitetura/` — proposta técnica, banco de dados, autenticação.
- `docs/fluxos/` — fluxo de telas, fluxo real Einstein, **ingestão da planilha**.
- `docs/seguranca/` — política de segurança + LGPD + ambientes/testes.
- `docs/levantamento/` — perguntas, análise dos docs, **Colaboradores Einstein** (manual + planilha).
- `docs/comercial/` — proposta comercial + PDF.

## Estado atual / próximos passos
- ✅ Site institucional no ar; repo monorepo + git + docs internos estruturados.
- ✅ **Fase 1 — MVP do portal construído e verificado ponta a ponta com dados de teste**
  (`apps/portal-colaboradores`, **camada de dados mock**): importação→normalização cargo+CPF+fila
  de exceções → 1º acesso → catálogo por cargo → pedido (kit médico, bordado, regra residente) →
  **registro/output: ficha PDF + CSV/JSON no layout da aba "Pedidos"** → notificação WhatsApp
  (mock) → avanço de status (recebido→em separação→despachado c/ rastreio→entregue). Ver
  `apps/portal-colaboradores/README.md` (tabela de acoplamento).
- ✅ **`supabase/`** pronto p/ aplicar: `migrations/0001_schema.sql` (multi-tenant + RLS),
  `seed.sql` (tenant Einstein, cargos/aliases/kits/estoque), Edge Function `importar-cadastro`.
- ✅ **cargo→kit + aliases** (cargos reais: ~329 textos → ~12 canônicos) em `src/data/seed.js` e
  espelhado na Edge Function.
- ✅ **Supabase DEV aplicado** (`Office_Collection` ref `sbtzpgkzcpicnenpjros`): migrations
  `0001`→`0006`, seed + `seed_demo`, grants, Edge Functions `importar-cadastro` e `ativar-conta`.
- ✅ **App ligado no Supabase** (`VITE_DATA_SOURCE=supabase`): **Auth real** (e‑mail+senha, claims
  role/tenant/profile_id no JWT), 1º acesso via `ativar-conta`, dados de profiles/pedidos/imports no
  banco (catálogo estático). **Botão público de staff removido** (login real). Fachadas
  `auth.js`/`services.js` delegam a `src/lib/db.js`; mock vira fallback.
- ✅ **Segurança verificada (jun/2026)**: RLS isola colaborador (só vê o próprio; `[]` em dados de
  admin) e trigger `guard_profile_update` impede o colaborador de alterar status/cargo (testado).
  Reset de teste: `supabase/_reset_user.py <cpf>` e `_reset_demo.py --sim`. Guia:
  `docs/seguranca/operacao-dados.md`. Pendências p/ PROD: 2º fator no 1º acesso, verificação de
  e‑mail. Estratégia ambientes: 2 projetos (DEV+PROD); **branching só no go-live (Pro + repo privado)**.
- 🔜 **Acoplar** (pontos prontos): fonte real da planilha (Make→Edge), **API Organiza Têxtil**
  (`erpService`), **WhatsApp Cloud API** (`notificationService`).
- ⛔ **Bloqueios externos**: leitura das planilhas SharePoint (Thamires), creds/docs do Organiza
  Têxtil, 2º fator no cadastro (campo extra na planilha). Ver `docs/levantamento/perguntas-levantamento.md`.

### Notas de implementação (não regredir)
- `src/lib/store.js → useStore`: o `useSyncExternalStore` assina o **state inteiro** e aplica o
  seletor no render. **Não** retornar `.filter()/.map()` como snapshot (cria array novo a cada
  chamada → "Maximum update depth exceeded"). Todo `setState` deve retornar **objeto novo**.
