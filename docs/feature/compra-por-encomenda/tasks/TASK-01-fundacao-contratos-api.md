# TASK-01 - Fundação: contratos da API de Encomenda e estado dedicado

## Metadados

- **Prioridade:** P0
- **Status:** Concluída
- **Dependências:** Nenhuma
- **Bloqueia:** TASK-02 a TASK-05

## Nota de execução

Implementado conforme especificado, em `src/app/production-order/` (novo diretório, isolado de `src/app/cart/`). Único ajuste em relação ao contrato original: `ReserveProductionOrderRequest`/`CreateProductionOrderRequest` ganharam tipos de retorno explícitos (`ReserveProductionOrderResult`, `CreateProductionOrderResult`, refletindo o shape real de `POST /production-order/reserve` e `POST /production-order` no backend) em vez de `any` — necessário para manter o controller sem `unknown`/`any` e sem regredir o lint, já que o padrão de referência (`ProductClientController`) tinha esse mesmo débito pré-existente que optei por não replicar.

`npx tsc --noEmit` não reporta nenhum erro nos arquivos novos (os erros pré-existentes no restante do projeto são anteriores a esta task, confirmados via grep). ESLint limpo nos arquivos novos. `next build` passa sem erros. `git status` confirma que nenhum arquivo em `src/app/cart/**` foi tocado.

> **Nota de escopo:** a versão anterior desta tarefa estendia o estado do carrinho existente (`useCartStepsStore`, `src/app/cart/zustand/zustand.tsx`) para guardar o plano de simulação. Isso foi descartado: o Pedido de Encomenda é uma **jornada completamente separada e desconectada** do carrinho de Pronta Entrega — precisa de sua própria store, seus próprios tipos e seus próprios arquivos de serviço, sem tocar em nenhum arquivo de `src/app/cart/`.

## Objetivo

Criar, sem tocar em nenhuma tela existente do carrinho, a camada de **tipos TypeScript e estado `zustand`** que toda a jornada de Pedido de Encomenda vai consumir: o contrato dos futuros endpoints `POST /production-order/simulate`, `POST /production-order/reserve` e `POST /production-order` (história técnica de backend, `HT-ENCOMENDA-BACK-001`), e uma store nova e independente para guardar a quantidade desejada, o modo de simulação escolhido (`COST`/`DEADLINE`) e as remessas resultantes.

Esta é uma task puramente de **contratos e estado**, sem UI: nenhum componente `Z*` é criado ou estilizado aqui. Ela existe para que TASK-02 (formulário de quantidade + rota da jornada), TASK-03 (simulação custo × prazo com detalhamento por remessa), TASK-04 (acompanhamento do pedido) e TASK-06 (loading/empty state) trabalhem sobre o mesmo vocabulário de tipos.

Cenário de referência para validar o contrato: escola quer completar sua necessidade além do que comprou em Pronta Entrega e abre, separadamente, um Pedido de Encomenda de 30 unidades (ou das 50 completas, se preferir) — a resposta da simulação precisa expressar isso como remessas entre OT A (35/mês) e OT B (15/mês), sem nenhuma referência a estoque.

## Escopo

**Dentro do escopo:**
- Novo diretório `src/app/production-order/`, isolado de `src/app/cart/`.
- Novas interfaces TypeScript em `src/app/production-order/service/types.d.ts`: `SimulationMode`, `ProductionShipment`, `ProductionOrderPlan`, `SimulateProductionOrderPayload`, `SimulateProductionOrderResponse`, `ReserveProductionOrderPayload`, `CreateProductionOrderPayload`.
- Funções de request em `src/app/production-order/service/request.tsx` (`SimulateProductionOrderRequest`, `ReserveProductionOrderRequest`, `CreateProductionOrderRequest`), seguindo o padrão de chamada direta ao axios `http` já usado em `src/app/product/service/request.tsx`.
- Um controller `src/app/production-order/service/controller.tsx` com as três actions correspondentes, mesmo padrão fino de `ProductClientController`.
- Uma store nova e independente `src/app/production-order/zustand/zustand.tsx` (`useProductionOrderStore`), **sem nenhuma relação** com `useCartStore`/`useCartStepsStore`.
- Um arquivo `src/app/production-order/service/constants.ts` com o mapeamento textual `SimulationMode` → label em português (`COST` → "Menor custo", `DEADLINE` → "Menor prazo").

**Fora do escopo (propositalmente, para não invadir tasks seguintes):**
- Qualquer componente visual, rota (`page.tsx`) ou formulário — isso é TASK-02/03/04.
- Qualquer alteração em `src/app/cart/**` — o carrinho de Pronta Entrega não é tocado por esta feature, exceto o link opcional da TASK-05.
- Implementar o endpoint no backend (repositório separado, sem contrato compartilhado) — esta task só define o contrato do lado cliente.
- Testes de integração ponta a ponta (TASK-07).

## Arquivos previstos

- `src/app/production-order/service/types.d.ts` (novo).
- `src/app/production-order/service/request.tsx` (novo).
- `src/app/production-order/service/controller.tsx` (novo).
- `src/app/production-order/service/constants.ts` (novo).
- `src/app/production-order/zustand/zustand.tsx` (novo).
- `src/app/product/service/type.d.ts` (somente leitura) — nenhum tipo daqui é reaproveitado; a jornada de encomenda tem contratos próprios, deliberadamente isolados.

## Passos de implementação

