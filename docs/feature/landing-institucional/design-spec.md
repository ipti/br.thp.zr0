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
- **Tipografia**: títulos grandes em `'Libre Baskerville', serif` (bold); corpo de texto em
  `'Poppins Regular', sans-serif`. Ambas já declaradas via `@font-face` em `globals.css`.
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
- **Caixa alta** no print. Fonte serifada bold, cor quase preta.
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

- Fundo branco, coluna única (sem eyebrow, sem imagem).
- Título serifado bold ("Um novo jeito de enxergar os resíduos"), caixa alta via
  `text-transform: uppercase` em `manifesto.css`.
- Corpo: parágrafo introdutório + 4 linhas "Valor para..." + 2 parágrafos de fechamento sobre a
  origem da ZR0 — sem marcadores/bullets, cada linha é um `<p>` próprio.
- Nota: o próprio print tem um provável erro de digitação no título ("RESÍSUOS" em vez de
  "RESÍDUOS") — o texto implementado já usa a grafia correta.

---

## 3. Oficina de Transformação — pendente

**Status:** ⚪ Placeholder (`<section><h2>Oficina de Transformação</h2></section>`).

Observações preliminares do print, a confirmar quando esta seção for medida de verdade:

- Eyebrow pequeno em caps ("OFICINA DE TRANSFORMAÇÃO") acima do título — padrão que Hero/
  Manifesto não usam.
- Título grande em 2 linhas: "ONDE OS RESÍDUOS GANHAM UM NOVO DESTINO. E AS PESSOAS TAMBÉM."
- Faixa horizontal de ~5 fotos documentais (pessoas/processo/materiais) — fotos retangulares
  comuns, não recortes com fundo transparente como as do Hero.
- Bloco de texto corrido abaixo da faixa de fotos, coluna única, mesmo tratamento do Manifesto.
- Fundo branco.

---

## 4. Como Funciona — pendente

**Status:** ⚪ Placeholder.

- Título + subtítulo.
- Grid 2×3 de 6 itens (Coleta, Capacitação, Produção / Design, Comercialização, Escala), cada um
  com ícone circular de linha + título + descrição curta — precisa de ícones SVG próprios (linha
  fina, dentro de um círculo), nenhum existe hoje no projeto.
- Fundo branco.

---

## 5. Onde Estamos — pendente

**Status:** ⚪ Placeholder. Seção mais complexa das que faltam.

- **Única seção com inversão de cor**: fundo verde escuro, texto branco.
- Título + parágrafos sobre a origem em Pedra Furada / Santa Luzia do Itanhy (SE).
- Linha de 4 números de impacto (toneladas processadas, cooperativas criadas, artesãs formadas —
  os dois últimos rótulos aparecem iguais no print, "ARTESÃS FORMADAS" duas vezes; possível erro
  do mockup, confirmar copy real antes de implementar).
- **Mapa do Brasil ilustrado** com estados destacados em laranja (Maranhão, Ceará, Rio Grande do
  Norte, Sergipe, Bahia) contra o restante em verde — não existe asset de mapa nem SVG no projeto
  hoje; vai precisar ser criado ou obtido do zero.

---

## 6. Produtos — pendente

**Status:** ⚪ Placeholder.

- Título + parágrafo (mesmo tratamento textual das demais seções).
- Grid de 4 cards de produto (foto quadrada + nome + preço).
- Link "VER TODOS →" alinhado à direita — CTA secundário (link, não botão preenchido).
- Fundo branco.

---

## 7. Fechamento (Closing Statement) — pendente

**Status:** ⚪ Placeholder.

- Texto de posicionamento de marca ao lado de uma foto de grupo/comunidade (diferente das fotos-
  produto usadas nas demais seções).
- Logo + tagline "Do descarte à permanência." — possivelmente já é o topo do `Footer` reaproveitado,
  não uma seção própria; o corte do print não deixa claro o limite entre os dois. A confirmar
  quando esta seção for trabalhada.
