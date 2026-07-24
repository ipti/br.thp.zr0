# História técnica — Modernização da Home

## Identificação

- **Código:** HT-HOME-001
- **Título:** Reestruturar layout, responsividade e desempenho da Home
- **Relacionada a:** HF-HOME-001
- **Prioridade:** Alta

## Objetivo técnico

Refatorar a apresentação da Home para utilizar um sistema consistente de containers, espaçamentos e breakpoints, eliminando alturas rígidas e sobreposições dependentes de viewport. A mudança deve preservar o comportamento atual de navegação, produtos, conta e carrinho.

## Diagnóstico atual

### Estrutura global

- `src/app/components/home.css` aplica `height: 100vh` a diferentes seções.
- `src/app/globals.css` contém tokens tipográficos malformados e seletores sem prefixo de classe.
- `html` e `body` utilizam altura fixa, fazendo o `body` atuar como container de rolagem.
- Não existe um container compartilhado entre header, seções e footer.

### Header e hero

- O header utiliza largura máxima diferente do restante da Home.
- O logo centralizado de forma absoluta pode competir com as ações laterais.
- O hero usa um Splitter interativo em qualquer resolução.
- Logo, título e CTA utilizam dimensões pouco adaptáveis.
- A imagem principal possui alto peso e influencia diretamente o LCP.

### Conteúdo institucional

- A seção Sobre usa margens fixas de `5rem`.
- O vídeo usa `margin-top` e `margin-bottom` negativos em `vh`.
- O Impacto depende da altura fixa e do posicionamento do vídeo.

### Produto

- O grid usa `0.5fr 0.1fr`, deixando parte da largura não utilizada.
- A imagem principal tem altura fixa.
- As miniaturas não possuem layout eficiente no mobile.
- A lógica do CTA mobile remove o texto e mostra um ícone de carrinho incompatível com a ação.
- Imagens do showcase usam `img` sem otimizações do Next.

### Footer e elementos flutuantes

- Footer e conteúdo principal utilizam larguras máximas diferentes.
- O logo do footer é renderizado em dimensão muito pequena.
- O widget do Chatwoot pode cobrir conteúdo em telas pequenas.

## Decisões técnicas propostas

### DT-01 — Container compartilhado

Criar uma classe reutilizável para a Home:

```css
.home-content {
  width: min(100% - (2 * var(--home-gutter)), var(--home-max-width));
  margin-inline: auto;
}
```

Tokens propostos:

```css
--home-max-width: 1200px;
--home-gutter: clamp(1rem, 4vw, 5rem);
--home-section-space: clamp(3.5rem, 8vw, 7rem);
```

### DT-02 — Altura baseada em conteúdo

- Reservar altura de viewport apenas para o hero.
- Usar `min-height: calc(100svh - var(--header-height))` no hero.
- Usar altura automática e padding vertical nas demais seções.
- Evitar `100vh` por causa das barras dinâmicas de navegadores mobile.

### DT-03 — Breakpoints

- **Mobile:** até 599 px.
- **Tablet:** 600 a 1023 px.
- **Desktop:** a partir de 1024 px.
- Breakpoints adicionais somente quando o conteúdo exigir, não por dispositivo específico.

### DT-04 — Hero adaptativo

- Preservar Splitter no desktop.
- No mobile, desabilitar redimensionamento ou substituir por composição estática.
- Dimensionar logo e títulos com `clamp()`.
- Limitar largura do conteúdo e CTA.
- Adicionar camada de contraste sem esconder a textura do material reciclado.

### DT-05 — Sobreposição controlada do vídeo

- Eliminar margens negativas em `vh`.
- Quando a sobreposição for mantida, usar deslocamento máximo em pixels responsivos.
- Reservar espaço no fluxo para que o vídeo não cubra conteúdo.
- Usar `aspect-ratio: 16 / 9` e largura limitada pelo container.

### DT-06 — Showcase de produto

Desktop:

```css
grid-template-columns: minmax(0, 1fr) 160px;
```

Mobile:

- Uma coluna para imagem e detalhes.
- Miniaturas em trilho horizontal com `overflow-x: auto`.
- Miniaturas entre 88 e 104 px.
- CTA com texto “Ver detalhes”.

### DT-07 — Imagens e vídeo

- Utilizar `next/image` nas imagens controladas pela aplicação.
- Informar `sizes` e dimensões previsíveis.
- Converter ou disponibilizar hero otimizado em WebP/AVIF.
- Definir `priority` somente para a imagem LCP.
- Alterar vídeo para `preload="metadata"` e adicionar poster.

