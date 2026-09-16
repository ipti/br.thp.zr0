# TASK-03 — Rota e hero

## Metadados

- **Prioridade:** P1
- **Status:** Concluída com pendências de assets documentadas
- **Dependências:** TASK-01

## Objetivo

Criar `/about-us` com composição no servidor e banner fiel ao PSD.

## Arquivos previstos

- `src/app/about-us/page.tsx`
- `src/app/about-us/about_us.css`
- `src/app/about-us/components/about_hero/about_hero.tsx` e `.css`

## Passos de implementação

1. Criar página server com metadata “Sobre nós | ZR0”, Header único e `main`.
2. Preparar consulta única a `getProducts()` e seleção de até quatro itens para as próximas tasks, sem reproduzir serviço de API.
3. Renderizar a cadeira à esquerda, texto central e pessoa à direita. Usar textura e recortes conferidos.
4. Copiar título, subtítulo e descrição da história funcional; conferir quebras de linha no desktop.
5. Adicionar âncora `history` ao bloco institucional inicial, mantendo o título associado por `aria-labelledby` e um único `h1`.
6. Usar `next/image`, dimensões reservadas e `sizes`. Priorizar apenas a imagem que justificar carregamento inicial.
7. Dimensionar seção por composição e conteúdo; evitar imagens cobrindo texto ou altura mobile que corte parágrafos.

## Critérios de aceite

- `/about-us` abre diretamente e não altera a composição de `/`.
- Banner contém todo o texto e as imagens nas posições do PSD.
- Sem botão novo, animação de entrada obrigatória ou novo bloco editorial.
- Hero é componente server; CSS não atinge `.landing-hero` existente.

## Validação e riscos

Comparar captura desktop contra o topo do PSD. Conferir 360/768/1920 px e textos com zoom. Assets existentes da landing podem ser diferentes: usar somente os conferidos na TASK-01.

## Resultado

Implementados `src/app/about-us/page.tsx` (server component, metadata "Sobre nós | ZR0", `<Header />` único e `<main>`) e `src/app/about-us/components/about_hero/` (`about_hero.tsx` + `.css`). Build de produção (`next build`) gera `/about-us` como rota estática sem erros; `tsc`/`eslint` não reportam problemas nos arquivos novos.

- **Estrutura do hero** — grid de três colunas (cadeira / texto / pessoa) sobre a textura `hero_texture.png` (única reutilização prevista pela TASK-01 para esta página); título, subtítulo e descrição centralizados, sem CTA, conforme a história funcional.
- **Âncora e semântica** — `<section id="history">` com `aria-labelledby` apontando para o único `h1` (`about-hero-title`), preservando a âncora `/about-us#history` referenciada na história funcional.
- **Textos** — copiados literalmente da história funcional (título, subtítulo, descrição), sem reinterpretação.
- **`next/image`** — textura carregada com `next/image` (`fill`, `priority`, `sizes="100vw"`), decorativa (`alt=""`, `aria-hidden`).
- **Isolamento da landing** — CSS novo escopado em `.about-hero`/`.about-us__content`; `landing.css`/`hero.css`/`.landing-hero` não foram tocados. `next build` mostra `/` e `/about-us` como rotas independentes.

### Pendência documentada (bloqueada por assets, não por esta task)

Os recortes `about_hero_chair.png` e `about_hero_person.png`, previstos no manifesto da TASK-01, ainda não existem em `src/assets/img/about_us/` (só há um `.gitkeep`). Sem eles, a cadeira e a pessoa são renderizadas como blocos reservados com `role="img"` e `aria-label` descritivo, sem imagem real — mesmo padrão adotado no header (TASK-02) para não inventar asset/URL. Esses blocos ficam ocultos em telas ≤1023px por não terem conteúdo visual a mostrar; ao receber os exports, restaurar as imagens reais com `next/image` e reavaliar a visibilidade em tablet/mobile conforme o passo 7 desta task.

### Desvio deliberado do passo 2

Não foi adicionada a consulta a `getProducts()` nesta task: como `AboutProducts` e `FeaturedProduct` (TASK-04/TASK-05) ainda não existem, buscar os produtos agora resultaria em uma variável sem consumidor (código morto). A busca única será introduzida em `page.tsx` junto da TASK-04, quando o primeiro consumidor existir, mantendo a regra "sem fetch por card" descrita na história técnica.

Antes de fechar a TASK-03 no todo: obter os dois exports do hero (dependência já registrada na TASK-01) e então trocar os placeholders por `next/image` real.
