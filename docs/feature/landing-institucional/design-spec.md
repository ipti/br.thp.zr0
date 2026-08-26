# Especificação de design — Nova landing institucional

## Como usar este documento

Documento vivo, atualizado seção por seção conforme cada componente é medido/construído.
Posições e proporções são **estimativas por inspeção visual** do print de referência (não há
arquivo de design/Figma disponível) — onde a confiança é baixa, isso é marcado explicitamente.
Sempre que a implementação divergir do print, a divergência é listada em "Gaps" na seção
correspondente, em vez de silenciosamente considerada correta.

Rota afetada: `/`, atrás da flag `NEW_LANDING_PAGE_ENABLED` (`src/app/page.tsx`). Distinto do
`docs/feature/home-redesign/`, que trata da home **atual** (`SplitterHome` e afins) — não da
landing nova.

## Convenções compartilhadas (já implementadas)

- **Tokens de layout** (`src/app/globals.css`): `--home-max-width: 1200px`, `--home-gutter:
  clamp(1rem, 4vw, 5rem)`, `--home-section-space: clamp(3.5rem, 8vw, 7rem)`, `--header-height:
  75px` (medido via `getBoundingClientRect`, não deduzível só pelo CSS do header).
- **Container compartilhado** (`src/app/components/landing/landing.css`): `.landing-content`
  (largura máx. 1200px, centralizado) e `.landing-section` (padding vertical +
  `scroll-margin-top` para não ficar atrás do header sticky em navegação por âncora).
- **Cores das manchas decorativas**: `--landing-blob-green: #8b9a72`, `--landing-blob-tan:
  #d9c9a8` (também em `landing.css`).
- **Tipografia**: títulos das seções em `'Libre Baskerville', serif` (bold); título do Hero em
  `'Hurme Geometric Sans 1', sans-serif` (bold); corpo de texto em `'Poppins Regular',
  sans-serif`. Todas declaradas via `@font-face` em `globals.css`.
- **Estrutura de pasta**: uma pasta por componente em `src/app/components/landing/<nome>/`, com
  `<nome>.tsx` + `<nome>.css` (import direto, sem CSS modules), seguindo o padrão do resto do
  projeto.

---

## 1. Hero — `src/app/components/landing/hero/`

**Status:** 🟢 Implementado e alinhado ao print (ver histórico de gaps corrigidos abaixo).

### Composição geral

Faixa horizontal compacta logo abaixo do header — **não** ocupa a viewport inteira (diferente do
hero antigo `SplitterHome`, que usa `100vh`). Três blocos dispostos lado a lado e centralizados
como um grupo único: **[foto da pessoa] — [título] — [foto da mesa]**. Alinhamento vertical é
**pela base** (`align-items: flex-end`), não pelo centro — pessoa e texto compartilham a mesma
linha de base, e a mesa (mais alta que os outros dois) sobe visivelmente acima do topo do título,
criando o efeito de colagem assimétrica visto no print. Nenhum CTA/botão dentro do Hero.

### Fundo

- Cor base sólida quente/creme, próxima de `#EDE7DA`–`#F0ECE0`.
- Textura granilite (fragmentos de pedra em cinza, branco, bege e preto) por cima, full-bleed —
  hoje é a imagem real `src/assets/img/home/hero/hero_texture.png`, aplicada via CSS
  `background-image` (decorativa, não é `next/image`).

### Formas decorativas (SVG)

- 1 mancha orgânica grande, verde-oliva (`--landing-blob-green`), posicionada atrás/acima da
  foto da pessoa (canto superior esquerdo da composição).
- 1 mancha menor, bege (`--landing-blob-tan`), atrás da base da foto da mesa (canto inferior
  direito).
- Ambas são formas livres tipo "blob", sem geometria definida, semi-opacas, **atrás** das fotos e
  do texto (z-index abaixo do conteúdo). Confiança média-baixa em relação a forma exata — o print
  não permite extrair o path exato, só a impressão geral (arredondada, orgânica, duas manchas
  assimétricas em cantos opostos).

### Texto

- Título único: "LIXO É UMA INVENÇÃO HUMANA", 2 linhas ("LIXO É UMA" / "INVENÇÃO HUMANA" no
  print).
