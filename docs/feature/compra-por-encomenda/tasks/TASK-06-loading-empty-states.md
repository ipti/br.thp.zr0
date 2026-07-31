# TASK-06 - Loading, skeleton e empty states da jornada de Encomenda

## Metadados

- **Prioridade:** P1
- **Status:** Não iniciada
- **Dependências:** TASK-02, TASK-03
- **Bloqueia:** TASK-07

> **Nota de escopo:** a versão anterior desta tarefa cobria estados de loading dentro do wizard de carrinho existente (`delivery.tsx`, `payment.tsx`, `order/[id]`). Como a simulação de encomenda deixou de viver dentro do carrinho, o escopo desta tarefa passa a ser **a jornada de Encomenda** (`src/app/production-order/`), inteiramente nova. As correções pontuais de loading em `payment.tsx`/`order/[id]` (bugs pré-existentes, não específicos desta feature) deixam de fazer parte desta tarefa — podem ser reportadas separadamente se ainda forem relevantes, mas não bloqueiam esta entrega.

## Objetivo

Garantir que a jornada de Pedido de Encomenda (`/production-order`, TASK-02/03) nunca deixe o cliente diante de uma tela em branco, de um salto de layout ou de um erro genérico quando a situação é esperada do negócio (produto sem nenhuma OT com capacidade de produção cadastrada).

## Escopo

- Skeleton de carregamento para a chamada de simulação (`POST /production-order/simulate`, dual-plan custo/prazo) no passo 2 da jornada.
- Skeleton para o detalhamento por remessa/OT (accordion/`ZTimeline`) enquanto os dados não chegam ou enquanto o usuário alterna entre modo custo e modo prazo.
- Empty state explícito (`ZEmptyState`, novo componente reutilizável) para o caso `unavailable: true` — produto sem nenhuma OT com `production_capacity.active=true` — nunca um `Swal.fire` de erro genérico para esta situação esperada.
- Loading do botão "Continuar" ao trocar de modo (evitar clique duplo com plano desatualizado).
- **Fora de escopo:** qualquer correção de bug de loading pré-existente fora da jornada de encomenda (`payment.tsx`, `order/[id]`); o algoritmo de simulação em si (backend).

## Arquivos previstos

- `src/app/production-order/components/simulation_step.tsx` (modificado, da TASK-03) — skeleton durante a chamada de simulação.
- `src/app/production-order/components/plan_selector.tsx` (modificado) — loading ao trocar de modo.
- `src/app/production-order/components/shipment_accordion.tsx` (modificado) — skeleton por remessa.
- `src/components/empty_state/empty_state.tsx` (novo) — `ZEmptyState`, componente genérico reutilizável.
- `src/components/empty_state/empty_state.css` (novo).
- `src/components/skeleton/skeleton.tsx`/`skeleton.css` (reaproveitados, sem alteração estrutural).

## Passos de implementação

1. Implementar `ZEmptyState` (`icon`, `title`, `description`, `action?`), seguindo o padrão minimalista já usado no projeto (ex.: `details_product.tsx`, "Sem estoque"; `cart_list.tsx`, "Seu carrinho está vazio.").
2. Em `simulation_step.tsx`, exibir skeleton (`ZSkeleton`) enquanto a chamada a `POST /production-order/simulate` está em andamento — dois blocos lado a lado (custo/prazo), refletindo o layout final de `plan_selector.tsx`.
3. Em `shipment_accordion.tsx`, exibir de 1 a 2 `AccordionTab` placeholder com `ZSkeleton` no lugar de rótulo/prazo/custo, evitando salto de altura quando o conteúdo real chegar.
4. Tratar `simulation.unavailable === true` com `ZEmptyState` (ícone `pi pi-exclamation-triangle`, título "Sem capacidade de produção disponível", descrição explicando que o produto não pode ser encomendado no momento), nunca com `Swal.fire`.
5. Estender o `loading` do botão "Continuar" para cobrir o momento de troca de modo, se houver algum recálculo local perceptível (mesmo que os dois planos já venham prontos, garantir que não há duplo clique durante uma re-renderização).
6. Revisar a copy em português de todos os novos estados, consistente com o tom já usado no projeto.

## Critérios de aceite

- Nenhuma tela da jornada de Encomenda fica em branco entre a submissão do formulário de quantidade e a resposta da simulação.
- `unavailable: true` renderiza `ZEmptyState` com mensagem explícita, nunca `Swal.fire` nem tela quebrada.
- Skeletons seguem a paleta já definida em `skeleton.css`, sem cores novas.
- Nenhum novo estado usa altura fixa que quebre o layout.
- Textos em português revisados e consistentes com o tom do projeto.

## Validação

- Simular rede lenta (DevTools throttling) na jornada de Encomenda e conferir skeleton.
- Mockar `unavailable: true` e conferir `ZEmptyState`.
- Forçar erro de rede genuíno e conferir que continua caindo no modal padrão, sem se confundir com o empty state.
- Rodar ESLint e build do Next.js.
- Inspecionar em 1440, 768 e 390 px.

## Riscos

- O contrato de resposta da simulação (TASK-01/03) pode mudar depois que esta tarefa começar, exigindo ajuste dos skeletons.
- Reaproveitar `Swal.fire` por hábito para o caso "sem capacidade" passaria falsa impressão de erro ao cliente.

## Mitigação

- Fechar o contrato de tipos junto com a TASK-01/03 antes de finalizar os skeletons.
- Documentar explicitamente (checklist de PR) que "sem capacidade cadastrada" usa `ZEmptyState` inline, nunca `Swal.fire`.
