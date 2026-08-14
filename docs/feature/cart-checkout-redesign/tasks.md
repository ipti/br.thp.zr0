# Plano de execução — Carrinho e checkout

## Priorização

- **P0:** integridade da compra ou bloqueio da jornada.
- **P1:** necessário para a nova experiência.
- **P2:** otimização após o fluxo estabilizado.

## Backlog

| Código | Entrega | Prioridade | Dependência | Critério de conclusão |
|---|---|---:|---|---|
| CART-01 | Linha de base e matriz de estados | P0 | — | métricas, fluxos e evidências atuais registrados |
| CART-02 | Modelo de estado e seletores únicos | P0 | CART-01 | seleção, subtotal e invalidação cobertos por testes |
| CART-03 | Guardas do stepper e URL | P0 | CART-02 | nenhuma etapa futura acessível sem pré-requisito |
| CART-04 | Shell, grid, tokens e stepper acessível | P1 | CART-03 | layout responsivo e foco correto entre etapas |
| CART-05 | Item, seleção e quantidade | P0 | CART-02, CART-04 | limite de estoque, rollback, remover/desfazer e seleção total |
| CART-06 | Resumo financeiro compartilhado | P0 | CART-02, CART-04 | totais idênticos em todas as etapas |
| CART-07 | Endereço acessível | P1 | CART-04 | seleção, vazio, cadastro e erro com foco testados |
| CART-08 | Entrega e reserva | P0 | CART-05, CART-07 | uma opção por remessa e erros de estoque recuperáveis |
| CART-09 | Revisão, cupom e pagamento | P0 | CART-06, CART-08 | CTA inequívoco e criação idempotente na UI |
| CART-10 | Resultado do pedido/pagamento | P1 | CART-09 | estados de resultado e próximos passos claros |
| CART-11 | Conteúdo, acessibilidade e mobile | P1 | CART-05 a CART-10 | teclado, NVDA, axe, 360 px e zoom 200% aprovados |
| CART-12 | Telemetria e privacidade | P1 | CART-01, CART-03 | funil e erros medidos sem PII |
| CART-13 | Regressão e liberação gradual | P0 | todas | suíte crítica, teste com usuários e rollback validados |

## Fases sugeridas

### Fase 1 — Segurança do fluxo

CART-01 a CART-03. Corrige avanço inválido, estado persistido inconsistente e acesso indevido por URL antes de mudar a aparência.

### Fase 2 — Carrinho redesenhado

CART-04 a CART-06. Entrega a nova primeira etapa com item, quantidade, seleção e resumo coerentes.

### Fase 3 — Checkout completo

CART-07 a CART-10. Padroniza endereço, entrega, revisão, criação do pedido e resultado.

### Fase 4 — Qualidade e lançamento

CART-11 a CART-13. Fecha acessibilidade, métricas, pesquisa com usuários e rollout.

## Cenários bloqueadores para lançamento

1. Carrinho vazio não avança.
2. Carrinho com itens, mas nenhum selecionado, não avança.
3. Quantidade máxima é respeitada e explicada.
4. Mudança de estoque antes da reserva retorna o usuário ao ponto correto.
5. URL não ignora pré-requisitos.
6. Frete de todas as remessas é obrigatório.
7. Duplo clique não duplica reserva nem pedido.
8. Totais permanecem iguais no resumo, revisão e pedido.
9. Encomenda permanece em pedido e estado separados.
10. Fluxo completo é operável por teclado e em 360 px.

## Pesquisa de usabilidade recomendada

Executar teste moderado com 5 a 8 participantes, incluindo ao menos uma pessoa que compre em volume:

- comprar duas unidades em Pronta Entrega;
- entender por que não é possível aumentar além do estoque;
- identificar como encomendar outra quantidade sem acreditar que os pedidos serão combinados;
- corrigir um endereço ou frete na revisão;
- recuperar-se de uma alteração de estoque.

Metas: 100% concluem o fluxo principal sem ajuda; pelo menos 80% explicam corretamente a diferença entre Pronta Entrega e Encomenda; nenhum participante acredita que a encomenda completará automaticamente o carrinho.
