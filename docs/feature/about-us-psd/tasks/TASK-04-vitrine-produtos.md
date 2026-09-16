# TASK-04 — Vitrine e cards de produtos

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** TASK-03

## Objetivo

Reproduzir a faixa “NOSSOS PRODUTOS” com catálogo real e link para a listagem.

## Arquivos previstos

- `src/app/about-us/components/about_products/about_products.tsx` e `.css`
- `src/app/about-us/components/product_card/product_card.tsx` e `.css`
- `src/app/about-us/page.tsx`

## Passos de implementação

1. Receber a seleção `ProductList` da página; card recebe `ProductType`.
2. Renderizar quatro colunas no desktop, fotos quase quadradas com cantos arredondados e linha de nome/preço abaixo.
3. Aplicar título e “VER TODOS →” alinhados conforme PSD, sem introdução editorial.
4. Usar UID nos links de detalhe e nas keys; formatar BRL com `Intl.NumberFormat('pt-BR')`.
5. Posicionar decoração de fundo sem bloquear conteúdo; reservar dimensões das imagens.
6. Tratar zero a quatro itens, imagem ausente, indisponibilidade e títulos/preços longos.

## Critérios de aceite

- Dados vêm da seleção única da página; nenhum produto/preço hardcoded do PSD em produção.
- Cards abrem o produto correspondente; “Ver todos” abre `/product`.
- Não há fetch por card, overflow ou botões/links aninhados.
- A área mantém estrutura e proporções do PSD com dados equivalentes.

## Validação e riscos

Verificar lista vazia, um/quatro produtos, ausência de imagem e valores longos. Fotografias diferentes da API devem ser registradas como diferença de dados, não disfarçadas com imagens de referência vinculadas ao produto errado.

## Resultado

Implementados `about_products.tsx`/`.css` e `product_card.tsx`/`.css`; `page.tsx` passou a buscar `getProducts()` uma única vez e repassar `products.slice(0, 4)` para `AboutProducts` (concluindo o desvio deliberado registrado na TASK-03, agora com o primeiro consumidor existente). `next build` compila `/about-us` sem erros e sem novos avisos de tipo; único warning de lint é `no-img-element` no `product_card.tsx`, aceitável pois a imagem vem da API (mesmo padrão já usado em `products_showcase.tsx`).

- **Dados reais, sem hardcode** — `AboutProducts` recebe `ProductList` da página; `ProductCard` recebe `ProductType` e usa `product.uid`/`product.name`/`product.price` da API; preço via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
- **Grid e link** — 4 colunas no desktop (`repeat(4, 1fr)`, ajusta para 2 colunas ≤1023px), fotos com `aspect-ratio: 1/1` e `border-radius: var(--about-product-card-radius)`; título + "Ver todos →" alinhados no topo, sem texto editorial extra; "Ver todos" aponta para `/product`.
- **Card sem aninhamento** — todo o card é um único `Link` para `/product/{uid}`; não há botões/links dentro do card.
- **Sem fetch por card** — `ProductCard` é puramente apresentacional; a única chamada de API acontece em `page.tsx`.
- **Estados tratados** — lista vazia mostra mensagem discreta ("Novos produtos estarão disponíveis em breve."); imagem ausente cai num placeholder decorativo (`aria-hidden`); indisponibilidade (`quantity <= 0`) mostra badge "Indisponível" sobre a imagem; nome longo trunca com `text-overflow: ellipsis` e não empurra o preço (`white-space: nowrap` + `flex-shrink: 0` no preço).

Nenhuma pendência conhecida nesta task.
