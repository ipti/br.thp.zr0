# Historia tecnica - Compra por Encomenda (Frontend)

## Identificação

- **Código:** HT-ENCOMENDA-FRONT-001
- **Título:** Nova jornada separada de Pedido de Encomenda (simulação custo × prazo); carrinho de Pronta Entrega mantido sem mudança estrutural
- **Relacionada a:** HF-ENCOMENDA-001
- **Repositório:** `br.thp.zr0` (frontend — Next.js 15 + PrimeReact 10 + PrimeFlex + zustand + @tanstack/react-query)
- **Prioridade:** Alta

## Objetivo técnico

Criar uma **jornada de compra nova e totalmente separada** do carrinho existente para o Pedido de Encomenda: o cliente informa a quantidade desejada de um produto, vê as duas simulações completas (**modo custo** e **modo prazo**) com detalhamento por remessa/OT, escolhe uma, e finaliza um pedido de encomenda dedicado — sem tocar no carrinho de Pronta Entrega em nenhum momento. O carrinho de Pronta Entrega (`ZSteps`: Carrinho → Endereço → Entrega → Confirmação → Pagamento) permanece essencialmente como está hoje, refletindo apenas a migração de estoque para `inventory` no backend (mudança invisível de UI).

> **Nota de escopo:** a versão original deste documento previa integrar a simulação custo/prazo como uma sub-etapa dentro da etapa "Entrega" do wizard de carrinho já existente. Essa abordagem foi descartada após revisão de produto: os dois fluxos (Pronta Entrega e Encomenda) precisam ser **jornadas de compra completamente desconectadas**, nunca lado a lado na mesma tela/momento. O texto abaixo já reflete o modelo revisado.

## Diagnóstico atual

### Orquestração do wizard de carrinho (fluxo de Pronta Entrega — não muda estruturalmente)

`src/app/cart/components/components.tsx` controla tudo via um único `activeIndex` (estado local sincronizado com `?index=` na URL, linhas 21-35) e um array `items: MenuItem[]` fixo com os 5 rótulos (linhas 56-77) passado para `ZSteps` (`src/components/steps/steps.tsx`, wrapper fino de `primereact/steps`). Cada etapa é um componente renderizado condicionalmente (linhas 91-105): `CartList` (0) → `Address` (1) → `Delivery` (2) → `Finish` (3) → `Payment` (4). Esta feature **não adiciona nem remove nenhum passo** deste wizard.

### Estado — duas stores zustand distintas, permanecem como estão

1. `useCartStore` (`src/service/store/cart_store.tsx`) — o carrinho em si (`CartItem[]`: id, price, quantity, variantId, cartItemId), persistido em `localStorage['cart_items']`.
2. `useCartStepsStore` (`src/app/cart/zustand/zustand.tsx`) — estado do wizard de Pronta Entrega (`cep`, `address_selected`, `product_selected`, `deliverySelected`), persistido em `localStorage['cart_state']`.

Nenhuma das duas é estendida por esta feature — a jornada de Encomenda precisa de uma store própria, independente (ver DT-02), justamente porque é um fluxo desconectado do carrinho.

### Etapa Entrega (`activeIndex === 2`) — permanece como está

`src/app/cart/components/delivery/delivery.tsx` continua chamando `ProductClientController.ShippingCalculateAction` (`src/app/product/service/controller.tsx:12-33`) para o cálculo de frete do que já está em estoque, exatamente como hoje. A única mudança de fundo é que o backend passa a somar `inventory` de todas as OTs (em vez de `transformation_workshop_product`) — invisível para este componente. Se a quantidade pedida exceder o disponível, o backend continua recusando/limitando (comportamento já existente, `orders.service.ts:135-140`), e esta feature não introduz nenhum fallback automático dentro deste fluxo.

### Tela de pedido — já preparada para múltiplas remessas

**`OrderCard`** (`src/app/profile/order/[id]/components/card/card.tsx`) delega para `src/components/order/order.tsx` (`Order`), que **já sabe renderizar múltiplos `order_services`** via `Accordion`/`AccordionTab` do PrimeReact + `ZTimeline` (`src/components/timeline/timeline.tsx`) por remessa (linhas 126-204), e já usa `orderStatus` (`src/utils/enum/order_status.ts`) — enum que já inclui `PENDING`, `IN_PRODUCTION`, `SHIPPED`, `COMPLETED`, `CANCELLED`, `SOLITED_CANCELLATION`. O vocabulário de status de produção e o padrão visual de "várias remessas" já existem e estão em produção.

