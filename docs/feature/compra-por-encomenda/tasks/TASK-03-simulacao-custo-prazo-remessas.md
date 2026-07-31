# TASK-03 - Simulação custo x prazo com detalhamento por remessa/OT

## Metadados

- **Prioridade:** P0
- **Status:** Não iniciada
- **Dependências:** TASK-02
- **Bloqueia:** TASK-04, TASK-06

> **Nota de escopo:** as versões anteriores desta tarefa (antigas TASK-02 "tela de simulação" e TASK-03 "detalhamento por remessa") viviam dentro da etapa Entrega do carrinho e assumiam remessas mistas (`PRONTA_ENTREGA`/`ENCOMENDA`) no mesmo plano. As duas foram fundidas em uma só, porque agora fazem parte do mesmo passo 2 da jornada de Encomenda (`ProductionOrderSteps`, TASK-02) — e todas as remessas exibidas aqui são, por definição, `ENCOMENDA`.

## Objetivo

Implementar o passo 2 ("Simulação") da jornada de Pedido de Encomenda: ao entrar neste passo, chamar `POST /production-order/simulate` (TASK-01) com `productId`/`desiredQuantity` (gravados no passo 1), exibir **sempre as duas simulações completas** — modo custo e modo prazo — lado a lado, e, dentro do plano selecionado, o **detalhamento por remessa/OT** (accordion + timeline), permitindo ao cliente escolher um modo e avançar para a confirmação.

## Escopo

- Chamar `SimulateProductionOrder` (TASK-01) ao entrar no passo, usando `productId`/`desiredQuantity` da store.
- Renderizar um seletor de modo (Custo × Prazo) com resumo de cada um (custo total, prazo máximo) — dois `ZCard` lado a lado, sem necessidade de nova chamada de API ao alternar (os dois planos já vêm juntos na resposta).
- Dentro do plano selecionado, renderizar um `Accordion`/`AccordionTab` (um por remessa/OT) com um `ZTimeline` interno mostrando "Pedido confirmado" → "Produção estimada" → "Entrega estimada", e um aviso de que o prazo de produção é estimativa, não garantia contratual.
- Persistir `simulationMode` e `shipmentsSelected` na store da TASK-01.
- Tratar o caso `unavailable: true` (nenhuma OT com capacidade ativa) com uma mensagem clara — o refinamento visual completo é escopo da TASK-06.
- **Fora do escopo:** qualquer alteração no carrinho de Pronta Entrega; badges reutilizáveis de tipo de venda (não fazem sentido aqui, já que tudo é `ENCOMENDA` — a badge só é relevante na TASK-04, ao lado de pedidos de Pronta Entrega); loading/skeleton refinado (TASK-06).

## Arquivos previstos

- `src/app/production-order/components/simulation_step.tsx` (novo) — orquestra a chamada e a renderização deste passo.
- `src/app/production-order/components/plan_selector.tsx` (novo) — os dois `ZCard` de modo custo/prazo.
- `src/app/production-order/components/plan_selector.css` (novo).
- `src/app/production-order/components/shipment_accordion.tsx` (novo) — `Accordion`/`AccordionTab` + `ZTimeline` por remessa.
- `src/app/production-order/components/shipment_accordion.css` (novo).
- `src/app/production-order/components/components.tsx` (modificado, da TASK-02) — plugar `SimulationStep` no índice 1 do `ZSteps` próprio.
- `src/components/order/order.tsx` (somente leitura, referência de padrão — Accordion + ZTimeline já combinados nas linhas 126-202).

## Passos de implementação

1. Em `simulation_step.tsx`, no `useEffect` de entrada do passo, chamar `SimulateProductionOrder({ productId, quantity: desiredQuantity })` (TASK-01) e gravar o resultado via `setSimulation` na store.
2. Implementar `plan_selector.tsx`: dois `ZCard` (`col-12 md:col-6`), cada um com `ZRadioButton`, título em `<h2>` ("Modo custo" / "Modo prazo", fonte Libre Baskerville), `R$ {plan.totalCost.toFixed(2)}`, prazo máximo formatado, e badge de destaque (ex. "Mais barato"/"Mais rápido") com `var(--color-secondary)`. Selecionar grava `simulationMode` na store.
3. Implementar `shipment_accordion.tsx`: `Accordion`/`AccordionTab` (um por `shipment` do plano selecionado), `header` como render-prop (função, não string, para preservar a tipografia `<h2>` Libre Baskerville — se passado como string, o PrimeReact renderiza `<span>` puro e a fonte se perde). Corpo de cada aba: `ZTimeline` com "Pedido confirmado" → "Produção estimada" (`readyAt`) → "Entrega estimada" (`deliveryAt`), custo de frete da fatia, e um aviso textual fixo ("Prazo estimado de produção, não é uma garantia contratual.").
4. Tratar `simulation.unavailable === true`: renderizar uma mensagem neutra no lugar dos cards de plano (ex.: "No momento não há oficina com capacidade de produção disponível para este produto."), sem quebrar a navegação do wizard (botão "Voltar" continua funcional).
5. Botão "Continuar" habilitado só quando `simulationMode` estiver selecionado; ao clicar, avança para o passo 3 (Confirmação, TASK-04/06).
6. Ao trocar de modo (custo ↔ prazo), resetar o estado de aba expandida do `Accordion` — os dois planos podem ter números diferentes de remessas (o modo prazo pode particionar em mais OTs).

## Critérios de aceite

- Ao entrar no passo, a simulação é chamada automaticamente com os dados do passo 1.
- As duas simulações (custo e prazo) são sempre exibidas, nunca uma só.
- Alternar entre os dois modos não dispara nova chamada de rede.
- Cada remessa do plano selecionado aparece como uma aba de accordion independente, com timeline e aviso de estimativa.
- `unavailable: true` é tratado com mensagem clara, sem crash.
- Selecionar um modo e clicar "Continuar" grava `simulationMode`/`shipmentsSelected` na store e avança o wizard.
- Nenhum arquivo de `src/app/cart/**` foi alterado.

## Validação

- Teste manual com mock da API: reproduzir o cenário da escola (encomenda de 30 ou 50 unidades, OT A 35/mês, OT B 15/mês) e confirmar que os dois planos aparecem com fatiamento coerente.
- Testar o caso `unavailable: true`.
- Testar troca de modo repetidamente, verificando que o accordion não fica em estado inconsistente.
- Inspecionar em 1440, 1024, 768, 390 e 360 px.
- Testar navegação só por teclado no accordion e nos radiobuttons de plano.
- Rodar ESLint e build do Next.js.

## Riscos

- Contrato pode divergir do que o backend real (`HT-ENCOMENDA-BACK-001`) entregar.
- Perda da tipografia Libre Baskerville se o `header` do `AccordionTab` for implementado como string.
- `--text-lg` não confiável por causa do bug de sintaxe em `globals.css:12` — evitar depender desse token.

## Mitigação

- Isolar o acesso aos campos da resposta atrás de acessos defensivos (`?.`, fallback), com tratamento de erro genérico quando o formato não bater com o esperado.
- Usar sempre `header={() => (...)}` (render-prop), nunca string, no `AccordionTab`.
- Usar `h2`/`h4`/tamanhos explícitos nos componentes novos em vez de `--text-lg`.