### DT-08 — Acessibilidade

- Controles por ícone devem ter `aria-label`.
- O botão do vídeo deve informar reproduzir ou pausar.
- Foco deve permanecer visível.
- Respeitar `prefers-reduced-motion`.
- Áreas de toque devem ter pelo menos 44 × 44 px.
- Imagens decorativas devem ter `alt=""`; imagens informativas devem possuir descrição.

### DT-09 — Widget flutuante

- Reservar área segura inferior e lateral em mobile.
- Validar CTA, preço, miniaturas e links do footer com o widget aberto.
- Evitar depender de seletores internos instáveis do Chatwoot quando o ajuste puder ser feito no layout da página.

## Arquivos previstos

| Área | Arquivos principais |
|---|---|
| Global | `src/app/globals.css`, `src/app/components/home.css` |
| Home | `src/app/page.tsx` |
| Header | `src/components/header/header.tsx`, `src/components/header/header.css` |
| Hero | `src/app/components/splitter_home/splitter_home.tsx`, `splitter_home.css` |
| Sobre | `src/app/components/about/about.tsx`, `about.css` |
| Vídeo | `src/app/components/video/video.tsx`, `video.css` |
| Impacto | `src/app/components/impact/impact.tsx`, `impact.css` |
| Produto | `src/app/components/product/product.tsx`, `product.css` |
| Detalhes | `src/app/components/product/details_product/details_product.tsx`, `details_product.css` |
| Footer | `src/app/components/footer/footer.tsx`, `footer.css` |
| Chat | `src/app/layout.tsx` e estilos da Home, se necessário |

## Restrições

- Não alterar contratos da API.
- Não alterar estado ou persistência do carrinho.
- Não remover o Splitter do desktop sem validação de produto/design.
- Não adicionar nova biblioteca de UI apenas para layout.
- Não criar breakpoints baseados em modelos específicos de aparelho.
- Não ocultar conteúdo para resolver problemas de espaço.

## Critérios técnicos de aceite

1. Não existe rolagem horizontal nas resoluções suportadas.
2. Nenhuma seção de conteúdo depende de `height: 100vh`.
3. O vídeo não utiliza margens negativas proporcionais à altura da viewport.
4. Header, seções e footer usam o mesmo container ou a mesma referência de alinhamento.
5. O showcase utiliza toda a largura disponível.
6. O CTA “Ver detalhes” permanece textual em mobile.
7. O layout funciona com conteúdo maior que o atual.
8. Não existem novos erros de ESLint nos arquivos alterados.
9. O build não introduz erro relacionado à feature.
10. O LCP usa imagem otimizada e o CLS visual permanece abaixo de 0,1.
11. As ações principais são acessíveis por teclado.
12. Animações respeitam `prefers-reduced-motion`.

## Estratégia de validação

### Validação visual

- 1440 × 1000.
- 1024 × 768.
- 768 × 1024.
- 390 × 844.
- 360 × 800.

### Estados

- Carrinho vazio e com itens.
- Visitante autenticado e não autenticado.
- Produto com e sem avaliações.
- Produto com descrição curta e longa.
- Widget do Chatwoot aberto e fechado.
- Vídeo carregado, indisponível e pausado.

### Qualidade

- ESLint nos arquivos alterados.
- Build do Next.js.
- Lighthouse em mobile e desktop.
- Navegação somente por teclado.
- Zoom do navegador em 200%.
- Preferência de movimento reduzido.

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Mudança do hero descaracterizar a marca | Preservar imagens, cores e composição do desktop; simplificar apenas onde necessário |
| Sobreposição do vídeo variar entre telas | Manter espaço reservado no fluxo e limitar deslocamento |
| CSS global afetar outras rotas | Restringir tokens e classes à Home; validar `/product`, `/cart` e `/auth/login` |
| Imagem remota quebrar otimização | Configurar domínio ou manter fallback controlado |
| Chat continuar cobrindo conteúdo | Testar widget real e reservar safe area no layout |
| Conteúdo dinâmico alterar alturas | Usar layout baseado em conteúdo e `minmax()` |

## Estratégia de entrega

1. Implementar fundação sem alterar visual de forma significativa.
2. Entregar blocos independentes da Home.
3. Validar cada bloco em desktop e mobile.
4. Aplicar otimizações e acessibilidade após estabilizar o layout.
5. Executar regressão final antes da publicação.

