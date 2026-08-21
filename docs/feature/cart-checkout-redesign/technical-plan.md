# Plano técnico — Carrinho e checkout

## Objetivo

Refatorar apresentação e orquestração do checkout de Pronta Entrega, mantendo contratos de negócio existentes e eliminando caminhos inválidos. A prioridade técnica é tornar as regras explícitas em estado derivado e guardas de navegação antes da mudança visual.

## Decisões propostas

### DT-01 — Etapa derivada e protegida

- Definir IDs estáveis: `cart`, `address`, `delivery`, `review`, `payment`.
- Manter `index` apenas como compatibilidade temporária; validar e redirecionar para a última etapa permitida.
- Centralizar `canEnterStep`, `canContinue` e `lastValidStep`.
- Etapas futuras usam `disabled`; concluídas podem ser revisitadas.
- Ao mudar de etapa, atualizar URL e foco no `h1` sem recarregar a página.

Pré-requisitos mínimos:

| Etapa | Pré-requisito |
|---|---|
| Carrinho | nenhum |
| Endereço | autenticação + item selecionado/válido |
| Entrega | endereço selecionado + seleção ainda válida |
| Revisão | entrega completa + reserva confirmada |
| Pagamento | pedido criado e identificadores válidos |

### DT-02 — Estado consistente e migração segura

- Inicializar `cartSteps` com objeto tipado, nunca `[]`.
- Versionar o estado persistido para permitir migração/limpeza segura.
- Remover IDs de `product_selected` quando o item sair do carrinho.
- Invalidar `deliverySelected` quando produto, variante, quantidade ou endereço mudar.
- Separar estado de servidor (estoque/frete/reserva) de estado de UI.
- Tratar `productId + variantId` como identidade quando a variante diferenciar itens.

### DT-03 — Sincronização de quantidade

- Usar uma única fonte de verdade visível; evitar estado local divergente de Zustand.
- Atualização otimista somente se houver rollback em falha.
- Aplicar debounce curto quando houver persistência remota, sem atrasar o feedback do controle.
- Revalidar disponibilidade antes da reserva; o cliente deve revisar qualquer ajuste imposto.
- Usar resposta oficial de disponibilidade agregada, já descontando reservas ativas.

### DT-04 — Componentes de apresentação

Componentes sugeridos, sem nova biblioteca:

- `CheckoutShell`: container, título, stepper e região de alertas.
- `CheckoutSteps`: semântica e guardas sobre `ZSteps`.
- `CartItemCard`: item, seleção, quantidade e ações.
- `QuantityControl`: limites, loading, erro e nomes acessíveis.
- `OrderSummary`: subtotal/frete/desconto/total e CTA por etapa.
- `InlineAlert`: feedback contextual recuperável.
- `CheckoutActions`: Voltar/Continuar consistentes.
- `CheckoutEmptyState`: carrinho/endereço/frete vazios.

Evitar abstrair cedo cards muito diferentes de Endereço, Entrega e Revisão.

### DT-05 — Layout e tokens

- Container máximo entre 1200 e 1280 px, gutter fluido e grid 8/4 no desktop.
- Resumo sticky somente quando houver altura útil; no mobile, resumo no fluxo e CTA inferior opcional.
- Definir tokens específicos usando as cores globais existentes, sem hex de marca nos componentes.
- Corrigir primeiro o token tipográfico global malformado (`--text-xl`/`--text-lg`) em tarefa isolada e validar regressão.
- Preferir bordas e elevação leve; seleção nunca depende só da cor.

### DT-06 — Feedback e erros

- Substituir alertas bloqueantes do fluxo principal por alertas inline/toasts com foco controlado.
- Manter modal apenas quando uma decisão realmente exigir interrupção.
- Mapear erros por domínio: sessão, estoque, frete, reserva, cupom, pedido e pagamento.
- Toda mutação bloqueia repetição enquanto está em curso e conserva dados em falha recuperável.

### DT-07 — Resumo financeiro único

- Criar seletores puros para itens selecionados, quantidade de itens e subtotal.
- Derivar frete de `deliverySelected`, desconto do cupom confirmado e total final da mesma camada.
- Nunca recalcular o mesmo conceito de formas diferentes entre Carrinho e Revisão.
- Formatar moeda em utilitário compartilhado pt-BR.

