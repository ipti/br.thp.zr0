# TASK-02 - Nova jornada de Encomenda (rota e formulário de quantidade)

## Metadados

- **Prioridade:** P0
- **Status:** Não iniciada
- **Dependências:** TASK-01
- **Bloqueia:** TASK-03

> **Nota de escopo:** a versão anterior desta tarefa integrava a simulação como uma sub-etapa dentro de `Delivery` (`src/app/cart/components/delivery/delivery.tsx`), etapa "Entrega" do wizard de carrinho existente. Isso foi descartado: a jornada de Encomenda agora é uma **rota própria, fora do carrinho**, com seu próprio ponto de entrada a partir da página de produto.

## Objetivo

Criar a rota `/production-order` (ou `/encomenda`, a confirmar com produto) com um wizard próprio e pequeno (3 passos: Quantidade → Simulação → Confirmação, usando `ZSteps` de forma independente do `ZSteps` do carrinho), e o primeiro passo — formulário de quantidade desejada — funcional. O ponto de entrada é um CTA "Comprar sob encomenda" na página de produto, sempre visível (a quantidade é livre, não depende de o estoque ter acabado).

## Escopo

- Criar `src/app/production-order/page.tsx` e `src/app/production-order/components/components.tsx` (orquestrador do wizard próprio, 3 passos).
- Criar `src/app/production-order/components/quantity_form.tsx` (Formik + Yup, mesmo padrão de validação já usado no projeto): campo de quantidade (`number`, mínimo 1), exibindo o produto selecionado (nome, imagem, se vier por query param `?productId=`).
- Adicionar o CTA "Comprar sob encomenda" na página de produto (`src/app/product/[id]/...`), navegando para `/production-order?productId=...`.
- Ao submeter o formulário, gravar `productId`/`desiredQuantity` na store da TASK-01 (`useProductionOrderStore.setDesiredQuantity`) e avançar para o passo 2 (implementado na TASK-03).
- **Fora do escopo:** a tela de simulação em si (TASK-03); qualquer alteração no carrinho de Pronta Entrega (TASK-05); estados de loading/empty state refinados (TASK-06).

## Arquivos previstos

- `src/app/production-order/page.tsx` (novo).
- `src/app/production-order/components/components.tsx` (novo) — orquestrador com `ZSteps` próprio (`["Quantidade", "Simulação", "Confirmação"]`), estado `activeIndex` local (sem depender de `?index=` do carrinho).
- `src/app/production-order/components/quantity_form.tsx` (novo).
- `src/app/production-order/components/quantity_form.css` (novo, se necessário).
- `src/app/product/[id]/...` (modificado) — adicionar o CTA de entrada.

## Passos de implementação

1. Criar `page.tsx` renderizando `<ProductionOrderSteps />` (nome sugerido para o componente de `components.tsx`).
2. Implementar `components.tsx`: `ZSteps` com 3 itens, `activeIndex` como estado local (`useState`), renderização condicional (`QuantityForm` no índice 0; os componentes das TASK-03/04 nos índices 1/2, ainda não implementados nesta task — usar um placeholder simples).
3. Implementar `quantity_form.tsx`: buscar dados básicos do produto (nome, imagem, preço) via o mesmo serviço já usado na página de produto, se `productId` vier via query param; campo de quantidade com Formik + Yup (`Yup.number().min(1).required()`); ao submeter, chamar `setDesiredQuantity` (TASK-01) e `handleActiveIndex(1)`.
4. Adicionar o CTA "Comprar sob encomenda" na página de produto, com `Link`/`router.push` para `/production-order?productId=${product.uid}`. Não remover nem alterar nenhum CTA existente ("Adicionar ao carrinho" etc.).
5. Garantir que a rota funcione mesmo sem `productId` na query (o formulário permite buscar/selecionar o produto manualmente, ou — mais simples para o MVP — exige que `productId` venha preenchido e mostra erro amigável se não vier).

## Critérios de aceite

- `/production-order?productId=...` carrega e exibe o `ZSteps` próprio com 3 passos, começando no passo "Quantidade".
- O formulário aceita qualquer quantidade `>= 1`, sem nenhum limite derivado de estoque.
- Submeter o formulário grava `productId`/`desiredQuantity` na store da TASK-01 e avança para o passo 2.
- O CTA "Comprar sob encomenda" aparece na página de produto e navega corretamente, sem afetar os CTAs existentes.
- Nenhum arquivo de `src/app/cart/**` foi alterado.
- Build e lint passam sem novos erros.

## Validação

- Teste manual: acessar a página de produto, clicar em "Comprar sob encomenda", preencher a quantidade e confirmar o avanço de passo.
- Testar acesso direto à rota sem `productId` — confirmar mensagem de erro amigável, sem crash.
- Rodar ESLint e build do Next.js.
- Confirmar via DevTools que a store `useProductionOrderStore` (não `useCartStepsStore`) é a que grava os dados.

## Riscos

- Definição final da URL pública (`/production-order` vs. `/encomenda`) pode mudar por decisão de produto/SEO — mantê-la centralizada (não hardcoded em múltiplos lugares) facilita o ajuste.
- CTA na página de produto pode competir visualmente com o CTA principal de "Adicionar ao carrinho" — validar com design antes do rollout.

## Mitigação

- Centralizar a rota em uma constante (`PRODUCTION_ORDER_ROUTE = '/production-order'`) reaproveitada em todos os links.
- Posicionar o CTA de encomenda como ação secundária (ex.: `ZButton` com `severity="secondary"` ou link textual), não competindo visualmente com o CTA primário do produto.
