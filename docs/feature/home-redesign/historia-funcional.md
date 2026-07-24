# História funcional — Modernização da Home

## Identificação

- **Código:** HF-HOME-001
- **Título:** Melhorar a experiência visual e responsiva da Home
- **Prioridade:** Alta
- **Rota afetada:** `/`

## Contexto

A Home apresenta a proposta de valor da ZR0, conduz o visitante ao catálogo e destaca o impacto sustentável e os produtos da marca. Atualmente, a experiência varia muito entre desktop e mobile: alguns elementos ficam grandes ou estreitos demais, existem espaços verticais excessivos, o showcase de produto perde alinhamento e determinados controles podem ser encobertos pelo widget de atendimento.

## História de usuário

**Como** visitante da loja ZR0,  
**quero** navegar por uma Home clara, alinhada e adaptada ao tamanho da minha tela,  
**para** compreender a proposta da marca, conhecer seu impacto e acessar os produtos sem dificuldade.

## Objetivos funcionais

1. Comunicar a proposta da ZR0 imediatamente no hero.
2. Garantir leitura confortável em telas grandes e pequenas.
3. Conduzir o visitante ao catálogo por CTAs claros.
4. Apresentar o impacto social e ambiental sem excesso de rolagem.
5. Exibir um produto em destaque com informações e ações compreensíveis.
6. Manter o footer e o atendimento acessíveis sem cobrir conteúdo.

## Perfis impactados

### Visitante não autenticado

- Conhece a marca.
- Navega para o catálogo.
- Abre detalhes de um produto.
- Acessa informações institucionais.

### Cliente autenticado

- Executa o mesmo fluxo do visitante.
- Acessa conta e carrinho pelo header.
- Visualiza corretamente a quantidade de itens no carrinho.

## Requisitos funcionais

### RF-01 — Header responsivo

- O header deve manter Produtos, logo, conta e carrinho organizados.
- O logo deve permanecer visualmente centralizado sem colidir com as ações laterais.
- Ações por ícone devem ter área de toque adequada e descrição acessível.
- Em telas pequenas, informações secundárias podem ser reduzidas, mas as ações principais devem permanecer identificáveis.

### RF-02 — Hero responsivo

- O hero deve exibir logo, mensagem principal e CTA sem cortes.
- O CTA “Conheça nossos produtos” deve permanecer totalmente visível.
- O comparador visual pode permanecer interativo no desktop.
- No mobile, o comparador deve ser simplificado para não comprometer texto e CTA.
- A imagem de fundo deve manter contraste suficiente com o conteúdo.

### RF-03 — Seção Sobre

- Título, textos e CTA devem ser apresentados em duas colunas no desktop.
- Em telas menores, o conteúdo deve ser empilhado em uma única coluna.
- O texto deve ter largura confortável para leitura.
- A seção deve crescer conforme o conteúdo, sem depender de altura fixa.

### RF-04 — Vídeo institucional

- O vídeo deve manter proporção adequada.
- O controle de reproduzir/pausar deve ser identificável e operável.
- O vídeo não deve encobrir textos ou métricas.
- A transição visual entre Sobre, vídeo e Impacto deve permanecer intencional em todas as resoluções.

### RF-05 — Indicadores de impacto

- Os quatro indicadores devem ter a mesma importância visual.
- No desktop, devem ser exibidos em uma linha.
- Em tablets e celulares, devem ser distribuídos em uma grade compacta.
- Números e rótulos devem permanecer legíveis.

### RF-06 — Produto em destaque

- A seção deve exibir título, descrição, imagem principal, miniaturas e detalhes do produto.
- A imagem principal e os detalhes devem ocupar a largura disponível de forma equilibrada.
- A seleção de uma miniatura deve atualizar claramente o produto em destaque.
- No mobile, as miniaturas devem ser exibidas horizontalmente ou em grade compacta.
- O CTA deve exibir o texto “Ver detalhes” também no mobile.
- O usuário deve conseguir acessar a lista completa de produtos.

### RF-07 — Footer

- O footer deve utilizar o mesmo alinhamento horizontal do conteúdo principal.
- Marca, links e redes sociais devem ter hierarquia visual clara.
- Links indisponíveis não devem aparentar uma navegação funcional.
- O logo deve ser reconhecível em desktop e mobile.

### RF-08 — Convivência com atendimento flutuante

- O widget de atendimento não deve cobrir preço, CTAs, paginação ou links importantes.
- Deve existir espaçamento de segurança no canto inferior direito em telas pequenas.

### RF-09 — Responsividade geral

- A Home não deve apresentar rolagem horizontal em larguras a partir de 360 px.
- Elementos não devem ficar cortados, sobrepostos ou ilegíveis.
- O fluxo de leitura deve ser preservado com zoom de até 200%.

## Regras de negócio

- O CTA principal do hero direciona para `/product`.
- “Saiba mais” direciona para `/about-us`.
- “Ver detalhes” direciona para `/product/{uid}`.
- “Ver todos os produtos” direciona para `/product`.
- Os produtos continuam sendo obtidos pelo fluxo atual, sem mudança de API.
- Conta e carrinho continuam respeitando autenticação e estado atuais.

## Critérios de aceite

### Cenário 1 — Hero em desktop

**Dado** que o visitante acessa a Home em uma tela de 1440 px,  
**quando** o hero é exibido,  
**então** logo, mensagem e CTA devem estar centralizados e legíveis,  
**e** o comparador não deve interferir nas ações do header.

### Cenário 2 — Hero em mobile

**Dado** que o visitante acessa a Home em uma tela de 390 px,  
**quando** o hero é exibido,  
**então** nenhum texto ou botão deve ultrapassar as bordas,  
**e** o CTA deve permanecer totalmente visível.

### Cenário 3 — Leitura da seção Sobre

**Dado** um dispositivo com largura entre 360 px e 767 px,  
**quando** o visitante chega à seção Sobre,  
**então** o conteúdo deve aparecer em uma coluna,  
**e** não deve ser comprimido por margens laterais fixas.

### Cenário 4 — Transição para Impacto

**Dado** qualquer resolução suportada,  
**quando** o visitante percorre Sobre, vídeo e Impacto,  
**então** não deve existir sobreposição acidental ou espaço vazio excessivo.

### Cenário 5 — Produto em destaque no mobile

**Dado** um dispositivo móvel,  
**quando** o visitante chega ao produto em destaque,  
**então** imagem, preço, descrição e CTA devem ocupar a largura disponível,  
**e** as miniaturas não devem formar uma coluna estreita com espaço vazio lateral.

### Cenário 6 — Ações do produto

**Dado** que existe um produto em destaque,  
**quando** o visitante seleciona “Ver detalhes”,  
**então** deve ser direcionado para a página do produto correspondente.

### Cenário 7 — Atendimento flutuante

**Dado** que o widget de atendimento está visível,  
**quando** o visitante navega pelo produto e pelo footer,  
**então** o widget não deve impedir a leitura ou o acionamento de controles.

## Definição funcional de pronto

- Todos os requisitos funcionais foram implementados.
- Critérios de aceite foram verificados em desktop, tablet e mobile.
- Não existe rolagem horizontal em 360, 390, 768, 1024 e 1440 px.
- Todos os CTAs possuem texto, destino e estado de foco corretos.
- O fluxo atual de conta, carrinho e produtos continua funcionando.
- Evidências visuais antes/depois foram registradas.

