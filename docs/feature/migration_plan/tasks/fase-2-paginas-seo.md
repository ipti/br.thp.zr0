# Fase 2 — Páginas SEO-críticas (`/` e `/product/:id`)

Objetivo: as duas rotas que precisam aparecer prontas no Google/WhatsApp/Facebook, com SSR
serverless real (ver explicação da mecânica no MIGRATION_PLAN.md, seção 4.3) e todas as meta
tags necessárias.

Pré-requisito: Fase 1 concluída.

## 2.1 — Home (`/`)

Arquivos de referência hoje: `src/app/page.tsx`, `src/app/middleware/producs_list.ts`,
`src/app/components/{header,about,footer,impact,product,splitter_home,video}`.

- [ ] Portar `page.tsx` para o handler SSR da nova rota `/`, mantendo a lógica de
      `getProducts()` (buscar lista de produtos na API).
- [ ] **Corrigir o bug de cache**: trocar `cache: 'no-store'` por uma estratégia de cache real
      — decidir entre:
  - [ ] Cache na própria function com TTL curto (ex.: revalidar a cada 60s), ou
  - [ ] Delegar 100% o cache pro CDN via header `Cache-Control: s-maxage=60,
        stale-while-revalidate=300` na resposta da function (recomendado — mais simples,
        um lugar só para ajustar o TTL).
- [ ] Portar os componentes visuais (`Header`, `SplitterHome`, `About`, `VideoComponet`,
      `Impact`, `Product`, `Footer`) sem mudança de lógica — só ajustar imports/paths.
- [ ] Adicionar `<title>`, `<meta name="description">` e `<link rel="canonical" href=".../">`
      no `<head>` renderizado (hoje herda o título genérico do layout raiz).
- [ ] Adicionar Open Graph (`og:title`, `og:description`, `og:image`, `og:type=website`) e
      Twitter Card.

## 2.2 — Página de produto (`/product/:id`)

Arquivos de referência hoje: `src/app/product/[id]/page.tsx`,
`src/app/product/[id]/components/product_one.tsx` (hoje **100% client**, sem dado no HTML
inicial — é o maior gap de SEO encontrado na auditoria),
`src/app/components/product/details_product`, `src/app/product/components/product_reviews.tsx`.

- [ ] Reescrever a busca do produto (`useFetchrequestProductOneUid`) para rodar no servidor
      (dentro do handler SSR), não em `useEffect` — o dado já vem pronto na primeira
      renderização.
- [ ] Manter a parte interativa (troca de imagem via `imageIndex`/`setImageIndex`, botão de
      wishlist, reviews) como client-side após a hidratação — só o fetch inicial do produto
      sai do client para o servidor.
- [ ] Gerar por produto:
  - [ ] `<title>` = nome do produto.
  - [ ] `<meta name="description">` = descrição curta do produto.
  - [ ] `<link rel="canonical">` apontando para a URL canônica do produto.
  - [ ] Open Graph: `og:title`, `og:description`, `og:image` (imagem principal do produto),
        `og:type=product`.
  - [ ] Twitter Card equivalente.
  - [ ] JSON-LD `schema.org/Product`: `name`, `image`, `description`, `offers.price`,
        `offers.priceCurrency`, `offers.availability`.
- [ ] Tratar produto não encontrado / removido: handler SSR deve responder com status 404 real
      (não um HTML 200 com "produto não encontrado" — isso conta para o Google como conteúdo
      indexável errado).
- [ ] Definir e aplicar a mesma estratégia de cache da home (2.1) para esta rota.

## 2.3 — SEO técnico do site (não depende de página específica)

- [ ] Criar `robots.txt`: liberar `/` e `/product/*`; considerar bloquear `/cart`, `/profile`,
      `/seller`, `/payment`, `/auth` (não precisam de crawl budget do Google).
- [ ] Criar geração de `sitemap.xml`:
  - [ ] Decidir onde roda: endpoint próprio (function) que busca todos os IDs de produto na
        API e monta o XML, servido com cache, ou gerado por job agendado escrevendo o arquivo
        direto no Blob/CDN — depende da resposta ao ponto em aberto do MIGRATION_PLAN.md
        (seção 7, volume/frequência de mudança do catálogo).
  - [ ] Incluir `/` e cada `/product/:id`.
- [ ] Registrar o sitemap no Google Search Console após o primeiro deploy real (fica anotado
      aqui para não esquecer, é ação manual pós-deploy, não código).

## Critério de "pronto"

- `curl https://.../` e `curl https://.../product/<id>` retornam HTML com o conteúdo real
  (produtos, nome, preço) sem executar JS.
- Facebook Sharing Debugger e preview de link no WhatsApp mostram título/imagem/descrição
  corretos para pelo menos um produto de teste.
- `robots.txt` e `sitemap.xml` acessíveis e válidos (validar sitemap num validador XML/SEO).
- Nenhuma regressão de dado: preço/estoque exibido bate com o que está na API na hora do
  request (dentro da janela do cache definida).