1. **Criar os tipos de contrato** em `src/app/production-order/service/types.d.ts`:
   ```ts
   export type SimulationMode = 'COST' | 'DEADLINE'

   export interface SimulateProductionOrderPayload {
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
     readyAt: string   // ISO — sempre calculado como produção do zero
     deliveryAt: string // ISO — readyAt + prazo do frete
   }

   export interface ProductionOrderPlan {
     mode: SimulationMode
     shipments: ProductionShipment[]
     totalCost: number
     maxDeliveryAt: string
   }

   export interface SimulateProductionOrderResponse {
     costPlan: ProductionOrderPlan
     deadlinePlan: ProductionOrderPlan
     unavailable?: boolean // true = nenhuma OT com capacidade ativa para o produto
   }

   export interface ReserveProductionOrderShipment {
     workshopId: number
     quantity: number
   }

   export interface ReserveProductionOrderPayload {
     userId: number
     productId: string
     simulationMode: SimulationMode
     shipments: ReserveProductionOrderShipment[]
   }

   export interface CreateProductionOrderPayload extends ReserveProductionOrderPayload {
     address: Address // reaproveitar o tipo Address já existente em src/app/cart/service/types.d.ts, importado, não duplicado
     paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'BANK_SLIP'
   }
   ```
   Nenhum campo `saleType` aparece em lugar nenhum deste contrato — toda a jornada é implicitamente `ENCOMENDA`, já que o pedido inteiro é homogêneo.

2. **Criar as funções de request** em `src/app/production-order/service/request.tsx`, seguindo o padrão de `ShippingCalculateRequest` (`src/app/product/service/request.tsx:8-16`):
   ```ts
   export const SimulateProductionOrderRequest = async (body: SimulateProductionOrderPayload) => {
     return await http.post('/production-order/simulate', body)
   }

   export const ReserveProductionOrderRequest = async (body: ReserveProductionOrderPayload) => {
     return await http.post('/production-order/reserve', body)
   }

   export const CreateProductionOrderRequest = async (body: CreateProductionOrderPayload) => {
     return await http.post('/production-order', body)
   }
   ```

3. **Criar o controller** `src/app/production-order/service/controller.tsx`, com três actions finas (`SimulateProductionOrder`, `ReserveProductionOrder`, `CreateProductionOrder`), reaproveitando o mesmo tratamento de erro/401 já usado em `ProductClientController` (`src/app/product/service/controller.tsx:19-31`).

4. **Criar `src/app/production-order/service/constants.ts`**:
   ```ts
   import { SimulationMode } from './types'

   export const SIMULATION_MODE_LABEL: Record<SimulationMode, string> = {
     COST: 'Menor custo',
     DEADLINE: 'Menor prazo',
   }
   ```

5. **Criar a store dedicada** `src/app/production-order/zustand/zustand.tsx`:
   ```ts
   export interface ProductionOrderContextType {
     productId?: string
     desiredQuantity?: number
     simulationMode?: SimulationMode
     simulation?: SimulateProductionOrderResponse
     shipmentsSelected?: ProductionShipment[]
   }

   export interface ProductionOrderStore {
     productionOrder: ProductionOrderContextType
     setDesiredQuantity: (productId: string, quantity: number) => void
     setSimulation: (simulation: SimulateProductionOrderResponse) => void
     selectSimulationMode: (mode: SimulationMode) => void
     getSelectedPlan: () => ProductionOrderPlan | undefined
     reset: () => void
   }
   ```
   Persistir sob uma chave de `localStorage` própria (ex.: `PRODUCTION_ORDER_KEY = 'production_order_state'`), **nunca** a mesma chave (`cart_state`) usada por `useCartStepsStore` — reforça o isolamento entre os dois fluxos.

6. **Não tocar em nenhum arquivo de `src/app/cart/**`** nesta task. O build do carrinho existente deve continuar idêntico.

7. Rodar `tsc --noEmit` antes de considerar a task pronta.

## Critérios de aceite

- Todos os tipos do passo 1 existem em `src/app/production-order/service/types.d.ts`, sem nenhum campo `saleType` (o tipo já é implícito pela jornada).
- As três funções de request/controller existem e seguem o padrão já usado no projeto.
- `useProductionOrderStore` existe, é completamente independente de `useCartStore`/`useCartStepsStore`, e persiste sob sua própria chave de `localStorage`.
- Nenhum arquivo em `src/app/cart/**` foi modificado.
- `npx tsc --noEmit` e o build do Next.js passam sem novos erros.
- ESLint não acusa problemas nos arquivos novos.

## Validação

- Executar `npx tsc --noEmit` e `next build`, confirmar zero erros novos.
- Executar ESLint nos arquivos novos.
- Confirmar, via busca no repositório, que nenhum arquivo de `src/app/cart/**` aparece no diff desta tarefa.
- Revisar o contrato campo a campo contra a história técnica de backend (`HT-ENCOMENDA-BACK-001`) antes de "congelar" a interface.

## Riscos

- Contrato pode ficar dessincronizado do backend real (`POST /production-order/*` ainda não existe, repositório separado, sem OpenAPI compartilhado).
- `skipLibCheck: true` no `tsconfig.json` esconde erros dentro de arquivos `.d.ts`.
- Equipe pode ser tentada a "economizar tempo" reaproveitando tipos/estado do carrinho — isso reintroduziria o acoplamento que a revisão de arquitetura eliminou.

## Mitigação

- Isolar toda chamada HTTP em `production-order/service/`, para que um eventual ajuste de shape do backend exija mudança em um único lugar.
- Revisar manualmente cada arquivo `.d.ts` novo linha a linha, já que `tsc` não pega erros de tipo dentro deles.
- Documentar explicitamente, em comentário no topo de cada arquivo novo, que este módulo nunca deve importar de `src/app/cart/` nem vice-versa.
