# Sobre nós — implementação fiel ao PSD

## Identificação

- **Feature:** ABOUT-US-PSD
- **Status:** Planejada; implementação não iniciada.
- **Rota proposta:** `/about-us`, já referenciada pelo componente About e pelo footer.
- **Referência:** `THP-ZRO-LP-2026 (3) - MAIN.psd`, composição desktop de 1920 × 3736 px.
- **Objetivo:** construir a tela solicitada com a composição original do PSD e padronizar o header público compartilhado.

## Documentos

- [História funcional](./historia-funcional.md)
- [História técnica e componentes](./historia-tecnica.md)
- [Tasks de implementação](./tasks/README.md)
- [Referência visual extraída do PSD](./reference/psd-preview.jpg)

## Escopo aprovado

Preservar cabeçalho com logo central, banner com cadeira à esquerda e pessoa à direita, vitrine de quatro produtos, produto em destaque com miniaturas e fechamento institucional. A proposta alternativa gerada anteriormente não é referência de implementação.

O nome “Sobre nós” segue o pedido e os links existentes, mesmo que o PSD também contenha uma vitrine comercial. A home `/` e sua flag `NEW_LANDING_PAGE_ENABLED` continuam com sua composição atual. O header compartilhado será atualizado em todos os pontos que já o utilizam.

## Limites

- Sem novas seções de história, processo, indicadores, depoimentos ou vídeo.
- Sem mudanças na API/BFF, checkout, autenticação ou regras comerciais.
- Sem dependências novas ou migração de framework.
- O PSD termina no bloco institucional. Esta rota termina nesse bloco; não acrescentar o footer comercial escuro, ausente na referência. Os footers das demais rotas continuam existentes.
- Mobile/tablet são adaptações propostas: o arquivo fornecido só define desktop.
- Nomes, preços e fotos do catálogo são dados reais. Os valores do PSD servem de referência visual, não de cadastro de produtos.

## Relação com planejamento anterior

`docs/feature/home-redesign` documenta outra composição da home. Não executar aquelas tasks para construir esta página. Para o header público, a TASK-02 desta feature é a especificação visual vigente deste pedido; aproveitar verificações funcionais do plano anterior sem aplicar o layout anterior.

## Conclusão esperada

Tasks 01–08 aceitas, página navegável em `/about-us`, comparação desktop com o PSD registrada e fluxos de header/carrinho preservados. Este pacote entrega o projeto técnico; não declara a tela implementada.