Nota à parte: existe um segundo caminho `src/app/order/[id]/...` (sem `/profile`), com componentes praticamente duplicados mas usando um modelo de dados antigo — nenhuma navegação real aponta para ele. Não editar esse caminho órfão.

### Tipos e contratos hoje

- `src/app/product/service/type.d.ts`: `ShippingGetType`, `Result { bestOption, validOptions }` — modelados para **um único resultado de frete por workshop**, sem `saleType` nem `costPlan`/`deadlinePlan`. Este contrato continua servindo só o carrinho de Pronta Entrega; a jornada de Encomenda ganha seus próprios tipos (ver "Contrato consumido" abaixo), sem reaproveitar `ShippingGetType`.
- `src/app/profile/order/service/types.d.ts`: já modela `OrderOneType.order_services: OrderService[]` com `order_item[]`, `transformation_workshop`, `status`, `tracking_code` — base pronta para acrescentar `estimated_ready_at`/`estimated_delivery_at` por `order_service`, e um `sale_type` no nível do pedido (`OrderOneType.sale_type`, não mais por item, já que o backend agora modela isso no `order`).

### Identidade visual hoje (`globals.css`)

- Tokens já existentes e prontos para reuso: `--color-secondary: #F07724` (laranja) e `--primary-color: black`; hoje quase não usados no wizard — `--color-secondary` está livre para virar a cor de destaque da jornada de Encomenda como um todo (não só de uma badge).
- Tipografia: `h1`, `h3`, `h4`, `p`, `label` → `'Poppins Regular'`; `h2` → `'Libre Baskerville'` (única tag com essa fonte), convenção já usada para títulos de destaque (`card_delivery.tsx:12`).
- Risco herdado (fora do escopo, mas relevante para qualquer CSS novo): `globals.css:12` tem um seletor `:root` aninhado malformado, que deixa `--text-lg` não confiável. Componentes novos devem evitar depender desse token.

### Resumo das lacunas

1. Não existe nenhuma rota/jornada dedicada para "Pedido de Encomenda" — precisa ser criada do zero, fora de `src/app/cart/`.
2. Não existe formulário de captura de "quantidade desejada" independente do carrinho.
3. Não existe estado (zustand) dedicado à jornada de encomenda — precisa ser uma store nova e independente de `useCartStore`/`useCartStepsStore`.
4. Não existem componentes de simulação custo/prazo nem de detalhamento por remessa.
5. Nenhuma badge visual distingue pedidos de Pronta Entrega dos de Encomenda em nenhuma tela.
6. `Order`/`order.tsx` não expõe status de produção nem datas estimadas por remessa.

## Decisões técnicas

### DT-01 — Nova rota/jornada dedicada de Encomenda, fora do carrinho

Nova área de rotas, ex.: `src/app/production-order/` (sugestão de URL pública: `/encomenda`), completamente separada de `src/app/cart/`. Fluxo interno sugerido em 3 passos (com seu próprio `ZSteps`, pequeno e independente do `ZSteps` do carrinho, rótulos "Quantidade" → "Simulação" → "Confirmação"):

1. Formulário de quantidade desejada para um produto (`src/app/production-order/components/quantity_form.tsx`).
2. Tela de simulação custo × prazo com detalhamento por remessa/OT (DT-03/DT-04).
3. Confirmação e checkout dedicado do pedido de encomenda.

Ponto de entrada sugerido: um CTA "Comprar sob encomenda" na página de produto (`src/app/product/[id]/...`), sempre visível — a quantidade é livre e não depende de "faltar" nada no carrinho de Pronta Entrega.

### DT-02 — Estado dedicado: nova store zustand, independente do carrinho

Diferente do que faria sentido se a simulação estivesse dentro do carrinho, a jornada de Encomenda precisa de uma store própria: `src/app/production-order/zustand/zustand.tsx`, com um `ProductionOrderContextType` novo:

```ts
export interface ProductionOrderContextType {
  productId: string
  desiredQuantity: number
  simulationMode?: 'COST' | 'DEADLINE'
  costPlan?: ProductionOrderPlan
  deadlinePlan?: ProductionOrderPlan
  shipmentsSelected?: ProductionShipment[]
}
```

Esta store **não compartilha nada** com `useCartStore`/`useCartStepsStore` — reforça, no próprio código, que os dois fluxos são desconectados (ver Restrições).

### DT-03 — Tela de simulação custo × prazo

