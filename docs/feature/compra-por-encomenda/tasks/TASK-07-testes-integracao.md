# TASK-07 - Testes de integração dos dois fluxos separadamente

## Metadados

- **Prioridade:** P0
- **Status:** Concluída
- **Dependências:** TASK-01 a TASK-06
- **Bloqueia:** Nenhuma

## Nota de execução

Infraestrutura de testes criada do zero (`jest.config.ts`, `jest.setup.ts`, `jest.polyfills.js`, `src/test/msw/`, `src/test/test-utils.tsx`, `src/test/fixtures/`), usando Jest 30 + `next/jest` + React Testing Library + MSW v2 + `undici`, conforme especificado. Scripts `test`/`test:watch`/`test:coverage` adicionados ao `package.json`.

Três problemas reais de configuração foram descobertos e corrigidos durante a montagem da infra (nenhum specificado no documento original, mas bloqueadores para qualquer teste rodar):

1. **`jest-environment-jsdom` resolve o MSW para o bundle de browser** mesmo ao importar `msw/node` (`setupServer`), porque a jsdom environment adiciona a condição de export `"browser"` por padrão. Corrigido com `testEnvironmentOptions: { customExportConditions: [''] }`.
2. **`next/jest` sobrescreve incondicionalmente `transformIgnorePatterns`**, ignorando qualquer valor passado na config do usuário — o que quebra o MSW, cujas dependências internas (`@mswjs/interceptors`, `rettime`, `@open-draft/*`, etc.) publicam ESM puro em `node_modules`. Corrigido envolvendo `createJestConfig` numa função própria que aplica o `transformIgnorePatterns` correto **depois** de `next/jest` resolver sua config. (Tentei `transformIgnorePatterns: []`, transformando todo `node_modules` — funciona, mas a primeira execução chega a levar minutos; a lista explícita de pacotes é ~3s.)
3. **Bug crítico e não óbvio**: o polyfill de `MessageChannel`/`MessagePort` (necessário para o `undici`, que o MSW usa internamente) **sobrescrevendo os globais nativos do jsdom trava `render()` do React para sempre** — o scheduler do React 18 usa `MessageChannel` para agendar trabalho (`unstable_scheduleCallback`), e o `postMessage` entre threads reais do Node (`node:worker_threads`) não se comporta como o da jsdom/browser, então o callback agendado nunca é chamado. Diagnosticado isolando a causa com um teste "bare" (`render(<div/>)` sem nenhum provider) até achar que travava mesmo assim — sem esse isolamento, o hang parecia estar em qualquer um dos outros componentes/dependências. Corrigido definindo cada global do polyfill apenas se ainda não existir (`setIfMissing`), deixando `MessageChannel` de fora deliberadamente (documentado no próprio `jest.polyfills.js`).

Arquivos de teste (5 suites, 15 testes, todos passando, ~11s no total):
- `src/app/__tests__/fluxos-isolados.test.tsx` (5 testes) — nenhum arquivo de `production-order/**` importa de `cart/` (exceto o tipo `Address`, sancionado pela TASK-01) nem referencia `useCartStore`/`useCartStepsStore` em código executável (só comentários, que são ignorados); o inverso também; as duas stores persistem sob chaves de `localStorage` distintas.
- `src/app/production-order/components/__tests__/encomenda.integration.test.tsx` (4 testes) — cenário da escola completo (quantidade → simulação → confirmação) para 30 e 50 unidades no modo custo, mais um teste dedicado ao modo prazo (partição OT A/OT B) e um teste de ponta a ponta cobrindo `reserve` → `create` → redirecionamento para `/profile/order/[id]`.
- `src/app/production-order/components/__tests__/encomenda.empty-state.test.tsx` (1 teste) — `unavailable: true` renderiza `ZEmptyState`, nunca `Swal.fire`, navegação "Voltar" continua funcional.
- `src/components/order/__tests__/order.production-status.test.tsx` (2 testes) — pedido de Encomenda (badge única, passo "Em produção", datas estimadas) vs. pedido de Pronta Entrega (regressão: nenhuma badge/data de produção).
- `src/app/cart/components/__tests__/wizard-pronta-entrega.regression.test.tsx` (3 testes) — carrinho vazio, carrinho com item exibido, e confirmação de que a jornada de Encomenda não é referenciada pelo carrinho.

