# Fase 0 — Spike de validação (100% local, sem deploy novo)

Objetivo: provar, num protótipo pequeno e descartável, que a arquitetura escolhida
(SSR serverless para `/` e `/product/:id` + SPA estática para o resto) funciona, **sem criar
nenhum recurso novo na Azure**. Toda a validação roda na máquina local, usando as ferramentas
de emulação que Azure já disponibiliza para isso. Não reaproveitar código deste spike no app
final — é só para validar decisões.

> Decisão registrada: não vamos provisionar um Static Web App / Function App novo só para o
> spike. O que puder ser validado localmente, valida localmente; o que só dá pra confirmar em
> produção real (custo faturado, cold start em condição real de rede) fica para a Fase 4,
> quando o deploy definitivo já for acontecer de qualquer forma.

## Tarefas

- [ ] Criar um projeto Vite novo e isolado (fora do repo do app, ou em branch descartável).
- [ ] Prototipar com **React Router v7 (framework mode)**:
  - [ ] Uma rota estática/SSR simples (ex.: home fake com 2–3 produtos mockados).
  - [ ] Uma rota puramente client-side (ex.: `/teste-spa`).
  - [ ] Gerar o build e confirmar que ele produz separadamente: bundle client (`dist/client`)
        e bundle server (`dist/server`, um módulo Node com função de `render`).
- [ ] Empacotar o bundle server dentro de uma Azure Function (Node, programming model v4) e
      rodar **só localmente** com Azure Functions Core Tools (`func start`) — sem publish.
- [ ] Instalar e usar a **Static Web Apps CLI** (`@azure/static-web-apps-cli`, comando `swa`),
      que emula localmente o roteamento do `staticwebapp.config.json` + a Function vinculada,
      exatamente como rodaria em produção, sem precisar de nenhum recurso Azure criado:
  - [ ] `swa init` / `swa start` apontando para o build estático (client) + a Function local
        (`func start`) rodando em paralelo.
  - [ ] Configurar `staticwebapp.config.json` roteando `/` e `/product/*` para a Function e o
        resto para o fallback de SPA (`index.html`) — validar que o `swa` local respeita essas
        regras.
- [ ] Confirmar localmente (via `http://localhost` da `swa cli`):
  - [ ] `curl`/`view-source:` em `/` mostra HTML com conteúdo, sem precisar rodar JS.
  - [ ] DevTools "Disable JavaScript" em `/product/:id` ainda mostra título/descrição/imagem.
  - [ ] Rota SPA (`/teste-spa`) funciona normalmente, roteamento client-side com
        `react-router-dom` sem reload de página.
- [ ] Validar as meta tags/OG de um jeito que não exija deploy: inspecionar o HTML bruto
      (`view-source:`) e conferir manualmente as tags `og:*`/JSON-LD — só usar o
      [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) ou testar
      preview no WhatsApp **se** for aceitável abrir um túnel temporário (ex.: `ngrok`) para o
      `localhost`, já que essas ferramentas exigem uma URL pública; se não quiserem nem isso,
      pular essa validação real de preview para a Fase 4 (quando já vai existir uma URL
      pública de qualquer forma).
- [ ] Repetir o mesmo teste rápido com **Vike** (só o suficiente para comparar DX/configuração),
      caso o resultado do React Router v7 não seja satisfatório.
- [ ] Documentar a decisão final (framework escolhido, motivo) atualizando a seção 4.1 do
      [MIGRATION_PLAN.md](../MIGRATION_PLAN.md).

## O que este spike **não** valida (fica para a Fase 4, com o deploy real)

- Custo real faturado da Function no plano Consumption — só existe número de verdade com
  tráfego real em produção.
- Latência de cold start em condição real de rede/região — a emulação local não reproduz o
  tempo de start de uma Function na nuvem.
- Comportamento do cache de CDN/edge (`s-maxage`, `stale-while-revalidate`) — CDN só existe
  quando published.

## Critério de "pronto"

- Framework escolhido e justificado por escrito.
- Prova local (via `swa cli` + `func start`) de que SSR serverless + SPA estática coexistem
  com o roteamento por path funcionando, sem nenhum recurso Azure novo criado.
- Lista clara do que ficou pendente de validação para a Fase 4 (custo, cold start, cache real).

## Resultado (executado em 2026-07-22)

- **Framework escolhido: Vike** (não React Router v8). Achado decisivo: o `react-router.config.ts`
  gerado pelo `create-react-router` mostra que `ssr` é uma chave **global** (app inteiro SSR ou
  app inteiro export estático); o único mecanismo por rota (`prerender`) só gera HTML no
  **build**, não por request — não atende ao requisito de "SSR só em `/` e `/product/:id`,
  CSR puro no resto, sempre fresco".
- Vike confirmado com prova real (`vike-react/dist/types/Config.d.ts` documenta
  `ssr?: boolean` por página, `@default true`). Testado em `spike-vike-migration/`:
  - `/` (SSR default) → HTML bruto já vem com `<h1>` e conteúdo.
  - `/star-wars/:id` (análogo a `/product/:id`, com `+data.ts` buscando dado no servidor) →
    HTML bruto já vem com `<title>` e `<h1>` dinâmicos por produto.
  - `/spa-test` (`ssr: false`) → HTML bruto vem `<div id="root"></div>` vazio, só popula
    depois do JS — exatamente o comportamento esperado pro resto do app (cart, profile,
    seller, payment).
- Empacotamento em Azure Function (Node v4, `func start` local) funcionou, com duas
  ressalvas técnicas a carregar para a Fase 1/2:
  - Vike é **ESM-only**; a Function compila para CommonJS por padrão — foi necessário usar
    `import()` dinâmico para `vike/server` e para o `dist/server/entry.mjs` (bootstrap que
    registra as páginas via `setGlobalContext_prodBuildEntry`), em vez de import estático.
  - `tsconfig.json` da Function precisou de `"module": "node16"`, `"moduleResolution":
    "node16"` e `"skipLibCheck": true` — sem isso, o `tsc` falha tentando resolver tipos de
    adapters opcionais do Vike (Express, Hono, Cloudflare, Bun, etc.) que não usamos.
  - `renderPage(pageContextInit)` retorna `{ httpResponse: { statusCode, headers: [string,
    string][], body: string } }` — mapeamento direto pro `HttpResponseInit` do Azure
    Functions.
- Validação via SWA CLI (roteamento `/` e `/product/*` → function, resto → estático) ficou
  iniciada mas não finalizada nesta rodada — retomar antes de fechar a Fase 0 de vez, ideal
  fazer isso já dentro do esqueleto real da Fase 1 em vez de num projeto descartável.

## Riscos a observar durante o spike

- A emulação local da `swa cli` não é 100% idêntica ao ambiente publicado — tratar os
  resultados como "forte indício", não garantia total; a Fase 4 é quem confirma de verdade.
- Confirmar que o Azure Functions Node runtime suporta as versões de ESM/bundling que o
  React Router v7 ou Vike geram (alguns setups de SSR dependem de `import.meta`, top-level
  `await`, etc.) — isso já dá pra testar com o `func start` local, sem depender de deploy.