Novo componente `src/app/production-order/components/plan_selector.tsx`: dois `ZCard` (`src/components/card/card.tsx`) lado a lado (`col-12 md:col-6`), sombra padrão já usada em `card.css`, cada um com `ZRadioButton` para seleção única, título em `<h2>` ("Modo custo" / "Modo prazo", fonte Libre Baskerville — mesma convenção de `card_delivery.tsx:12`), valor total (`totalCost`), prazo máximo (`maxDeliveryDays`) e uma badge de destaque (ex.: "Mais barato" / "Mais rápido") usando `var(--color-secondary)`. Seleção grava `simulationMode` na store de DT-02.

### DT-04 — Detalhamento por remessa/OT

Reaproveitar o par `Accordion`/`AccordionTab` (PrimeReact, já em uso em `src/components/order/order.tsx:127-201`) + `ZTimeline` (`src/components/timeline/timeline.tsx`) para exibir os `shipments[]` do plano escolhido — um `AccordionTab` por remessa/OT, com `ZTimeline` horizontal mostrando `readyAt` → `deliveryAt`. Novo componente `src/app/production-order/components/shipment_accordion.tsx`.

### DT-05 — Carrinho de Pronta Entrega: sem mudança estrutural, só link de saída opcional

`delivery.tsx` continua chamando o cálculo de frete existente, sem qualquer integração técnica com a jornada de Encomenda. Único ajuste sugerido: se o backend recusar/limitar a quantidade por falta de estoque (`Swal` hoje em `delivery.tsx:100-106`), o texto do aviso pode incluir um link para `/encomenda?productId=...`, apenas como atalho de navegação — sem passar nenhum estado entre os dois fluxos.

### DT-06 — Badge de tipo de pedido

Novo componente `src/components/badge/sale_type_badge.tsx`, sobre `ZBadge` (`src/components/badge/badge.tsx`):

- `ENCOMENDA` → fundo `var(--color-secondary)` (`#F07724`), texto branco, label "Sob encomenda".
- `PRONTA_ENTREGA` → fundo neutro (`var(--text-color-secondary)`), texto escuro, label "Pronta entrega".

Como `sale_type` agora vive no **pedido** (não mais por item/remessa — ver histórico técnico de backend, DT-02), a badge aparece **uma vez no topo do pedido** em `order.tsx`, não repetida por `order_service`. Usado também na tela de confirmação da jornada de Encomenda.

### DT-07 — Loading, skeleton e empty state (jornada de encomenda)

Reaproveitar `ZSkeleton` (já usado em `delivery.tsx:130-135` e `cart_list.tsx:41`) durante a chamada a `/production-order/simulate`. Estado de "produto sem capacidade cadastrada" (quando o backend não encontra nenhuma OT com `production_capacity.active=true`): bloco inline com ícone (`pi pi-exclamation-triangle`) e texto explicando a indisponibilidade — nunca um `Swal` bloqueante, e nunca impede o cliente de tentar outro produto/quantidade.

### DT-08 — Estender a tela de pedido com dados de produção

`src/components/order/order.tsx` ganha, no cabeçalho do pedido (não mais por `order_service` individual), a `SaleTypeBadge` (DT-06) e, quando `sale_type === 'ENCOMENDA'`, as datas `estimated_ready_at`/`estimated_delivery_at` por `order_service` (formatadas com `toLocaleDateString('pt-BR')`, salvo se `date-fns` já estiver disponível no projeto).

## Contrato consumido — `POST /production-order/simulate`

```ts
// src/app/production-order/service/types.d.ts (novo)

export type SimulationMode = 'COST' | 'DEADLINE'

export interface ProductionOrderSimulateRequestType {
  productId: string
  quantity: number
}

export interface ProductionShipment {
  workshopId: number
  workshopName: string
  quantity: number
  freightCost: number
  carrier?: string
  service?: string
  readyAt: string // ISO — data estimada em que a fatia fica pronta (produção do zero)
  deliveryAt: string // ISO — chegada estimada ao cliente
}

export interface ProductionOrderPlan {
  mode: SimulationMode
  totalCost: number
  maxDeliveryDays: number
  shipments: ProductionShipment[]
}

export interface ProductionOrderSimulateResponseType {
  costPlan: ProductionOrderPlan
  deadlinePlan: ProductionOrderPlan
  unavailable?: boolean // true quando nenhuma OT tem capacidade ativa para o produto
}
```

Este contrato é **inteiramente novo e isolado** de `ShippingGetType`/`ValidOption` (usados pelo carrinho de Pronta Entrega) — não há reaproveitamento de tipos entre os dois fluxos, reforçando a separação. Depende do endpoint equivalente descrito em `HT-ENCOMENDA-BACK-001` (`POST /production-order/simulate`, `POST /production-order/reserve`, `POST /production-order`).

