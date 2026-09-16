# TASK-07 — Integração e responsividade

## Metadados

- **Prioridade:** P1
- **Status:** Concluída (revisão estática; sem captura visual manual, ver Resultado)
- **Dependências:** TASK-02, TASK-05, TASK-06

## Objetivo

Integrar os blocos na sequência original e adaptar o layout sem perder conteúdo ou ações.

## Arquivos previstos

- `src/app/about-us/page.tsx`, `about_us.css` e estilos dos componentes
- `src/components/header/header.css` e navegação
- `src/app/sitemap.ts` se a rota não estiver incluída
- Consumidores de offsets do header quando necessário

## Passos de implementação

1. Conferir sequência Header → Hero → Vitrine → Destaque/miniaturas → Fechamento.
2. Ajustar desktop contra as medidas da referência; aplicar tokens locais e hierarquia de títulos.
3. Ajustar tablet em 600–1023 px e mobile até 599 px: preservar todo texto, empilhar destaque/fechamento e adequar grids.
4. Confirmar que header, Popover, login e decoração não geram cortes ou overlays indevidos.
5. Verificar contraste, foco, alt, áreas de toque, zoom 200% e preferências de movimento reduzido.
6. Manter imagens dimensionadas; carregamento abaixo da dobra sob demanda; conferir política atual de imagens remotas antes de usar Next Image no catálogo.
7. Conferir metadata, sitemap e links existentes para `/about-us` e âncoras. Preservar a flag da home e seus dois caminhos.
8. Garantir que o Chatwoot existente não cubra ações relevantes no mobile, sem remover atendimento global.

## Critérios de aceite

- Sem rolagem horizontal involuntária em 360, 390, 768, 1024, 1440 e 1920 px.
- Nenhuma regra genérica da nova página altera product, cart ou seller.
- Texto e ações são utilizáveis com teclado e zoom; imagens não provocam saltos relevantes de layout.
- Uma única consulta de catálogo na rota; ilhas client restritas às interações.

## Validação e riscos

Capturas desktop/mobile e navegação manual com teclado. O mobile é adaptação, não layout fornecido pelo PSD. Não mascarar overflow com regra global nem esconder conteúdo para fazer o screenshot caber.

## Resultado

Revisão de integração feita por leitura estática de todo `src/app/about-us/` e `src/components/header/`, `next build` e `eslint`; **não** houve captura visual em navegador real nesta sessão (sem ambiente gráfico disponível) — recomendo uma passada manual em 360/390/768/1024/1440/1920 px antes de considerar a task 100% fechada visualmente.

- **Sequência confirmada** — `page.tsx`: `Header → AboutHero → AboutProducts → FeaturedProduct → AboutClosing`, na ordem exigida.
- **Tokens/hierarquia** — todos os componentes usam os tokens `--about-*` de `about_us.css`; um único `h1` no hero, `h2` em cada seção seguinte (produtos, destaque, fechamento) — hierarquia de headings coerente.
- **Ilha client restrita** — apenas `Header` e `FeaturedProduct` têm `'use client'`; `AboutHero`, `AboutProducts`, `ProductCard`, `ProductSelector` e `AboutClosing` permanecem server components.
- **Consulta única de catálogo** — confirmado: `getProducts()` é chamado uma única vez em `page.tsx` e a mesma seleção (`slice(0,4)`) alimenta `AboutProducts` e `FeaturedProduct`.
- **Sitemap/robots** — `/about-us` não estava no sitemap; adicionei uma entrada (`changeFrequency: 'monthly'`, `priority: 0.6`) em `src/app/sitemap.ts`. `robots.ts` já permite `/` por padrão e não deslista `/about-us`.
- **Imagens remotas no catálogo** — confirmada a política atual: não há `images.remotePatterns`/`domains` configurados em `next.config.ts`, por isso `product_card`/`product_selector`/`featured_product` usam `<img>` puro para fotos vindas da API, replicando o padrão já usado em `products_showcase.tsx` da landing (não introduzi uso de `next/image` para essas fotos).
- **Foco visível** — adicionado `.about-us :focus-visible { outline: 3px solid var(--about-color-accent); outline-offset: 3px }` em `about_us.css`, no mesmo padrão já usado no header, garantindo indicador de foco consistente em todos os links/botões da rota (antes dependia só do outline padrão do navegador).
- **Área de toque do header (pendência herdada da TASK-02)** — corrigido: `header_social.css` tinha um ícone social com `2.25rem` (36 px) de largura em telas ≤599 px, abaixo do mínimo de 44×44 px. Ajustado para `2.75rem` (44 px), fechando a pendência registrada na revisão da TASK-02.
- **Sem regra genérica vazando** — todo CSS novo está escopado sob `.about-hero`, `.about-products`, `.featured-product`, `.about-closing`, `.product-selector`, `.about-product-card` ou dentro de `.about-us`; nada foi adicionado em `globals.css` além do já existente. `product`, `cart` e `seller` não foram tocados nesta task.
- **Chatwoot** — o widget é global (`layout.tsx`) e renderiza como bolha flutuante; `/about-us` não tem nenhum elemento fixo/sticky no rodapé (as ações de `FeaturedProduct` ficam no fluxo normal da página, não fixadas), então não há sobreposição estrutural esperada — mas isso não foi validado visualmente em viewport real.
- **Overflow horizontal** — todas as grids novas usam `minmax(0, 1fr)` e larguras relativas dentro de `.about-us__content` (que já respeita `min(100% - 2*gutter, content-width)`); nenhum elemento novo usa largura fixa em px maior que os breakpoints móveis. Revisão estática não encontrou candidato a overflow, mas, como não houve teste em viewport real, isso permanece uma verificação recomendada, não uma garantia.

### Pendências que seguem de tasks anteriores (não deste passo)

Os dois recortes do hero (`about_hero_chair.png`/`about_hero_person.png`, TASK-01/03) e a validação visual do alt de `pessoas_zr0.svg` (TASK-06) continuam pendentes — a integração não os resolve, apenas os herda.
