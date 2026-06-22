# .claude/ — workspace do Claude no projeto

Configuração e extensões do Claude **compartilhadas** neste repositório (vão para o Git, exceto o
que for local). Assim o Claude tem **visão** das skills/agentes do projeto e o time compartilha a
mesma configuração.

## Estrutura
```
.claude/
├── skills/          # skills do projeto (Ryan adiciona aqui) — o Claude enxerga e usa
├── agents/          # (opcional) subagentes específicos do projeto
├── settings.json    # configuração compartilhada (versionada)
└── settings.local.json   # configuração LOCAL (NÃO versionada — segredos/permissões da máquina)
```

## Como usar
- **Skills**: coloque cada skill em `skills/<nome>/SKILL.md` (+ arquivos de apoio). Ficam
  disponíveis para o Claude neste projeto.
- **Memória**: a memória rápida do projeto fica em **`/CLAUDE.md`** (raiz); a documentação
  profunda em **`/docs/`**.
- **Não** coloque segredos aqui. Configuração com segredo/permissão de máquina vai em
  `settings.local.json` (ignorado pelo Git).

> Relacionado: `/CLAUDE.md` (regras de trabalho) e `docs/decisoes/` (ADRs).