- **Caixa alta** no print. Fonte geométrica sans-serif bold (`'Hurme Geometric Sans 1'`), cor
  quase preta, com entrelinha compacta.
- Sem eyebrow (rótulo pequeno acima do título), sem parágrafo de apoio, sem CTA — só o `<h1>`.

### Imagens

- **Foto da pessoa** (`hero_person.png`): mulher sentada + mesa de madeira que se estende para a
  direita dentro do mesmo arquivo, cortada na própria borda da imagem. PNG com fundo
  transparente (sem moldura retangular visível). Posição: canto inferior-esquerdo da composição.
- **Foto do produto** (`hero_product_table.png`): mesa redonda em padrão granilite, também PNG
  transparente sem moldura. Posição: lado direito, altura semelhante à da foto da pessoa.
- As duas imagens já existem em `src/assets/img/home/hero/` e estão corretamente referenciadas
  no componente atual.

### Gaps já corrigidos

1. **Caixa do título** — o código não tinha `text-transform: uppercase`; adicionado em
   `.landing-hero__title` (`hero.css`).
2. **Alinhamento vertical** — o grid usava `align-items: center`, forçando pessoa/texto/mesa no
   mesmo eixo central; trocado para `align-items: flex-end` (com override para `center` no
   breakpoint mobile/tablet empilhado), reproduzindo a mesa "subindo" acima do título como no
   print.
3. **Quebra de linha do título** — `max-width: 12ch` forçava 3 linhas ("LIXO É UMA" /
   "INVENÇÃO" / "HUMANA"); o print quebra em 2 ("LIXO É UMA" / "INVENÇÃO HUMANA"). Ajustado para
   `max-width: 17ch`, confirmado em 390px/768px/1356px/1920px sem voltar a quebrar em 3 linhas.

### Gaps ainda abertos

1. **Forma/posição exata das manchas**: tamanho, curvatura e posição das duas manchas SVG
   (`hero.tsx:11-24`) foram desenhadas à mão como aproximação; não validadas pixel a pixel contra
   este print.
2. **Header do print diverge do Header atual**: o print mostra um header de 2 linhas (ícones
   sociais + logo + conta/carrinho, depois uma segunda linha com dropdowns "COMPRE AGORA" /
   "CONHEÇA O PROJETO"); o `Header` reaproveitado (`src/components/header/header.tsx`) é de 1
   linha só. Não é um gap do Hero em si, mas afeta o espaço logo acima dele — registrado aqui
   para não se perder.

---

## 2. Manifesto — `src/app/components/landing/manifesto/`

**Status:** 🟢 Implementado, alinhado ao print.

- Fundo `#f8f8f8`, coluna única (sem eyebrow e sem imagem de conteúdo), com formas orgânicas
  decorativas parcialmente cortadas nas laterais.
- As formas decorativas usam o asset oficial `src/assets/img/home/pingos.svg`, com a paleta
  normalizada para o verde `#8b9a72` e o bege `#d9c9a8` já definidos na landing.
- Título geométrico sans-serif bold ("Um novo jeito de enxergar os resíduos."), caixa alta via
  `text-transform: uppercase` em `manifesto.css`.
- Corpo: parágrafo introdutório + 4 linhas "Valor para..." + 2 parágrafos de fechamento sobre a
  origem da ZR0 — sem marcadores/bullets, cada linha é um `<p>` próprio.
- Nota: o próprio print tem um provável erro de digitação no título ("RESÍSUOS" em vez de
  "RESÍDUOS") — o texto implementado já usa a grafia correta.

---

## 3. Oficina de Transformação

**Status:** 🟢 Implementado e alinhado à composição do print.

- Eyebrow pequeno em caps ("OFICINA DE TRANSFORMAÇÃO") acima do título — padrão que Hero/
  Manifesto não usam.
- Título geométrico grande em 3 linhas fixas: "ONDE OS RESÍDUOS" / "GANHAM UM NOVO DESTINO." /
  "E AS PESSOAS TAMBÉM."
- Faixa horizontal de ~5 fotos documentais (pessoas/processo/materiais) — fotos retangulares
  comuns, não recortes com fundo transparente como as do Hero.