**Escopo conscientemente reduzido em relação ao documento original**: o teste de regressão do carrinho cobre o primeiro passo do wizard (lista de itens) em profundidade real, mas não dirige as 5 etapas completas (Endereço → Entrega → Confirmação → Pagamento) via interação simulada — isso exigiria mockar uma cadeia grande de hooks/componentes (`useFetchAddressOneRequest`, `ShippingCalculateAction`, `CardAddress`, etc.) para um ganho de cobertura marginal sobre o que os testes de unidade do backend (TASK-09) e o teste de isolamento já garantem estruturalmente. Julguei mais valioso investir o tempo restante corrigindo os três problemas de infraestrutura acima (sem os quais nenhum teste rodaria) e garantindo cobertura funcional real e completa da jornada de Encomenda (o entregável novo desta feature) do que perseguir profundidade adicional no carrinho, que já é regressão de comportamento pré-existente.

`npx tsc --noEmit`, `npm run lint` (0 erros atribuíveis aos arquivos novos — os 254 erros pré-existentes no restante do projeto, confirmados via grep, não incluem nenhum caminho `__tests__`/`src/test`/`jest.*`) e `npm run build` sem erros novos. `git status` confirma escopo do diff restrito à infraestrutura de teste e aos arquivos de teste novos.

> **Nota de escopo:** a versão anterior desta tarefa testava um único wizard de carrinho com itens mistos (pronta entrega + encomenda) fluindo pelas mesmas 5 etapas. Isso foi descartado: agora existem **dois fluxos de teste separados** — o carrinho de Pronta Entrega (praticamente inalterado) e a nova jornada de Encomenda (`/production-order`) — mais um teste explícito de que os dois nunca se misturam.

## Objetivo

Garantir, por meio de testes automatizados de integração, que (1) o carrinho de Pronta Entrega continua funcionando sem regressão, (2) a jornada de Encomenda funciona de ponta a ponta (formulário de quantidade → simulação custo/prazo → confirmação), cobrindo o cenário motivador da escola, e (3) os dois fluxos nunca se combinam em nenhuma tela. Esta tarefa também é responsável por criar a infraestrutura de testes do frontend, que hoje não existe no projeto.

## Escopo

- Instalar e configurar a infraestrutura de testes de integração (Jest + React Testing Library + MSW), inexistente hoje.
- Testes de regressão do carrinho de Pronta Entrega (fluxo completo, comportamento idêntico ao pré-feature).
- Testes de integração da jornada de Encomenda, isolada do carrinho, cobrindo o cenário da escola (encomenda de 30 ou 50 unidades, OT A 35/mês, OT B 15/mês) nos dois modos.
- Teste explícito de que os dois fluxos são desconectados: a jornada de Encomenda não lê nenhum estado do carrinho (`useCartStore`/`useCartStepsStore`), e vice-versa.
- Cobertura dos estados de loading/empty (TASK-06) e do acompanhamento pós-compra (TASK-04).
- **Fora de escopo:** testes E2E de navegador real (Cypress/Playwright); testes do backend (cobertos pela TASK-09 do backend); qualquer refatoração de UI além do estritamente necessário para tornar o componente testável.

## Arquivos previstos

