# TASK-05 — Produto em destaque, seleção e carrinho

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** TASK-04

## Objetivo

Construir o painel de produto com seleção por miniaturas e duas ações conforme PSD.

## Arquivos previstos

- `src/app/about-us/components/featured_product/featured_product.tsx` e `.css`
- `src/app/about-us/components/product_selector/product_selector.tsx` e `.css`
- `src/app/about-us/components/featured_product/__tests__/featured_product.test.tsx`
- `src/app/about-us/page.tsx`

## Passos de implementação

1. Criar ilha client com `products: ProductList` e seleção por UID, inicial no primeiro item.
2. Montar imagem grande à esquerda; nome/preço no topo direito, descrição abaixo e duas ações alinhadas à base.
3. Renderizar abaixo as miniaturas dos mesmos produtos, incluindo o ativo com contorno. Botões usam `aria-pressed` e nome do produto.
4. Ao selecionar, atualizar imagem, nome, preço, descrição e destino/ação de compra juntos. Lista vazia não renderiza painel inválido.
5. “MAIS DETALHES” é link para `/product/{uid}`; “ADICIONAR AO CARRINHO” usa `ZButton`, uma unidade e `useCartStore.addItem`, com `useToast`.
6. Conferir estoque disponível contra quantidade já adicionada. Se faltar informação de estoque/opções, permitir detalhes e impedir compra direta indevida.
7. Não adicionar avaliações, favorito, frete ou seletor de quantidade ausentes no PSD; essas funcionalidades continuam na página de produto.
8. Respeitar a persistência existente sem criar camada nova de sincronização. Feedback confirma ação local, não validação remota.

## Critérios de aceite

- Primeiro produto ativo; qualquer miniatura troca todos os dados do painel.
- Miniatura ativa permanece na lista e é distinguível por contorno e semântica.
- Adicionar envia ID/preço/imagem do produto ativo, jamais do anteriormente selecionado.
- Estoque insuficiente/ausente não permite adição; detalhes continuam acessíveis.
- Ambos os rótulos dos botões permanecem visíveis no mobile.

## Validação e riscos

Testes comportamentais: seleção e compra do segundo item, produto sem estoque, limite com item já no carrinho, lista vazia e seleção removida após mudança de props. Usar fixtures só nos testes. O store atual não confirma sincronização remota; preservar seu contrato e registrar qualquer limitação encontrada sem ampliar esta feature para refatorar carrinho.

## Resultado

Implementados `featured_product.tsx`/`.css`, `product_selector.tsx`/`.css` e o teste comportamental `featured_product.test.tsx` (7 casos, todos passando com `renderWithProviders`/`resetAllStores` e store real de carrinho, sem mock do zustand). `page.tsx` passou a renderizar `<FeaturedProduct products={featuredProducts} />` reaproveitando a mesma seleção de 4 produtos já usada por `AboutProducts`. `next build` e `eslint` sem erros (apenas os mesmos avisos `no-img-element` já aceitos nas outras tasks, pela imagem vir da API).

- **Seleção por UID** — estado local `selectedUid` inicia no primeiro produto; um `useEffect` recalcula para `products[0]` quando a seleção ativa não existe mais na lista de props (testado no caso "reseta a seleção após mudança de props").
- **Troca atômica de dados** — imagem, nome, preço, descrição, link de detalhes e ação de compra são todos derivados do mesmo `selectedProduct`; miniatura testada confirma que trocar a seleção troca tudo junto e que o item enviado ao carrinho é sempre o produto ativo, nunca o anterior.
- **Miniaturas** — `ProductSelector` usa `aria-pressed` + `aria-label` com o nome do produto; a miniatura ativa recebe contorno via `product-selector__thumb--active`.
- **Ações** — "Mais detalhes" é `Link` para `/product/{uid}`; "Adicionar ao carrinho" usa `ZButton` (`PrimeReact Button`), `useCartStore().addItem` com contrato `{ id: uid, name, price, quantity: 1, image }`, e `useToast` para feedback local (não reivindica confirmação remota).
- **Estoque** — compara `product.quantity` contra a soma já presente no carrinho (`quantityInCart`); estoque insuficiente ou ausente desabilita apenas "Adicionar ao carrinho" e mostra uma nota explicando o estado (`role="status"`), mantendo "Mais detalhes" sempre acessível.
- **Lista vazia** — `FeaturedProduct` retorna `null` sem painel inválido.
- **Mobile** — ambos os botões ficam em coluna, largura total, com o texto completo do rótulo sempre visível (sem colapsar para ícone).
- **Sem escopo extra** — nenhuma avaliação, favorito, frete ou seletor de quantidade foi adicionado; o store de carrinho não foi alterado.

Nenhuma pendência conhecida nesta task.
