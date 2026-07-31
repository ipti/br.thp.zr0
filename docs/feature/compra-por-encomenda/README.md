# Compra por Encomenda

## Identificação

- **Feature:** COMPRA-POR-ENCOMENDA
- **Status:** Planejada
- **Área:** Carrinho (Pronta Entrega) / Nova jornada de Pedido de Encomenda (Frontend)
- **Rotas:** `/cart` (inalterada), `/production-order` (nova), `/profile/order/[id]`
- **Objetivo:** Permitir dois tipos de pedido independentes: o carrinho de Pronta Entrega já existente (limitado ao estoque disponível) e uma nova jornada separada de Pedido de Encomenda, onde o cliente escolhe livremente a quantidade e o sistema apresenta duas simulações completas (custo x prazo) com fatiamento entre oficinas (OTs). Os dois pedidos nunca se combinam.

## Documentos

- [História funcional](./historia-funcional.md)
- [História técnica](./historia-tecnica.md)
- [Plano de tarefas](./tasks/README.md)

## Problemas que motivam a feature

- Hoje o pedido falha com "Estoque insuficiente" quando a quantidade pedida excede o estoque disponível, sem nenhuma alternativa de produção sob demanda.
- Não existe nenhuma jornada de compra para produção sob encomenda.
- Não existe interface para o cliente visualizar e escolher entre alternativas de custo x prazo de uma encomenda.
- Pedidos de Encomenda não têm hoje uma representação visual clara na tela de pedido (status de produção, prazos estimados).

## Resultado esperado

- Carrinho de Pronta Entrega permanece como está hoje, refletindo a migração de estoque para `inventory` no backend (mudança invisível de UI).
- Nova jornada `/production-order`, completamente separada do carrinho, com formulário de quantidade, tela de simulação (custo x prazo) com detalhamento por remessa/OT, e confirmação.
- Indicação visual clara (badge, uma por pedido) de quais pedidos são Pronta Entrega e quais são Sob Encomenda.
- Tela de pedido exibindo status de produção e prazos estimados para pedidos de Encomenda.
- Estados de carregamento e vazio bem tratados durante o cálculo da simulação.
- Identidade visual alinhada ao restante do sistema (PrimeReact, componentes `Z*`, cor de marca `#F07724`, tipografia Poppins/Libre Baskerville).

## Fora do escopo

- Qualquer lógica de cálculo do backend (algoritmo de simulação, schema, migrações) — ver documentação em `br.thp.zr0.api/docs/feature/compra-por-encomenda`.
- Qualquer integração técnica entre o carrinho de Pronta Entrega e a jornada de Encomenda além de um link de navegação opcional.
- Criação de uma nova biblioteca de UI (mantém PrimeReact/PrimeFlex).

## Ordem recomendada

1. Fundação (contratos da API de Encomenda e estado dedicado).
2. Nova jornada de Encomenda (rota e formulário de quantidade).
3. Simulação custo x prazo com detalhamento por remessa/OT.
4. Acompanhamento do Pedido de Encomenda (status de produção).
5. Ajuste do carrinho de Pronta Entrega para usar inventory.
6. Loading, skeleton e empty states da jornada de encomenda.
7. Testes de integração dos dois fluxos separadamente.
