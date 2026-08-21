# Tarefas — Compra por Encomenda (Frontend)

## Convenções

- **Status inicial:** Não iniciada.
- **Prioridade:** P0 é bloqueadora, P1 é necessária para a entrega e P2 é melhoria de qualidade.
- Cada tarefa deve ser validada visualmente em desktop e mobile, seguindo a identidade visual já existente (PrimeReact, componentes `Z*`, cor de marca `#F07724`).
- A jornada de Encomenda (`src/app/production-order/`) nunca deve importar de `src/app/cart/`, e vice-versa — os dois fluxos são independentes.

## Mapa de tarefas

| Código | Tarefa | Prioridade | Dependência |
|---|---|---:|---|
| TASK-01 | Fundação: contratos da API de Encomenda e estado dedicado | P0 | Nenhuma (**Concluída**) |
| TASK-02 | Nova jornada de Encomenda (rota e formulário de quantidade) | P0 | TASK-01 (**Concluída**) |
| TASK-03 | Simulação custo x prazo com detalhamento por remessa/OT | P0 | TASK-02 (**Concluída**) |
| TASK-04 | Acompanhamento do Pedido de Encomenda (status de produção) | P1 | TASK-03 (**Concluída**) |
| TASK-05 | Ajuste do carrinho de Pronta Entrega para usar inventory | P1 | TASK-01 (**Concluída**) |
| TASK-06 | Loading, skeleton e empty states da jornada de encomenda | P1 | TASK-03 (**Concluída**) |
| TASK-07 | Testes de integração dos dois fluxos separadamente | P0 | TASK-01 a TASK-06 (**Concluída**) |

## Fluxo de execução

```text
TASK-01
  ├── TASK-02 ── TASK-03 ──┐
  │                TASK-04 │
  └── TASK-05              │
                       TASK-06
                            ↓
                       TASK-07
```

## Arquivos

- [TASK-01 — Fundação: contratos da API de Encomenda e estado dedicado](./TASK-01-fundacao-contratos-api.md)
- [TASK-02 — Nova jornada de Encomenda (rota e formulário de quantidade)](./TASK-02-jornada-encomenda-formulario.md)
- [TASK-03 — Simulação custo x prazo com detalhamento por remessa/OT](./TASK-03-simulacao-custo-prazo-remessas.md)
- [TASK-04 — Acompanhamento do Pedido de Encomenda](./TASK-04-acompanhamento-pedido-encomenda.md)
- [TASK-05 — Ajuste do carrinho de Pronta Entrega para usar inventory](./TASK-05-ajuste-carrinho-pronta-entrega.md)
- [TASK-06 — Loading, skeleton e empty states da jornada de encomenda](./TASK-06-loading-empty-states.md)
- [TASK-07 — Testes de integração dos dois fluxos separadamente](./TASK-07-testes-integracao.md)