### DT-08 — Acessibilidade

- Melhorar `ZSteps` ou criar wrapper com semântica de lista/etapa e `aria-current`.
- Gerenciar foco após navegação, erros e modais.
- Toast com ação “Desfazer” alcançável por teclado e tempo suficiente/pausável.
- Testar com axe, teclado e ao menos NVDA no Windows.

### DT-09 — Observabilidade

- Eventos por etapa, erro e ação crítica com nomenclatura estável.
- Não enviar PII, conteúdo de endereço, telefone, cupom em claro ou dados de pagamento.
- Distinguir saída para Encomenda de abandono.

## Arquivos principais previstos

| Área | Arquivos |
|---|---|
| Orquestração | `src/app/cart/components/components.tsx` |
| Estado | `src/app/cart/zustand/zustand.tsx`, `src/service/store/cart_store.tsx` |
| Carrinho | `src/app/cart/components/cart_list/cart_list.tsx`, `cart_list.css` |
| Item | `src/app/cart/components/cart_list/item/item.tsx`, `item.css` |
| Endereço | `src/app/cart/components/address/address.tsx`, `card_address/*` |
| Entrega | `src/app/cart/components/delivery/delivery.tsx`, `card_delivery.tsx` |
| Revisão | `src/app/cart/components/finish/finish.tsx` |
| Pagamento | `src/app/cart/components/payment/payment.tsx` |
| Componentes | `src/components/steps/*`, `src/components/button/*` e novos componentes locais |
| Tokens | `src/app/globals.css` e CSS local do checkout |
| Testes | `src/app/cart/components/__tests__/*`, stores e seletores puros |

## Restrições

- Preservar a separação total entre `/cart` e `/production-order`.
- Não alterar contratos da API sem uma história de backend associada.
- Não confiar apenas no limite de UI: backend continua sendo autoridade de estoque/reserva.
- Não guardar dados sensíveis adicionais em `localStorage`.
- Não introduzir biblioteca de UI ou formulário sem necessidade validada.
- Preservar alterações locais já existentes nos arquivos de item/teste durante a implementação.

## Estratégia de testes

### Unidade

- Seletores de itens e totais.
- Guardas e última etapa válida.
- Invalidação de dependências.
- Limites e rollback de quantidade.
- Formatação monetária.

### Integração

- Carrinho vazio e sem seleção.
- Login solicitado ao continuar.
- Estoque muda antes da reserva.
- Endereço e frete obrigatórios.
- Reserva bem-sucedida, concorrente e expirada.
- Cupom válido/inválido e total consistente.
- Pedido criado uma única vez sob clique duplo.
- Encomenda abre fluxo independente.

### E2E e acessibilidade

- Jornada completa com um e vários produtos/remessas.
- Navegação direta por URL para etapa proibida.
- Retorno a etapa concluída e invalidação posterior.
- Teclado, foco, NVDA e axe sem violações críticas/sérias.
- 360 × 800, 390 × 844, 768 × 1024, 1024 × 768 e 1440 × 1000.
- Zoom 200%, texto ampliado e widget de atendimento aberto.

## Liberação

1. Instrumentar o fluxo atual para estabelecer linha de base.
2. Entregar guardas e consistência de estado protegidas por feature flag.
3. Ativar a nova apresentação internamente.
4. Executar teste moderado com 5 a 8 participantes nos cenários de compra e falta de estoque.
5. Liberar gradualmente, comparando avanço, erros e conclusão.
6. Manter rollback visual sem reverter correções de integridade já validadas.

## Definição técnica de pronto

- Critérios funcionais da especificação atendidos.
- Build e lint sem novos erros relacionados.
- Testes de unidade, integração e E2E críticos aprovados.
- Nenhum caminho cria pedido sem seleção, endereço, entrega e reserva válidos.
- Sem divergência de totais entre etapas.
- Sem violações axe críticas ou sérias no fluxo principal.
- Evidências visuais e de teclado registradas.
- Métricas e alertas verificados sem PII.
