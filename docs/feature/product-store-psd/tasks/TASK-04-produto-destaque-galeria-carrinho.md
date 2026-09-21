# TASK-04 — Produto em destaque, galeria e carrinho

## Metadados

- **Prioridade:** P0
- **Status:** Concluída
- **Dependências:** TASK-03

## Objetivo

Implementar o bloco comercial principal do PSD com dados reais: imagem grande, galeria do mesmo produto, informações, detalhes e adição ao carrinho.

## Arquivos previstos

- `src/app/product/page.tsx`
- `src/app/product/components/storefront/featured_product.tsx`
- `src/app/product/components/storefront/featured_product.css`
- `src/app/product/components/storefront/featured_gallery.tsx`
- testes dos componentes e do carrinho

## Implementação

1. Resolver o produto em destaque no servidor por `STORE_FEATURED_PRODUCT_UID`.
2. Se a configuração não existir ou não encontrar produto, usar o primeiro produto disponível como fallback documentado.
3. Passar ao componente client somente os dados necessários à interação.
4. Ordenar `product_image` por `order` quando o campo estiver disponível.
5. Exibir a primeira imagem válida como imagem principal e até quatro miniaturas no desktop.
6. Ao selecionar uma miniatura, alterar apenas a imagem principal; não trocar o produto, preço ou descrição.
7. “Mais detalhes” aponta para `/product/{uid}`.
8. “Adicionar ao carrinho” reutiliza `useCartStore`, `ZButton` e `useToast`, adicionando uma unidade.
9. Considerar a quantidade do mesmo produto já existente no carrinho antes de habilitar nova adição.
10. Quando não houver estoque, desabilitar compra, mas manter detalhes disponíveis.
11. Quando não houver imagens, mostrar placeholder com proporção estável e texto alternativo apropriado.
12. Não fixar “Cadeira”, “R$ 250” ou qualquer conteúdo comercial presente no PSD.

## Critérios de aceite

- Imagem, nome, preço e descrição pertencem ao mesmo produto.
- A miniatura ativa possui indicação visual e `aria-pressed`.
- A adição envia UID, nome, preço e imagem corretos ao carrinho.
- Limite de estoque funciona considerando o carrinho atual.
- Produto sem estoque não pode ser adicionado.
- Produto sem imagem não quebra o layout.
- Lista vazia não renderiza painel comercial inválido.
- Os botões mantêm rótulos completos e estados de foco visíveis.

## Testes

- Seleção da segunda miniatura.
- Produto com uma imagem e com mais de quatro imagens.
- Produto sem imagem.
- Adição com carrinho vazio.
- Adição no limite de estoque.
- Produto sem estoque.
- UID configurado inexistente e fallback para primeiro produto.
