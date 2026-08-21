# TASK-04 - Acompanhamento do Pedido de Encomenda (status de produção)

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** TASK-03
- **Bloqueia:** TASK-07

## Nota de execução

Implementado conforme especificado. `ZSaleTypeBadge` (`src/components/badge/sale_type_badge.tsx`) criado sobre `ZBadge`, com as duas variantes simétricas (`ENCOMENDA` laranja `var(--color-secondary)`, `PRONTA_ENTREGA` neutra), inserida uma única vez no cabeçalho "Cliente" de `order.tsx` — antes dividida por `order_service`, agora no nível do pedido, refletindo `order.sale_type` (`OrderOneType` ganhou o campo).

A lógica de timeline foi extraída para uma função pura `buildOrderTimeline(paymentStatus, itemStatus, isEncomenda)`, reaproveitada tanto no branch de remessa única (`OrderOne`) quanto no `Accordion` de múltiplas remessas — evita duplicar a inserção do passo "Em produção" (mapeado a `IN_PRODUCTION`, cor própria via `--color-secondary`, nunca reaproveitando o verde de "pago") nos dois lugares. Datas estimadas (`estimated_ready_at`/`estimated_delivery_at`, via `formatDateToBR`) aparecem logo abaixo da timeline, só quando `order.sale_type === 'ENCOMENDA'` e a data existe — pedidos de Pronta Entrega não exibem essa seção, por não terem essas propriedades preenchidas.

`estimated_ready_at`/`estimated_delivery_at` foram adicionados às duas declarações de `OrderService` em `types.d.ts` (o arquivo já duplicava a interface por declaration merging, mesmo padrão apontado no risco do documento).

Tela de confirmação (`src/app/production-order/components/confirmation.tsx`, wired em `components.tsx` no índice 2, substituindo o placeholder da TASK-02/03): além do resumo com a badge (pedido pelo `Objetivo` desta task), a implementação foi além do mínimo e já conecta o fluxo real de finalização — seleção de endereço com estado local próprio (nunca reaproveitando `CardAddress`/`useCartStepsStore` do carrinho, que têm acoplamento direto ao estado do carrinho e violariam o isolamento), método de pagamento, e a chamada `Reserve` → `Create` (TASK-01) com redirecionamento para `/profile/order/[id]` ao final. Isso foi necessário porque a task, ao pedir uma "tela de confirmação... antes do redirecionamento", pressupõe que o redirecionamento de fato aconteça — não haveria como demonstrar/validar o resumo sem completar o fluxo até criar o pedido.

Lint: 0 erros/warnings nos arquivos novos (1 warning pré-existente de padrão `no-img-element`, igual ao já usado em `product_one.tsx`); os 18 erros de `no-explicit-any`/`no-unused-vars` reportados em `order.tsx`/`types.d.ts` são débito pré-existente em linhas não tocadas por esta task (confirmado via `git diff --unified=0`). `npx tsc --noEmit` sem erros novos. `next build` passa, rota `/production-order` cresce para 9.63 kB (wizard completo). `git status` confirma `src/app/cart/**` sem nenhuma alteração.

> **Nota de escopo:** a versão anterior desta tarefa criava um badge de tipo de venda por *remessa* (`order_service`/`order_item`), porque um pedido podia misturar Pronta Entrega e Encomenda. Isso foi descartado: `sale_type` agora vive no **pedido inteiro** (`order.sale_type`), então a distinção visual passa a ser feita **uma vez, no cabeçalho do pedido** — muito mais simples do que o desenho anterior.

## Objetivo

Fazer o pedido de Encomenda, depois de confirmado, ser corretamente identificável e acompanhável: (1) um indicativo claro no cabeçalho do pedido (`src/components/order/order.tsx`) mostrando que é um Pedido de Encomenda (não Pronta Entrega); (2) o passo "Em produção" na `ZTimeline` de cada remessa (`order_service`), mapeado ao status `IN_PRODUCTION` (já existente no enum, hoje nunca usado); (3) exibição das datas estimadas (`estimated_ready_at`/`estimated_delivery_at`) por remessa; (4) uma tela de confirmação, ao final da jornada de encomenda (passo 3 do wizard da TASK-02), que já mostra esse mesmo resumo antes mesmo de navegar para `/profile/order/[id]`.

## Escopo

- Componente `sale_type_badge.tsx` (`src/components/badge/sale_type_badge.tsx`), sobre `ZBadge`, com uma única variante relevante para o pedido: "Sob encomenda" (laranja, `--color-secondary`). Pedidos de Pronta Entrega podem simplesmente não exibir badge (ou exibir uma badge neutra "Pronta entrega") — o pedido já é identificável pela ausência do rótulo de encomenda, mas exibir os dois de forma simétrica é mais claro para o cliente.
- Em `src/components/order/order.tsx`: inserir a badge uma vez, no cabeçalho do pedido (não repetida por `order_service`), usando `order.sale_type`.
- Adicionar o passo "Em produção" à `ZTimeline` de cada `order_service`, quando `order.sale_type === 'ENCOMENDA'`, mapeado a `IN_PRODUCTION`.
- Exibir `estimated_ready_at`/`estimated_delivery_at` (formatados com `formatDateToBR`) por `order_service`, quando aplicável.
- Estender `src/app/profile/order/service/types.d.ts`: `OrderOneType` ganha `sale_type`; `OrderService` ganha `estimated_ready_at`/`estimated_delivery_at` (aplicar em ambas as declarações da interface, já que o arquivo hoje declara `OrderService`/`OrderItem` duas vezes por declaration merging).
- Adicionar a classe `.status.in_production` em `order.css` (e no CSS equivalente de `card.tsx`), com cor própria (não reaproveitar o verde de "pago/aprovado").
- Tela de confirmação (passo 3 da jornada de Encomenda, TASK-02): resumo simples reaproveitando a mesma badge e os mesmos dados, antes do redirecionamento para a tela de pedido.
- **Fora do escopo:** qualquer alteração no fluxo de Pronta Entrega além de, opcionalmente, exibir a badge "Pronta entrega" no mesmo lugar (mudança trivial, não estrutural); loading/skeleton refinado (TASK-06).