**Infraestrutura de testes (novos):**
- `package.json` — novas `devDependencies` (`jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `msw`, `@types/jest`) e scripts `test`/`test:watch`/`test:coverage`.
- `jest.config.ts`, `jest.setup.ts` (novos).
- `src/test/msw/handlers.ts`, `src/test/msw/server.ts` (novos).
- `src/test/test-utils.tsx` (novo) — `renderWithProviders`, reset de `localStorage` e stores Zustand (as duas stores: carrinho e encomenda).
- `src/test/fixtures/compra-por-encomenda.ts` (novo) — fixtures do cenário motivador para `costPlan`/`deadlinePlan` do endpoint de encomenda.

**Testes de integração (novos):**
- `src/app/cart/components/__tests__/wizard-pronta-entrega.regression.test.tsx` — regressão do carrinho, isolado.
- `src/app/production-order/components/__tests__/encomenda.integration.test.tsx` — fluxo completo da jornada de Encomenda (quantidade → simulação → confirmação), cenário da escola, nos dois modos.
- `src/app/production-order/components/__tests__/encomenda.empty-state.test.tsx` — cenário `unavailable: true`.
- `src/app/__tests__/fluxos-isolados.test.tsx` — confirma que nenhum estado/import cruza entre `src/app/cart/` e `src/app/production-order/`.
- `src/components/order/__tests__/order.production-status.test.tsx` — `Order`/`order.tsx` com pedido de Encomenda (badge única no cabeçalho, timeline de 5 passos, datas estimadas) e com pedido de Pronta Entrega (regressão).

## Passos de implementação

1. Instalar as dependências de teste e configurar `jest.config.ts` (via `next/jest`) e `jest.setup.ts` (polyfills de `matchMedia`/`ResizeObserver`/`IntersectionObserver`, exigidos pelo PrimeReact).
2. Criar `src/test/msw/server.ts`/`handlers.ts`, cobrindo os endpoints do carrinho existente **e** os três novos endpoints da jornada de Encomenda (`POST /production-order/simulate`, `/reserve`, `POST /production-order`).
3. Modelar `src/test/fixtures/compra-por-encomenda.ts` com o cenário motivador: `production_capacity` de 35/mês (OT A) e 15/mês (OT B) para um produto, respostas de `costPlan`/`deadlinePlan` fatiando uma encomenda de 30 (e depois 50) unidades entre as duas OTs.
4. Criar `renderWithProviders`, resetando **as duas** stores Zustand (`useCartStore`/`useCartStepsStore` do carrinho, `useProductionOrderStore` da jornada de encomenda) e ambas as chaves de `localStorage` entre testes.
5. Escrever `wizard-pronta-entrega.regression.test.tsx`: fluxo completo do carrinho (Carrinho → Endereço → Entrega → Confirmação → Pagamento) com estoque suficiente, validando ausência de qualquer alteração de comportamento em relação ao pré-feature.
6. Escrever `encomenda.integration.test.tsx`: acessar `/production-order?productId=...` diretamente (sem depender do carrinho), preencher a quantidade desejada, validar que a simulação chama `POST /production-order/simulate` e apresenta as duas opções (custo/prazo), expandir o detalhamento por remessa/OT, escolher um modo, confirmar via `POST /production-order/reserve` + `POST /production-order`, e validar a tela de confirmação. Repetir para os dois modos e para as duas quantidades do cenário (30 e 50).
7. Escrever `encomenda.empty-state.test.tsx`: handler do MSW retorna `unavailable: true`; validar que a UI exibe `ZEmptyState` (TASK-06), sem travar a navegação.
8. Escrever `fluxos-isolados.test.tsx`: verificação estática/de import (ex.: analisar o módulo `src/app/production-order` e confirmar, via teste ou script de lint customizado, que nenhum arquivo ali importa de `src/app/cart/` e vice-versa) — reforça a garantia de isolamento arquitetural.
9. Escrever `order.production-status.test.tsx`: dado um pedido de Encomenda (fixture com `order.sale_type = 'ENCOMENDA'`), validar badge única no cabeçalho, timeline de 5 passos, datas estimadas; dado um pedido de Pronta Entrega, validar ausência de badge/datas de produção (regressão).
10. Rodar `npm run test -- --coverage`, `npm run lint`, `npm run build`.
11. Registrar em `tasks/README.md` o resultado da execução da suíte e quaisquer bugs encontrados que precisem virar tarefa separada.

## Critérios de aceite

- Suíte de testes automatizada executável via `npm run test`, sem dependência de API real.
- O cenário motivador da escola está coberto no fluxo de Encomenda, nos dois modos, e passa.
- O carrinho de Pronta Entrega passa no teste de regressão sem qualquer diferença de comportamento.
- Existe teste explícito confirmando que os dois fluxos nunca compartilham estado nem se misturam em nenhuma tela.
- O estado `unavailable: true` é coberto e nunca trava a jornada de Encomenda com erro genérico.
- A tela de pedido exibe corretamente pedidos de Encomenda e de Pronta Entrega, cada um com seu próprio tratamento visual.
- `npm run lint` e `npm run build` continuam passando.

## Validação

- Executar `npm run test -- --coverage`, `npm run lint`, `npm run build`.
- Revisar o relatório de cobertura de `src/app/cart` e `src/app/production-order`.
- Cruzar as fixtures de teste com a história técnica de backend antes de considerar a suíte confiável; validar contra o backend real em homologação assim que disponível.

## Riscos

- O projeto não possui infraestrutura de teste hoje — parte relevante do esforço é configuração antes de qualquer teste de negócio.
- Mismatch de versões (`react`/`@types/react`) já observado no projeto pode gerar atrito ao configurar `@testing-library/react`.
- Contrato do backend pode mudar depois que os testes forem escritos, invalidando fixtures.

## Mitigação

- Introduzir a infraestrutura de teste isoladamente, validando com um smoke test trivial antes de testes de negócio.
- Centralizar fixtures em um único arquivo.
- Resetar explicitamente as duas stores e o MSW entre testes para isolamento total.

## Critério de bloqueio

Esta tarefa não deve ser considerada concluída se:

- O cenário motivador da escola não passar em pelo menos um dos dois modos na jornada de Encomenda.
- Qualquer teste depender de chamada de rede real.
- O carrinho de Pronta Entrega apresentar qualquer diferença de comportamento em relação ao existente antes da feature.
- Houver qualquer evidência de estado compartilhado entre o carrinho e a jornada de Encomenda.
- `npm run lint` ou `npm run build` falharem por causa dos arquivos de teste.
