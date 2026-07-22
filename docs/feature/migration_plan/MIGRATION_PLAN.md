# Plano de Migração: Next.js → Vite (SPA + páginas estáticas para SEO)

Status: **em discussão — nada implementado ainda**
Última atualização: 2026-07-22

## 1. Contexto e motivação

Hoje o front (`br.thp.zr0`) é um Next.js 15 (App Router), servido como container Node 24/7
(`Dockerfile` + `docker-compose.yml`, `npm start` na porta 3000). A motivação da migração
é reduzir esse custo/complexidade: a maior parte do app é autenticada e interativa (carrinho,
perfil, área do vendedor, pagamento, auth) e não precisa de SSR nenhum — só a home e as
páginas de produto precisam de HTML pronto no servidor, para indexação no Google e para
gerar preview correto quando um link é compartilhado no WhatsApp/Facebook.

## 2. Objetivo

- Migrar o app para Vite.
- `/` (home, com listagem de produtos) e `/product/[id]` (página de produto) passam a
  entregar HTML já renderizado com conteúdo real e meta tags, sem depender de JS rodando
  no cliente para aparecer.
- Todo o resto do app (auth, carrinho, perfil, seller, pagamento) roda como SPA client-side
  puro, consumindo a API diretamente.
- Sair do modelo "container Node sempre ligado" para algo com custo proporcional ao uso.

### Não-objetivo (por enquanto)

- Não estamos otimizando o design/UX das páginas, só a arquitetura de renderização.
- Não estamos trocando a API (`br.thp.zr0.api`, NestJS) nem seu contrato.
- Não estamos indexando `/product` (a busca/listagem com filtros) como página estática —
  fica como SPA client-side, a não ser que decidamos o contrário (ver seção 7).

## 3. Diagnóstico do estado atual (auditoria feita antes deste plano)

| Item | Situação hoje | Impacto |
|---|---|---|
| `/` (home) | Server Component (`page.tsx`), busca produtos no servidor | Já é SSR, mas `producs_list.ts` usa `fetch(..., { cache: 'no-store' })`, o que anula o `export const revalidate = 60` da página — hoje roda SSR puro a cada request, não ISR |
| `/product/[id]` | `'use client'`, busca dados só via `useEffect` no navegador | **HTML inicial vazio.** Pior caso possível para SEO e para preview do WhatsApp/Facebook (esses crawlers não executam JS) |
| `/product` (listagem/busca) | Server Component que delega para `<Products>`, que por sua vez é client-driven para filtro/busca | Listagem base vem no HTML, mas resultado filtrado é client-side |
| `sitemap.xml` / `robots.txt` | Não existem | Google não tem mapa de URLs nem sinal do que pode/deve rastrear |
| `generateMetadata` | Não é usado em nenhuma rota | Toda página herda o mesmo `<title>`/`<meta description>` do layout raiz ("Zr0") — nenhuma página de produto tem título/descrição/OG image própria |
| Autenticação | **Não usa `next-auth`** apesar de estar no `package.json` (dependência não utilizada) — auth já é 100% client-side: token em cookie via `js-cookie`, anexado por interceptor do axios (`src/service/axios.tsx`) | Boa notícia: não há sessão server-side para migrar, o auth já é portável para uma SPA sem alterações de fundo |
| Acesso à API | Chamadas usam `apiUrl` (`NEXT_PUBLIC_API_URL`) direto para `https://zro-api.azurewebsites.net`, **não** passam pelo rewrite `/api/:path*` do `next.config.ts` | O rewrite parece não ser o caminho principal usado pelo app hoje — precisa confirmar se algo mais depende dele antes de remover |
| `middleware.ts` (raiz) | Seta header `x-path` com o pathname atual | Único consumidor encontrado: `src/app/middleware/get_page.tsx` — precisa virar `usePageContext().urlPathname` (Vike) |
| Uso de APIs do Next | `next/navigation`: 50 arquivos · `next/image`: 7 · `next/font`: 1 · `next/script`: 1 · `next/link`: 0 | `next/navigation` é a maior superfície mecânica de migração (trocar por `navigate()`/`usePageContext()` do Vike) |
| Rotas totais | 40 `page.tsx` | Dá o tamanho do app a migrar |

## 4. Decisões de arquitetura

### 4.1 Framework de roteamento/SSR sobre o Vite — decidido: Vike

Vite puro não faz SSR/SSG sozinho — precisa de uma camada por cima para as duas rotas que
exigem HTML pronto. A Fase 0 (spike, executada em 2026-07-22) testou as duas candidatas e
decidiu por **Vike**:

