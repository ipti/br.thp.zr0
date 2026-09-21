# Loja de produtos — implementação baseada no PSD

## Identificação

- **Feature:** PRODUCT-STORE-PSD
- **Status:** Planejada; implementação não iniciada.
- **Referência:** `/Users/jonny/Downloads/THP-ZRO-LP-2026 (3) - LOJA.psd`.
- **Composição de referência:** desktop, 1920 × 4864 px.
- **Rota principal:** `/product`.
- **Catálogo completo:** `/product/all`.

## Objetivo

Transformar `/product` em uma vitrine editorial e comercial baseada no PSD da loja. A listagem atual de produtos não será descartada: ela será movida para `/product/all` e continuará responsável por busca, filtros, ordenação e paginação.

## Documentos

- [História funcional](./historia-funcional.md)
- [História técnica](./historia-tecnica.md)
- [Tasks de implementação](./tasks/README.md)
- [Preview completo do PSD](./reference/psd-preview.jpg)

## Escopo

- Criar a vitrine editorial em `/product`.
- Preservar a listagem completa em `/product/all`.
- Preservar `/product/[id]` para detalhes.
- Integrar produto em destaque, galeria, preço, estoque e carrinho com dados reais.
- Exibir quatro recomendações em “Veja também”.
- Incluir hero, manifesto, vídeo e fechamento institucional do PSD.
- Atualizar navegação, URLs antigas, metadata e sitemap.
- Adaptar a composição desktop para tablet e mobile.

## Limites

- O PSD é a referência visual de desktop; tablet e mobile são adaptações responsivas.
- Nome, preço, descrição, estoque e imagens vêm da API. O conteúdo comercial presente no PSD não deve virar cadastro fixo no frontend.
- Não alterar regras de checkout, autenticação ou cálculo de estoque.
- Não introduzir avaliações, frete ou seletor de quantidade na vitrine quando ausentes no PSD.
- Não usar o componente de vídeo atual sem revisar seus estilos, pois ele contém posicionamento específico da Home.
- Camadas ocultas do PSD não fazem parte da entrega até aprovação explícita.

## Resultado esperado

Ao concluir todas as tasks, `/product` deverá reproduzir a hierarquia do PSD, `/product/all` deverá manter integralmente o catálogo atual e os links antigos deverão continuar funcionando por redirecionamento ou atualização de destino.

Este pacote contém apenas o planejamento. Nenhuma task deve ser marcada como concluída antes da implementação e das validações descritas.