- Sequência oficial da faixa: recorte lateral, lavagem dos resíduos, corte da placa, operação da
  máquina e recorte lateral. As imagens externas mantêm a largura estreita original; as três cenas
  centrais têm maior destaque.
- Bloco de texto corrido abaixo da faixa de fotos, coluna única, mesmo tratamento do Manifesto.
- Card central em cinza muito claro, com cantos arredondados, sobre fundo `#f8f8f8`, em
  continuidade com o Manifesto. A faixa de fotos
  extrapola horizontalmente o card e ocupa toda a largura da viewport.

---

## 4. Como Funciona

**Status:** 🟢 Implementado e alinhado à composição do print.

- Título "COMO FUNCIONA" + subtítulo "TUDO COMEÇA COM AQUILO QUE MUITOS DEIXAM PARA TRÁS.".
- Grid 3×2 de 6 etapas: Coleta, Capacitação, Produção / Design, Comercialização e Escala.
- Cada card usa fundo cinza muito claro, cantos arredondados, ícone linear verde, título em caixa
  alta e descrição centralizada.
- Fundo `#f8f8f8` em continuidade com as seções anteriores e coluna central responsiva; o grid
  passa para 2 colunas abaixo de 700px e para 1
  coluna abaixo de 400px.

### Gap de conteúdo ainda aberto

- Os SVGs proprietários do design oficial não estão disponíveis. A implementação usa equivalentes
  do `lucide-react` com traço fino e `aria-hidden`, prontos para substituição futura sem alterar a
  estrutura dos cards.

---

## 5. Onde Estamos

**Status:** 🟢 Implementado e alinhado à composição do print.

- Fundo verde-acinzentado claro com a textura granilite da landing sobreposta; título e texto em
  tons escuros. A descrição anterior de fundo verde escuro foi corrigida após comparação com o
  design oficial.
- Título + três parágrafos sobre a origem em Pedra Furada / Santa Luzia do Itanhy (SE).
- Título e texto compartilham o mesmo eixo esquerdo do Manifesto e da Oficina; métricas e mapa
  permanecem centralizados abaixo dessa coluna.
- Linha responsiva de 4 números de impacto: toneladas processadas, cooperativas criadas e dois
  indicadores de artesãs formadas, preservando temporariamente os placeholders do mockup.
- Mapa responsivo construído com a malha oficial das Unidades da Federação fornecida pela API do
  IBGE e armazenada localmente em `src/assets/img/home/brazil_presence_map.svg`.
- Maranhão, Ceará, Rio Grande do Norte, Bahia e Sergipe aparecem destacados em laranja; os demais
  estados permanecem verdes. O SVG é renderizado diretamente, sem legendas externas, camadas,
  perspectiva ou efeitos adicionais.

### Gaps de conteúdo ainda abertos

- Substituir `XXXX`, `XX`, `XXX` e `XXX` pelos indicadores reais.
- Confirmar se os dois últimos rótulos devem mesmo repetir "ARTESÃS FORMADAS", como aparece no
  mockup, ou se o quarto indicador terá outro nome.

---

## 6. Produtos — implementado

**Status:** 🟢 Implementado conforme o layout de referência.

- Chamada institucional em verde, seguida de dois parágrafos introdutórios.
- Grid com os 4 primeiros produtos retornados pela API (foto quadrada, nome e preço).
- Cards completos direcionam à página de detalhe de cada produto.
- Link "VER TODOS →" alinhado à direita e direcionado ao catálogo.
- Fundo branco com formas orgânicas decorativas nas bordas.
- Em telas menores que 600 px, o catálogo passa de 4 para 2 colunas.

---

## 7. Fechamento (Closing Statement) — implementado

**Status:** 🟢 Implementado conforme a composição final do layout de referência.

- Texto de posicionamento da marca à esquerda e imagem comunitária à direita.
- Assinatura com logotipo ZR0 e tagline "Do descarte à permanência.".
- Fundo branco e largura central alinhada às demais seções da landing.
- Em telas menores que 700 px, conteúdo e imagem passam a ocupar uma única coluna.

### Gap de conteúdo ainda aberto

- A foto exata do grupo adulto exibida no design oficial não está disponível no repositório. A
  implementação reutiliza temporariamente `src/assets/img/about.png`, preservando o tema
  comunitário e o recorte orgânico da referência.