- **React Router v8** (nome atual do que era "v7") foi descartado: seu `ssr` é uma chave
  **global** no `react-router.config.ts` (app inteiro SSR ou export estático inteiro). O único
  mecanismo por rota (`prerender`) só gera HTML no build, não por request — não dá pra ter
  `/` e `/product/:id` sempre frescos via function serverless com o resto 100% CSR sem
  reescrever o próprio framework.
- **Vike** confirmado com teste real: `ssr?: boolean` é config por página (arquivo
  `+config.ts` de cada rota), default `true`. Build de prova mostrou HTML bruto com conteúdo
  completo em rotas SSR e `<div id="root"></div>` vazio na rota marcada `ssr: false` — exatamente
  o requisito. Ver detalhes e ressalvas técnicas (Vike é ESM-only, ajustes de `tsconfig` para
  rodar dentro de uma Azure Function) no
  [resultado da Fase 0](./tasks/fase-0-spike-validacao.md#resultado-executado-em-2026-07-22).

### 4.2 Estratégia de renderização por grupo de rota

| Rota | Modo |
|---|---|
| `/` | SSR/SSG com dados de produto |
| `/product/:id` | SSR/SSG com dados do produto (título, descrição, imagem, preço → meta tags e JSON-LD) |
| Todo o resto (auth, cart, profile, seller, payment, product-listing/busca) | SPA client-side puro, como já funciona hoje nos componentes `'use client'` |

> **Achado da Fase 1** (validado com SWA CLI + Azure Function local): por padrão o Vike não
> gera nenhum `index.html` estático — toda página, mesmo as `ssr: false`, seria renderizada
> pela function a cada request. Para as rotas "todo o resto" realmente não tocarem a function
> (e portanto não gerarem custo), o `+config.ts` de cada uma delas precisa das **duas** chaves:
> `{ ssr: false, prerender: true }`. Com isso o Vike gera um HTML de verdade no build, servido
> como arquivo estático puro. Confirmado: `/cart` respondeu 200 direto do `dist/client`, sem
> nenhuma chamada à function nos logs. Detalhes em
> [fase-1-esqueleto-app.md](./tasks/fase-1-esqueleto-app.md#achados-importantes-mudam-a-regra-pra-fase-23).

### 4.3 Como manter os dados frescos sem voltar a pagar por um servidor 24/7

Em vez de gerar HTML estático só no build (que fica desatualizado até o próximo deploy),
a recomendação é rodar a renderização de `/` e `/product/:id` como **função serverless**
(ex.: Azure Functions, já que a API já está no Azure) — paga por execução, escala a zero
quando não tem tráfego, e sempre busca dado atual na API (resolve de quebra o bug do
`cache: 'no-store'` atual). Isso entrega:

- Conteúdo sempre atual (equivalente ao SSR de hoje, sem o bug de cache).
- Custo proporcional ao uso, não um container fixo.
- HTML real para Googlebot, WhatsApp e Facebook (que não executam JS).

Alternativa mais "estática pura": pré-renderizar no build e reconstruir em um schedule
(ex.: a cada N minutos via pipeline) — zero compute em runtime, mas dado pode ficar
desatualizado entre builds e cada produto novo/alterado só aparece após rebuild. Decidir
isso depende do volume de produtos e da frequência de mudança de preço/estoque (pergunta
em aberto, seção 7).

### 4.4 Autenticação

Já é client-side (cookie + axios interceptor) — não depende de `next-auth` (que é uma
dependência não usada hoje). Migração é baixo risco: portar o guard de rota autenticada
(hoje `usePathname()` do Next em `access_page.tsx`) para `useData`/roteamento do Vike, sem
mudar o fluxo de login/token.

### 4.5 Acesso à API

Chamar a API diretamente do navegador (`NEXT_PUBLIC_API_URL` → variável equivalente do Vite),
com CORS liberado no NestJS para o domínio do front. Já é essencialmente o que acontece hoje
(as chamadas não passam pelo rewrite do Next). Evita manter um proxy.

### 4.6 SEO técnico a corrigir (independente da escolha de framework)

- `robots.txt` liberando `/` e `/product/*`, e opcionalmente bloqueando `/cart`, `/profile`,
  `/seller`, `/payment`, `/auth` (não precisam de crawl budget).
- `sitemap.xml` gerado a partir da lista de produtos da API (endpoint próprio ou gerado no
  mesmo processo de build/rebuild agendado).
- Meta tags por página: `<title>`, `<meta name="description">`, `<link rel="canonical">`,
  Open Graph (`og:title`, `og:description`, `og:image`, `og:type=product`) e Twitter Card —
  essenciais para o preview de WhatsApp/Facebook funcionar, já que esses crawlers não rodam
  JS.
- Dados estruturados JSON-LD (`schema.org/Product`: nome, imagem, preço, disponibilidade) nas
  páginas de produto, para elegibilidade a rich results no Google.

### 4.7 Hospedagem

Saída natural: build estático do SPA (`dist/`) em hosting estático (Azure Static Web Apps ou
Blob Storage + CDN) + as duas functions serverless para `/` e `/product/:id`. Isso substitui
o container Node do `Dockerfile`/`docker-compose.yml` atual — a ser revisado/removido ao
final da migração.

## 5. Mapeamento de dependências e APIs Next → Vite

| Next.js | Equivalente no novo stack |
|---|---|
| `next/navigation` (`useRouter`, `useParams`, `usePathname`) | `navigate()` (`vike/client/router`) + `usePageContext()` (`vike-react/usePageContext`) — 50 arquivos a tocar |
| `next/image` | `<img>` com atributos de otimização manual, ou lib de imagem agnóstica de framework — 7 arquivos |
| `next/font` (Geist) | **Descartado**: código morto do template Next, nunca usado de fato (ver achado da Fase 1) |
| `next/script` (Chatwoot) | `<script>` injetado via `useEffect` no layout raiz — mesmo comportamento, sem mudança |
| `next/link` | Não usado hoje (0 ocorrências) — sem trabalho aqui |
| `middleware.ts` (`x-path` header) | Substituir o único consumidor (`app/middleware/get_page.tsx`) por `usePageContext().urlPathname` |
| Rota client-only (SPA) | `+config.ts` com `{ ssr: false, prerender: true }` — as duas chaves, não só `ssr: false` (ver achado da Fase 1) |
| `generateMetadata` | Emitido manualmente no handler SSR de cada rota estática (home/produto) |
| Rewrite `/api/:path*` | Remover — chamadas já usam a URL direta da API |
| `next-auth` (dependência) | Remover do `package.json` — não está em uso |

## 6. Fases propostas

- **Fase 0 — Spike de validação (100% local) — concluída:** confirmou Vike como framework
  (React Router v8 descartado — ver 4.1). Custo real e cold start da function ficam para
  serem medidos na Fase 4, quando o deploy definitivo acontecer.
- **Fase 1 — Esqueleto do app novo — concluída:** projeto Vike criado em `_vite-app/`,
  providers (react-query, toast, cart store) portados, layout base, deploy local ponta a
  ponta validado com SWA CLI + Azure Function. Achados importantes registrados em
  [fase-1-esqueleto-app.md](./tasks/fase-1-esqueleto-app.md) — em especial a exigência de
  `prerender: true` em toda rota client-only.
- **Fase 2 — Páginas SEO-críticas:** `/` e `/product/:id` com SSR/SSG real, meta tags, JSON-LD,
  `robots.txt`, `sitemap.xml`.
- **Fase 3 — Resto do app como SPA:** auth, cart, profile, seller, payment — port mecânico dos
  componentes já `'use client'`, trocando só as APIs de roteamento do Next.
- **Fase 4 — Corte de tráfego:** deploy em paralelo, validação de indexação (Search Console,
  teste de preview no WhatsApp/Facebook), então substituição do container Node atual.
- **Fase 5 — Limpeza:** remover `Dockerfile`/`docker-compose.yml` antigos, dependências Next
  não usadas, rewrite `/api` no `next.config.ts`.

## 7. Riscos e pontos em aberto (precisam de decisão)

- **Volume/frequência de mudança do catálogo:** define se compensa pré-renderizar tudo no
  build (com rebuild agendado) ou se vale mesmo a pena a function serverless por request.
  Sem essa resposta não dá pra fechar a seção 4.3.
- **`/product` (listagem com filtro) também deveria ser indexável?** Hoje o plano trata só
  `/` e `/product/:id` como estáticos. Se a busca por categoria/filtro também for relevante
  para SEO, precisa entrar no mesmo tratamento.
- **`next-auth` realmente não é usado em lugar nenhum?** Confirmado por busca no código-fonte,
  mas vale checar histórico/branches antes de remover de vez.
- **Quem mantém a function serverless de SSR:** decidir se fica no mesmo Azure Function App
  da API (`br.thp.zr0.api`) ou em um app separado.
- **SLA de indexação:** não há hoje nenhum dado do Google Search Console consultado — vale
  confirmar depois da migração se o problema de indexação era mesmo o que diagnosticamos, ou
  se há outros fatores (robots bloqueando por engano, canonical errado, etc.).

## 8. Fora de escopo deste plano

- Reforma visual/UX das páginas.
- Mudanças de contrato na API NestJS.
- Otimização de performance além do necessário para SSR/SEO (Core Web Vitals fica para depois).