## Arquivos previstos

| Área | Arquivo | Tipo |
|---|---|---|
| Contratos | `src/app/production-order/service/types.d.ts` | Novo |
| Requisição | `src/app/production-order/service/request.tsx` | Novo |
| Controller | `src/app/production-order/service/controller.tsx` | Novo (`SimulateProductionOrderAction`, `ReserveProductionOrderAction`, `CreateProductionOrderAction`) |
| Estado | `src/app/production-order/zustand/zustand.tsx` | Novo (`ProductionOrderContextType`, DT-02) |
| Rota/orquestração | `src/app/production-order/page.tsx` | Novo |
| Rota/orquestração | `src/app/production-order/components/components.tsx` | Novo (`ZSteps` próprio, 3 passos) |
| Passo 1 | `src/app/production-order/components/quantity_form.tsx` | Novo |
| Passo 2 | `src/app/production-order/components/plan_selector.tsx` | Novo (DT-03) |
| Passo 2 | `src/app/production-order/components/plan_selector.css` | Novo |
| Passo 2 | `src/app/production-order/components/shipment_accordion.tsx` | Novo (DT-04) |
| Passo 3 | `src/app/production-order/components/confirmation.tsx` | Novo |
| Página de produto | `src/app/product/[id]/...` | Modificado (CTA "Comprar sob encomenda") |
| Carrinho (ajuste opcional) | `src/app/cart/components/delivery/delivery.tsx` | Modificado (link opcional para `/encomenda`, DT-05) |
| Badge | `src/components/badge/sale_type_badge.tsx` | Novo (DT-06) |
| Badge | `src/components/badge/sale_type_badge.css` | Novo |
| Enum | `src/utils/enum/sale_type.ts` | Novo (labels `PRONTA_ENTREGA`/`ENCOMENDA` em pt-BR, espelhando `src/utils/enum/order_status.ts`) |
| Tela de pedido | `src/components/order/order.tsx` | Modificado (DT-08: badge no cabeçalho + datas por `order_service`) |
| Tela de pedido | `src/app/profile/order/service/types.d.ts` | Modificado (`OrderOneType` ganha `sale_type`; `OrderService` ganha `estimated_ready_at`/`estimated_delivery_at`) |
| Wizard de carrinho (sem mudança estrutural) | `src/app/cart/components/components.tsx` | Não alterado |

## Restrições

- Não integrar a jornada de Encomenda ao wizard de carrinho (`ZSteps`/`useCartStepsStore`) — são fluxos desconectados, com estado, rotas e componentes próprios.
- Não criar dependência de dados entre `useCartStore`/`useCartStepsStore` e a nova store de Encomenda (`ProductionOrderContextType`).
- Não reaproveitar `ShippingGetType`/`ValidOption` (tipos do carrinho) para a jornada de Encomenda — contratos novos e isolados.
- Não introduzir nova biblioteca de UI — reaproveitar `ZCard`, `ZButton`, `ZSteps`, `ZBadge`, `ZTimeline`, `Accordion`/`AccordionTab` do PrimeReact já em uso.
- Não usar cores de marca fora dos tokens definidos (`--color-secondary`, `--primary-color`).
- Não editar o fluxo órfão `src/app/order/[id]/...` — a tela viva de pedido é `src/app/profile/order/[id]/...` + `src/components/order/order.tsx`.
- Não alterar contratos que dependam do backend antes de `HT-ENCOMENDA-BACK-001` estar disponível; construir com mocks/tipos até o endpoint real existir.

## Critérios técnicos de aceite

1. A jornada de Encomenda é acessível de forma independente do carrinho (rota própria), sem exigir que o cliente tenha passado pelo carrinho antes.
2. O cliente informa livremente a quantidade desejada — não há nenhum valor pré-preenchido derivado de "quanto faltou" no carrinho.
3. A tela de simulação sempre mostra as duas opções (`costPlan` e `deadlinePlan`) lado a lado, cada uma com detalhamento por remessa/OT (`SaleTypeBadge` não aparece aqui, já que dentro da jornada de encomenda todas as fatias são do mesmo tipo).
4. A seleção de um plano grava `simulationMode` e `shipmentsSelected` na store de DT-02, sem tocar em `useCartStore`/`useCartStepsStore`.
5. `POST /production-order/reserve` e `POST /production-order` são chamados com o payload da jornada de encomenda, nunca reutilizando `POST /checkout/reserve`/`POST /orders` do carrinho.
6. A tela `/profile/order/[id]` exibe a badge de tipo de pedido no cabeçalho e, quando `ENCOMENDA`, as datas estimadas por `order_service`.
7. Quando a API retorna `unavailable: true`, a UI mostra aviso explícito inline, sem `Swal` bloqueante.
8. Loading da simulação usa `ZSkeleton`, consistente com o padrão já usado em `delivery.tsx`/`cart_list.tsx`.
9. Nenhuma cor de marca é escrita fora das variáveis CSS (`--color-secondary`, `--primary-color`).
10. Não há novos erros de ESLint nos arquivos alterados; build do Next.js sem erros relacionados à feature.
11. O carrinho de Pronta Entrega existente continua funcionando sem nenhuma regressão perceptível.

