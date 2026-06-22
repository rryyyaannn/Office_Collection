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
supabase/    # (futuro) migrations e funções do banco (migrations-as-code)
docs/        # 🔒 documentação interna — NÃO versionada (ver índice docs/README.md)
.claude/     # skills/agents/config do projeto (compartilhado)
CLAUDE.md    # este arquivo
```
> `docs/` e `skills/` estão no `.gitignore`. **CLAUDE.md e `.claude/` SÃO versionados.**

## Stack e infraestrutura
- **Front**: React + Vite + Tailwind (institucional). Portais autenticados serão rotas/apps.
- **Back/dados**: **Supabase** (Postgres + Auth + **RLS** + Edge Functions + Storage).
  - Projeto: `https://sbtzpgkzcpicnenpjros.supabase.co` (ref `sbtzpgkzcpicnenpjros`).
  - **Atuação via Supabase CLI no terminal** (MCP ocupado). Dados/credenciais entram **quando o
    Ryan passar** — não pedir antes da hora; **nunca** commitar segredo.
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
- 🔜 **Fase 1 (portal colaboradores)**: criar esquema Supabase (multi-tenant + RLS) em **dev**,
  **importador** (Make → Edge Function) e portal do colaborador.
- ⛔ **Bloqueios**: leitura das planilhas SharePoint (Thamires), **API Organiza Têxtil**
  (creds/docs), 2º fator no cadastro (campo extra na planilha). Ver
  `docs/levantamento/perguntas-levantamento.md`.
- 🛠️ Em paralelo: gerar tabela **cargo→kit + aliases** (cargos reais já extraídos: ~329 textos →
  ~15–25 cargos canônicos).
