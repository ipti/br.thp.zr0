# Fase 1 — Esqueleto do app novo

Objetivo: montar a base do projeto Vite (roteamento, providers, layout, estilos globais)
onde as Fases 2 e 3 vão encaixar as páginas migradas. Ninguém trabalha nas fases seguintes
antes disso estar de pé.

Pré-requisito: Fase 0 concluída (framework decidido: **Vike**).

> **Fase concluída em 2026-07-22.** Esqueleto real em `br.thp.zr0/_vite-app/`, validado de
> ponta a ponta com SWA CLI + Azure Functions Core Tools local: `/` (SSR via function) e
> `/cart` (arquivo estático, zero function) responderam 200 com o conteúdo/comportamento
> esperado. Ver "Achados importantes" abaixo — mudam uma regra que vale para toda a Fase 3.

## Achados importantes (mudam a regra pra Fase 2/3)

1. **O build do Vike não gera um `index.html` genérico.** Toda página é montada por
   `renderPage()` a cada request — inclusive as páginas `ssr: false`. Sem ajuste, isso
   significa que **toda rota, mesmo as CSR, passaria pela function**, o que não bate com a
   premissa de "resto do app 100% estático, sem custo de servidor".
2. **Correção: toda página `ssr: false` que não depende de dado por request também precisa
   de `prerender: true`** no mesmo `+config.ts`. Isso faz o Vike gerar um HTML de verdade no
   build (ex.: `dist/client/cart/index.html`), servível como arquivo estático puro, sem
   tocar a function nunca. Confirmado: com `prerender: true`, `/cart` respondeu 200 direto
   do `dist/client`, sem nenhuma chamada à function nos logs.
   **Regra para a Fase 3 inteira**: todo `+config.ts` de rota client-only deve ter
   `{ ssr: false, prerender: true }`, não só `{ ssr: false }`.
3. **A function de SSR precisa ler o header `x-ms-original-url`, não `request.url`.** A Azure
   Static Web Apps reescreve `/` e `/product/*` internamente para `/api/ssr` — o
   `request.url` que a function recebe é o path já reescrito (`/api/ssr`), não o path que o
   usuário pediu. O path original (o que o Vike precisa pra rotear corretamente) vem no
   header `x-ms-original-url`. Sem isso, todo request pra `/` cai como 404 dentro do Vike
   (ele tenta rotear `/api/ssr`, que não existe como página).
4. Import relativo do `dist/server/entry.mjs` dentro da function precisa contar os níveis a
   partir do **JS compilado** (`api/dist/src/functions/ssr.js`), não do arquivo fonte
   (`api/src/functions/ssr.ts`) — são profundidades diferentes por causa do `rootDir`/`outDir`
   do `tsc`. E precisa ser uma variável (não string literal) no `import()`, senão o `tsc`
   tenta resolver o módulo relativo ao arquivo fonte (errado) e falha o build.

## Tarefas

### Setup do projeto

- [x] Criar o novo projeto (`create-vike@latest _vite-app --react`, dentro de `br.thp.zr0/`).
- [x] Portar `package.json`: mantidas as dependências não Next-específicas
      (`@stripe/react-stripe-js`, `@stripe/stripe-js`, `@tanstack/react-query`, `axios`,
      `cookie`, `formik`, `js-cookie`, `lucide-react`, `primeflex`, `primeicons`, `primereact`,
      `react-tiny-popover`, `sweetalert2`, `yup`, `zustand`).
- [x] Removido do `package.json`: `next`, `next-auth`, `eslint-config-next` (nunca entraram —
      partiu de um `package.json` limpo do zero).
- [x] `tsconfig.json` com `baseUrl` + `paths: { "@/*": ["src/*"] }`; `vite.config.ts` com alias
      `@` apontando para `./src` via `resolve.alias`.
- [x] `VITE_API_URL` (`.env` + `.env.example`) lido via `import.meta.env.VITE_API_URL` em
      `src/service/url_api.ts`.

### Roteamento

