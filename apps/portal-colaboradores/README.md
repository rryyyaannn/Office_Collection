# Portal de Colaboradores — Office Collection

App React/Vite do **portal do colaborador** + **back-office** para o fluxo de fardamento
corporativo (caso Hospital Albert Einstein). Hoje roda com **camada de dados mock** (localStorage)
para demonstrar o fluxo ponta a ponta **sem** depender da API do Organiza Têxtil nem do acesso ao
Excel. Os pontos de acoplamento já estão isolados atrás de interfaces — trocar a implementação não
muda as telas.

## Rodar

```bash
npm install
npm run dev      # http://localhost:5180
npm run build
```

Sem credenciais necessárias: `VITE_DATA_SOURCE=mock` é o padrão (ver `.env.example`).

## Fluxo demonstrado (com dados de teste)

```
Linha da planilha (mock) ─► importação (normaliza cargo→canônico, valida CPF, fila de exceções)
  ─► colaborador faz 1º acesso (CPF + senha) ─► catálogo do CARGO (kit, regras, bordado)
  ─► pedido (tamanho, bordado p/ médico≠residente, unidade) ─► roteia estoque×produzir
  ─► REGISTRO/OUTPUT: ficha PDF (window.print) + export CSV/JSON no layout da aba "Pedidos"
  ─► notificação WhatsApp (mock) ─► status: recebido→em separação→despachado(rastreio)→entregue
```

Atalhos de demonstração na tela de login: CPF `1234567` (atendimento) e `7654321` (médico) — o 1º
acesso define a senha. "Entrar como equipe Office" abre o back-office.

## Arquitetura (ports & adapters — tudo trocável)

| Camada | Hoje (mock) | Próximo passo (acoplamento) |
|---|---|---|
| **Dados** (`src/lib/store.js`) | reativa em `localStorage` | `@supabase/supabase-js` + RLS (já está em `package.json`) |
| **`importService`** | roda linhas de teste | trigger Make.com → Edge Function `importar-cadastro` (lógica idêntica, já em `supabase/functions/`) |
| **`erpService`** | gera ficha/CSV/JSON | adapter Organiza Têxtil (criar pedido / estoque / NF) |
| **`notificationService`** | registra em `notifications` | WhatsApp Cloud API |

Onde mexer ao acoplar:
- **Fonte do cadastro**: a normalização de cargo/CPF vive em `src/lib/normalize.js` e é espelhada em
  `supabase/functions/importar-cadastro/index.ts` — manter as duas em sincronia (ou extrair p/ pacote).
- **ERP**: `src/lib/services.js → erpService` produz as linhas no layout da aba "Pedidos"
  (`pedidoRows/toCSV/toJSON`). Trocar por chamadas ao Organiza mantendo o mesmo shape.
- **WhatsApp**: `notificationService.send()` — hoje só grava; plugar provider real aqui.

> ⚠️ Nunca usar a `service_role` do Supabase no front. Inserts da planilha são server-side
> (Edge Function com segredo). RLS desde o dia 1. Ver `CLAUDE.md` e `docs/decisoes/`.

## Estrutura

- `src/data/seed.js` — tenant Einstein, unidades, cargos, produtos, kits, estoque e linhas de teste.
- `src/lib/` — `normalize`, `store` (mock reativa), `services` (import/order/erp/notification),
  `auth` (CPF + 1º acesso).
- `src/pages/portal/` — Catálogo, Pedido, Meus pedidos (colaborador).
- `src/pages/admin/` — Painel, Importações, Colaboradores, Cargos & Kits, Pedidos, **PedidoFicha** (output).
