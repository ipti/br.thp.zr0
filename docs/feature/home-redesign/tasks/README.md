# Tarefas — Modernização da Home

## Convenções

- **Status inicial:** Não iniciada.
- **Prioridade:** P0 é bloqueadora, P1 é necessária para a entrega e P2 é melhoria de qualidade.
- Cada tarefa deve gerar evidência visual nas resoluções indicadas.
- Alterações fora da Home devem ser verificadas para evitar regressão.

## Mapa de tarefas

| Código | Tarefa | Prioridade | Dependência |
|---|---|---:|---|
| TASK-01 | Fundação de layout e tokens | P0 | Nenhuma |
| TASK-02 | Header responsivo | P1 | TASK-01 |
| TASK-03 | Hero responsivo | P0 | TASK-01 |
| TASK-04 | Seção Sobre e vídeo | P0 | TASK-01 |
| TASK-05 | Indicadores de impacto | P1 | TASK-01, TASK-04 |
| TASK-06 | Showcase de produto | P0 | TASK-01 |
| TASK-07 | Footer e área segura do chat | P1 | TASK-01 |
| TASK-08 | Acessibilidade e performance | P1 | TASK-02 a TASK-07 |
| TASK-09 | Validação e regressão | P0 | TASK-01 a TASK-08 |

## Fluxo de execução

```text
TASK-01
  ├── TASK-02
  ├── TASK-03
  ├── TASK-04 ── TASK-05
  ├── TASK-06
  └── TASK-07
         ↓
      TASK-08
         ↓
      TASK-09
```

## Arquivos

- [TASK-01 — Fundação de layout e tokens](./TASK-01-fundacao-layout-tokens.md)
- [TASK-02 — Header responsivo](./TASK-02-header-responsivo.md)
- [TASK-03 — Hero responsivo](./TASK-03-hero-responsivo.md)
- [TASK-04 — Seção Sobre e vídeo](./TASK-04-sobre-video.md)
- [TASK-05 — Indicadores de impacto](./TASK-05-impacto.md)
- [TASK-06 — Showcase de produto](./TASK-06-showcase-produto.md)
- [TASK-07 — Footer e chat](./TASK-07-footer-chat.md)
- [TASK-08 — Acessibilidade e performance](./TASK-08-acessibilidade-performance.md)
- [TASK-09 — Validação e regressão](./TASK-09-validacao-regressao.md)