- [x] Estrutura de rotas do Vike (pastas em `pages/`, convenção `+Page.tsx`/`+config.ts`)
      iniciada com 2 rotas de prova: `pages/index` (SSR, home) e `pages/cart`
      (`ssr: false, prerender: true`, CSR estático). **Faltam as outras ~38 rotas** — ficam
      para dentro de cada sub-fase de 3, seguindo a regra do achado #2 acima.
- [x] Padrão confirmado por rota: `+config.ts` com `ssr: true` (default, não precisa declarar)
      para SEO; `{ ssr: false, prerender: true }` para todo o resto.
- [x] Layout raiz (`pages/+Layout.tsx`): providers (`QueryClientProvider`, `ToastProvider`),
      CSS globais (`primeflex.css`, `primeicons.css`, `globals.css`), script do Chatwoot.
      **Pendente**: `component.css` (agrega CSS de `button/`, `input/`, `card/` etc.) fica
      comentado até esses componentes serem portados na Fase 3f.

### Providers globais

- [x] `src/service/provider.tsx` — mantido só como referência de API; o `QueryClientProvider`
      real já está direto no `+Layout.tsx`.
- [x] `src/components/toast/context/index.tsx` — portado, mas **como placeholder**: mantém a
      API (`showToast`) para não travar o resto, só que sem o componente visual real
      (`ToastZRO`). Portar a UI de verdade é tarefa da Fase 3f.
- [x] `src/service/store/cart_store.ts` (zustand) — portado sem mudança de lógica.
- [x] `src/service/react-query.ts` — portado sem mudança.

### Fonte, script e ícones (troca de API do Next)

- [x] Fontes custom (`LibreBaskerville`, `Poppins`, `Inter`, referenciadas via `@font-face` em
      `globals.css`) — arquivos `.ttf` copiados para `_vite-app/assets/font/`, build resolve
      sem warning.
- [x] Chatwoot: portado para `<script>` injetado via `useEffect` no `+Layout.tsx` — mesmo
      comportamento do `afterInteractive` do `next/script` (só roda no client, depois do
      layout montar).
- [x] Favicon: copiado de `src/app/favicon.ico` para `_vite-app/public/favicon.ico`.
- [x] `next/font` (Geist) — **investigado e descartado**: é código morto do template Next
      (`page.module.css`, o único lugar que referencia `var(--font-geist-*)`, nunca é
      importado por `page.tsx`). Não portado — não faz sentido carregar Google Fonts por uma
      fonte que o app não usa de verdade.

### Deploy local (SWA CLI + Azure Function) — validado ponta a ponta

- [x] `_vite-app/api/`: Azure Function (Node v4, TypeScript) com handler `ssr` chamando
      `vike/server`'s `renderPage()`, lendo o path original via `x-ms-original-url`.
- [x] `_vite-app/staticwebapp.config.json`: `/` e `/product/*` reescritos para `/api/ssr`;
      resto cai no default de arquivo estático (sem `navigationFallback` — não existe um
      shell único, cada rota CSR tem seu próprio HTML prerenderizado).
- [x] `swa start dist/client --api-location api` local: `/` → 200 via function com conteúdo
      real; `/cart` → 200 direto do arquivo estático, **zero chamada à function** (confirmado
      nos logs do `func`).

## Critério de "pronto"

- [x] Projeto builda (`npm run build`) e roda em preview (`npm run preview`) sem erro.
- [x] Roteamento entre uma rota SSR (`/`) e uma rota CSR (`/cart`) funciona — confirmado via
      `curl` comparando HTML bruto das duas.
- [x] Providers (query client, toast, cart store) disponíveis globalmente, sem erro de build.
- [x] Emulação local SWA CLI + Function confirma o modelo de custo do plano: rota estática
      não invoca a function.

## Ainda não fechado (não bloqueia o início da Fase 2/3, mas fica registrado)

- [ ] `component.css` e o componente visual do Toast (`ToastZRO`) — portar na Fase 3f.
- [ ] Checar manualmente no console do navegador (não só build) se os providers não geram
      warning/erro em runtime.
- [ ] Revisar se falta algum reset de CSS que só existia implícito no Next, comparando
      visualmente a home real (Fase 2) com o app atual.
