# Validação — `/about-us` e header compartilhado

## Identificação

- **Relacionada a:** TASK-08, HF-ABOUT-PSD-001, HT-ABOUT-PSD-001
- **Ambiente:** máquina local Windows, sem navegador gráfico disponível nesta sessão (execução via terminal/CLI apenas).

## O que foi executado e o que não foi

Esta validação combina comandos automatizados (lint, `tsc`, testes, build) com uma checagem funcional via `next start` + `curl`/inspeção do HTML gerado no servidor. **Não houve captura visual em navegador real** (Chrome/Firefox) em nenhuma largura, nem sobreposição pixel a pixel com o PSD, nem navegação manual por teclado/zoom em viewport real, nem sessão autenticada real. Esses pontos ficam marcados como bloqueio abaixo, conforme pedido pela própria task ("documentar limitações em vez de declarar aprovação sem execução").

## 1. Lint, TypeScript, testes e build

| Comando | Resultado | Observação |
| --- | --- | --- |
| `npm run lint` | 176 erros / 18 avisos no repositório | Nenhum erro está em `src/app/about-us/` ou `src/components/header/`; os 3 arquivos novos do catálogo (`featured_product.tsx`, `product_card.tsx`, `product_selector.tsx`) têm apenas o aviso `@next/next/no-img-element`, aceito porque a foto vem da API (mesmo padrão de `products_showcase.tsx` da landing). Todos os 176 erros restantes são pré-existentes em módulos não tocados por esta feature (`seller/*`, `production-order`, `service/*` etc.). |
| `npx tsc --noEmit` | 114 erros no repositório | Nenhum em `src/app/about-us/`. Os erros em `src/components/header/` (`cart_dialog.tsx`, `header_seller.tsx`, `header.test.tsx`) já existiam antes desta feature — não foram arquivos alterados nas TASK-02/07 além de `header.tsx`/`header.css`/`header_navigation`/`header_social`, que não aparecem na lista. |
| `npx jest` (suíte completa) | 56 passaram / 5 falharam, em 22 suítes (2 falharam) | As 2 suítes com falha são `src/components/payment/__tests__/payment-runtime-config.test.tsx` e `src/app/production-order/components/__tests__/encomenda.integration.test.tsx` — nenhum arquivo desses módulos foi tocado por esta feature (`git status` confirma). Falhas pré-existentes, não relacionadas a `/about-us` ou ao header. |
| `npx jest src/components/header src/app/about-us` | 9 passaram / 9 total | Toda a suíte específica desta feature (header + about-us) passa. |
| `npm run build` (`next build`) | Sucesso, `/about-us` gerado como rota dinâmica (`ƒ`) | Sem erros de tipo/lint bloqueando o build (o projeto já ignora lint/tsc no build via `next.config.ts`). |

## 2. Validação funcional via `next start`

Como não há navegador disponível, subi o build de produção (`npx next start`) e inspecionei o HTML retornado por `curl` para cada rota relevante. A API de produtos respondeu com dados reais durante o teste (não foi necessário mock).

| Rota | Status HTTP | Observação |
| --- | --- | --- |
| `/about-us` | 200 | Um único `<header class="site-header">`; `h1` único (`about-hero-title`); `h2` em produtos, destaque e fechamento; âncoras `id="history"` e `id="sustentability"` presentes. |
| `/` (flag `NEW_LANDING_PAGE_ENABLED=true`) | 200 | Um único header; `landing-hero` presente (fluxo novo). |
| `/` (flag `NEW_LANDING_PAGE_ENABLED=false`, testado via env override e novo processo) | 200 | Um único header; `landing-hero` ausente, `p-splitter-*` presente (fluxo antigo/`SplitterHome`) — confirma que os dois caminhos da flag continuam funcionando. |
| `/product` | 200 | Um único header. |
| `/cart` | 200 | Um único header. |
| `/production-order` | 200 | Um único header. |
| `/profile`, `/seller/home` | 307 (redirect) | Rotas protegidas redirecionam sem sessão, como esperado — não foi possível validar o conteúdo autenticado (`MenuUser`, `HeaderSeller` renderizado) porque não há credenciais/sessão disponíveis neste ambiente. **Bloqueio documentado, não testado.** |

### Catálogo real em `/about-us`

O HTML retornado trouxe 4 produtos reais da API (não fixtures do PSD), confirmando que a vitrine e o destaque usam dados reais:

| Produto | Preço formatado |
| --- | --- |
| mesa alta | R$ 700,00 |
| Mesa RostArte | R$ 450,00 |
| Mesa de centro | R$ 500,00 |
| Cadeira | R$ 200,00 |

As miniaturas (`product_selector`) renderizaram as 4 opções, a primeira ativa (`product-selector__thumb--active`) — consistente com o critério "primeiro produto ativo" da TASK-05.

Os dois links de `HeaderSocial` renderizaram como `header-social__link--disabled` (Facebook/Instagram), porque `NEXT_PUBLIC_FACEBOOK_URL`/`NEXT_PUBLIC_INSTAGRAM_URL` continuam vazios em `.env.example` — isso é a pendência já registrada na TASK-02/HF, não uma regressão.

## 3. Estados e exceções (validados por teste automatizado, não por clique manual)

Cobertos por `featured_product.test.tsx` (7 casos, todos passando): seleção troca todos os dados juntos; compra do produto ativo (nunca do anterior); produto sem estoque bloqueia a compra mas mantém "Mais detalhes" acessível; limite atingido pelo carrinho bloqueia nova adição; lista vazia não renderiza painel; seleção se recalcula quando o produto ativo some da nova seleção de props.

Catálogo vazio na vitrine (`AboutProducts`) e imagem ausente (`ProductCard`/`ProductSelector`) têm tratamento no código (mensagem discreta / placeholder), mas não foram exercitados por teste automatizado nem por uma falha real de API nesta sessão — a API respondeu normalmente durante a checagem. **Não testado com falha real de catálogo.**

## 4. Larguras, teclado, foco e zoom — NÃO VALIDADO EM NAVEGADOR REAL

Toda a responsividade (360/390/768/1024/1440/1920 px), navegação por teclado (Tab/Escape/Enter), foco visível e zoom 200% foram conferidos apenas por **leitura estática do CSS** (registrado nos resultados das TASK-02/07), não por interação real em navegador. Isso inclui a comparação lado a lado com o PSD em 1920 px, que exige inspeção visual e não foi feita.

**Recomendação explícita:** antes de considerar `/about-us` aprovada para produção, alguém com acesso a um navegador deve:
1. Abrir `/about-us` em 1920 px e comparar com `docs/feature/about-us-psd/reference/psd-preview.jpg`.
2. Repetir em 360, 390, 768 e 1024 px.
3. Navegar pelo header e pelas miniaturas só com teclado, e testar zoom 200%.
4. Logar com uma conta real para validar `MenuUser`, `HeaderSeller` (rota `/seller/home`) e o fluxo autenticado do carrinho/perfil/pedidos/pagamento/encomenda mencionados no critério da TASK-08.

## 5. Divergências e pendências conhecidas (consolidado das tasks anteriores)

| Pendência | Origem | Status |
| --- | --- | --- |
| Recortes `about_hero_chair.png` e `about_hero_person.png` ausentes; hero usa placeholders reservados sem imagem | TASK-01 / TASK-03 | Em aberto — depende de exportação a partir do PSD original. |
| Alt text de `pessoas_zr0.svg` no fechamento não confirmado visualmente (arquivo grande, não inspecionado) | TASK-01 / TASK-06 | Em aberto — usei alt conservador; recomendo validação visual. |
| URLs oficiais de Facebook/Instagram ainda não definidas | Histórico funcional / TASK-02 | Em aberto — comportamento correto (link desabilitado, sem `href="#"`), falta só o valor real das variáveis de ambiente. |
| Alvo de toque do ícone social do header abaixo de 44×44px em ≤599px | TASK-02 | **Resolvido na TASK-07** (`header_social.css` ajustado para `2.75rem`). |
| `/about-us` fora do sitemap | TASK-07 | **Resolvido** (`src/app/sitemap.ts` atualizado). |

Nenhuma dessas pendências foi silenciada ou contornada com mock/regra genérica; todas já estavam documentadas nas tasks correspondentes.

## Conclusão

Lint, `tsc`, testes automatizados e build não mostram regressão introduzida por esta feature; os únicos problemas nesses comandos são pré-existentes em código não tocado. A checagem funcional via `next start` confirma header único em todas as rotas verificadas, os dois caminhos da flag da home, catálogo real (não hardcoded) em `/about-us`, e as âncoras/IDs esperados presentes no HTML.

Esta validação **não substitui** uma revisão visual em navegador real contra o PSD nem um teste com sessão autenticada — ambos ficam como trabalho pendente e explicitado acima, não como "aprovado".