## Estratégia de validação

### Cenários funcionais

- Cliente acessa `/encomenda` diretamente (sem carrinho ativo) e completa o fluxo do zero.
- Cenário motivador da história funcional: pedido de encomenda de 30 (ou 50) unidades com 2 OTs de capacidade — conferir que `costPlan` e `deadlinePlan` aparecem com fatiamento diferente entre si.
- Produto sem `production_capacity` ativa — aviso explícito (`unavailable: true`), sem travar a navegação.
- Troca de plano (custo → prazo) antes de confirmar — `shipmentsSelected` reflete a última escolha.
- Cliente compra em Pronta Entrega e, em outro momento, abre uma Encomenda para o mesmo produto — confirmar que nada do estado de um fluxo vaza para o outro.

### Estados de UI

- Loading da simulação (skeleton) e estado de indisponibilidade.
- Plano com 1 única remessa vs. plano com várias remessas (accordion com 1 aba vs. várias).
- Tela de pedido de Encomenda vs. tela de pedido de Pronta Entrega (badge diferente no cabeçalho).

### Qualidade

- ESLint nos arquivos alterados.
- Build do Next.js.
- Teste manual do fluxo completo de Encomenda: Quantidade → Simulação → Confirmação → `/profile/order/[id]`.
- Teste manual do fluxo de Pronta Entrega, confirmando ausência de regressão.
- Zoom 200% e navegação por teclado nos novos `ZCard`/`Accordion`.

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Backend (`HT-ENCOMENDA-BACK-001`) não estar pronto no mesmo ritmo, travando o frontend | Definir os tipos (`production-order/service/types.d.ts`) cedo e trabalhar com mocks de `ProductionOrderSimulateResponseType`; integrar o endpoint real por último |
| Equipe tentar reaproveitar componentes/estado do carrinho "para economizar tempo", reintroduzindo acoplamento entre os dois fluxos | Deixar explícito no código (nomes de pasta, stores e tipos totalmente separados) que `production-order` nunca importa de `app/cart` e vice-versa |
| `--text-lg` (usado em `h3`) não resolver por causa do bug de sintaxe em `globals.css:12` | Não introduzir novo CSS que dependa de `--text-lg`; usar `h2`/`h4`/tamanhos explícitos nos componentes novos |
| Confundir o componente de pedido correto com o órfão (`src/app/order/[id]`) | Editar exclusivamente `src/components/order/order.tsx` e `src/app/profile/order/[id]/...` |
| Badge de tipo de pedido divergir visualmente da badge padrão do PrimeReact (severity colors) | Especificar `sale_type_badge.tsx` com estilo próprio sobre `ZBadge`, sem depender de `severity` |
| `shipments[]` de uma OT ficar grande (muitas remessas) e o `Accordion` ficar longo/confuso | Ordenar remessas por `readyAt` crescente; `activeIndex` default só na primeira aba (mesmo padrão de `order.tsx:127`) |

## Estratégia de entrega

1. Fundação: tipos (`production-order/service/types.d.ts`), estado dedicado (`ProductionOrderContextType`) e mocks da API, sem UI visível ainda.
2. Rota e formulário de quantidade (`page.tsx`, `quantity_form.tsx`), navegável de ponta a ponta com dados mockados.
3. `PlanSelector` e `ShipmentAccordion`, plugados na rota real.
4. `SaleTypeBadge` no cabeçalho da tela de pedido e na confirmação da jornada de encomenda.
5. Estender `Order`/`order.tsx` e os tipos de `/profile/order/[id]` com `sale_type` (no pedido) e datas estimadas (por `order_service`).
6. Cobrir loading/skeleton e empty state (produto sem capacidade).
7. Integrar com o endpoint real assim que `HT-ENCOMENDA-BACK-001` expuser `/production-order/simulate`, `/production-order/reserve` e `/production-order`; validar o cenário motivador ponta a ponta, e confirmar ausência de regressão no carrinho de Pronta Entrega.
