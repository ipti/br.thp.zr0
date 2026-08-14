# Repaginação do carrinho e checkout de Pronta Entrega

## Identificação

- **Feature:** CART-CHECKOUT-REDESIGN
- **Status:** Planejada
- **Área:** E-commerce / Carrinho / Checkout
- **Rota principal:** `/cart`
- **Prioridade:** Alta
- **Objetivo:** reduzir erros e abandono, deixar custos e próximos passos previsíveis e alinhar a interface às regras de Pronta Entrega.

## Entregáveis

- [Especificação de UX e IHC](./ux-spec.md)
- [Plano técnico](./technical-plan.md)
- [Plano de execução](./tasks.md)

## Princípio central

O carrinho é exclusivamente de **Pronta Entrega**. “Fazer encomenda” inicia outra jornada, em outra rota e sem transportar seleção, quantidade, frete ou reserva do carrinho. A interface deve explicar essa diferença sem apresentar as duas modalidades como partes de uma única compra.

## Resultado esperado

- O cliente sabe o que está comprando, o que está selecionado e por que não pode avançar.
- Quantidade nunca ultrapassa o estoque agregado disponível.
- Preço, frete, desconto e total aparecem em ordem compreensível e com formatação brasileira.
- As etapas só podem ser acessadas quando seus pré-requisitos estiverem válidos.
- Alterações críticas recebem feedback imediato, recuperável e acessível.
- Desktop, mobile, teclado, leitor de tela e zoom de 200% preservam a jornada.

## Fora do escopo

- Unificar Pronta Entrega e Encomenda.
- Alterar algoritmos de estoque, frete, reserva, cupom ou pagamento.
- Redesenhar a jornada `/production-order`.
- Criar uma nova biblioteca de componentes.
- Mudar a identidade visual da ZR0.

## Ordem recomendada

1. Corrigir guardas, estado e regras de progressão.
2. Criar a fundação visual e o resumo persistente.
3. Refazer item, quantidade, seleção e exclusão.
4. Padronizar Endereço, Entrega, Revisão e Pagamento.
5. Cobrir acessibilidade, responsividade, erros e telemetria.
6. Validar a jornada completa antes da liberação gradual.