## Arquivos previstos

- `src/components/badge/sale_type_badge.tsx` (novo).
- `src/components/badge/sale_type_badge.css` (novo).
- `src/components/order/order.tsx` (modificado) — badge no cabeçalho; timeline de 5 passos para pedidos de Encomenda; datas estimadas por `order_service`.
- `src/components/order/order.css` (modificado) — `.status.in_production`.
- `src/app/profile/order/[id]/components/card/card.css` (modificado) — mesma classe, se duplicada aqui.
- `src/app/profile/order/service/types.d.ts` (modificado) — `sale_type` em `OrderOneType`; datas estimadas em `OrderService` (ambas as declarações).
- `src/app/production-order/components/confirmation.tsx` (modificado, da TASK-02/03) — reaproveitar a badge e o resumo.
- `src/utils/enum/order_status.ts` (somente leitura) — já mapeia `IN_PRODUCTION: 'Em Produção'`.

## Passos de implementação

1. Criar `sale_type_badge.tsx`: `ZSaleTypeBadge({ saleType }: { saleType: 'PRONTA_ENTREGA' | 'ENCOMENDA' })`, sobre `ZBadge` (`src/components/badge/badge.tsx`) com estilo próprio (não usa as cores de `severity` padrão do PrimeReact). `ENCOMENDA` → fundo `var(--color-secondary)`, texto branco; `PRONTA_ENTREGA` → fundo neutro.
2. Em `order.tsx`, inserir `<ZSaleTypeBadge saleType={order.sale_type} />` uma única vez, próximo ao identificador do pedido (`uid`), fora do `.map`/`Accordion` de `order_services`.
3. Dentro de cada `order_service` (tanto no branch de remessa única quanto no `Accordion` de múltiplas remessas), quando `order.sale_type === 'ENCOMENDA'`: usar uma variação da `ZTimeline` com o passo extra "Em produção" (entre "Pedido pago" e "Pedido enviado"), e exibir `estimated_ready_at`/`estimated_delivery_at` formatados.
4. Estender `src/app/profile/order/service/types.d.ts`: `OrderOneType.sale_type: 'PRONTA_ENTREGA' | 'ENCOMENDA'`; `OrderService.estimated_ready_at?: string`, `OrderService.estimated_delivery_at?: string` — aplicar nas duas declarações existentes da interface.
5. Adicionar `.status.in_production` em `order.css` (e replicar em `card.css`, se as classes de status estiverem duplicadas ali), com cor de referência `--color-secondary`.
6. Na tela de confirmação da jornada de Encomenda (`src/app/production-order/components/confirmation.tsx`, criada na TASK-02/03), reaproveitar `ZSaleTypeBadge` e exibir o mesmo resumo (remessas, datas, custo) antes do redirecionamento para `/profile/order/[id]`.

## Critérios de aceite

- A badge de tipo de venda aparece uma única vez por pedido, no cabeçalho, refletindo `order.sale_type`.
- Pedidos de Encomenda exibem o passo "Em produção" na timeline de cada remessa, com cor própria (não herdada do status "pago").
- Datas estimadas aparecem formatadas corretamente para remessas de Encomenda; pedidos de Pronta Entrega não exibem essas datas.
- `OrderOneType`/`OrderService` estendidos sem quebra de tipo, em ambas as declarações existentes.
- A tela de confirmação da jornada de Encomenda mostra o mesmo resumo antes do redirecionamento.
- Nenhuma regressão na exibição de pedidos de Pronta Entrega já existentes (que não têm `sale_type = ENCOMENDA` nem datas estimadas).

## Validação

- Teste manual com mock/fixture de um pedido de Encomenda com 1 e com 2+ remessas.
- Teste manual com um pedido de Pronta Entrega (regressão).
- Inspecionar em 1440, 1024, 768 e 390 px.
- Rodar ESLint e build do Next.js.

## Riscos

- O contrato real do backend (`order.sale_type`, `estimated_ready_at`/`estimated_delivery_at` por `order_service`) pode não estar disponível ainda — desenvolver contra mock tipado.
- `src/app/profile/order/service/types.d.ts` declara `OrderService`/`OrderItem` duas vezes (declaration merging) — fácil esquecer de atualizar uma das duas.

## Mitigação

- Desenvolver contra um mock local tipado (mesmo shape de `OrderOneType`) até o backend estar disponível.
- Ao editar `types.d.ts`, aplicar a mudança em todas as ocorrências de cada interface na mesma edição.
