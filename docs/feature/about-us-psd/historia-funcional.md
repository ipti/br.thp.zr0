# História funcional — Sobre nós conforme PSD

## Identificação

- **Código:** HF-ABOUT-PSD-001
- **Prioridade:** Alta
- **Status:** Planejada

## História

Como visitante, quero conhecer a proposta da ZR0, visualizar seus produtos e entender seu compromisso com as comunidades, com a apresentação visual do PSD e a mesma navegação das demais páginas públicas.

## Estrutura e comportamento

1. **Header geral:** Facebook e Instagram à esquerda, logo central, carrinho seguido de conta à direita. Abaixo, “COMPRE AGORA” e “CONHEÇA O PROJETO”, com indicadores de expansão.
2. **Hero:** cadeira à esquerda; título, subtítulo e descrição centralizados; pessoa à direita; textura clara ao fundo. Não adicionar CTA ao banner.
3. **Nossos produtos:** até quatro produtos reais, fotos arredondadas, nome à esquerda e preço à direita; “VER TODOS →” leva a `/product`. Cards levam a `/product/{uid}`.
4. **Produto em destaque:** primeiro produto da mesma seleção inicialmente ativo. Imagem grande à esquerda; nome, preço, descrição e dois botões à direita. Miniaturas abaixo selecionam produtos diferentes; a selecionada permanece visível com contorno.
5. **Ações:** “MAIS DETALHES” abre `/product/{uid}`. “ADICIONAR AO CARRINHO” adiciona uma unidade do produto selecionado usando o store existente e apresenta o feedback do sistema.
6. **Fechamento:** texto institucional e assinatura da marca à esquerda; foto original da comunidade à direita. Não transformar em nova campanha visual.

## Conteúdo institucional da referência

### Hero

**LIXO É UMA INVENÇÃO HUMANA**

**Não transformamos apenas resíduos. Transformamos comunidades.**

A ZR0 transforma o que antes seria descarte em produtos duráveis e de design com valor agregado, conectando economia circular, inclusão produtiva e desenvolvimento local.

### Fechamento

**Acreditamos que a sustentabilidade vai além da redução de impactos.**

É sobre criar sistemas capazes de regenerar comunidades, ampliar oportunidades e transformar resíduos em futuro.

**Do descarte à permanência.**

## Estados e exceções

- Catálogo vazio: mensagem discreta, sem preços fictícios ou painel de compra vazio.
- Menos de quatro produtos: renderizar somente os disponíveis.
- Foto ausente: placeholder com proporção reservada e descrição acessível.
- Estoque insuficiente, considerando unidades já no carrinho: impedir nova adição e explicar o estado. Estoque ausente não comprova disponibilidade; manter detalhes disponíveis e exigir a informação antes da compra direta.
- Produto que exige escolha de variante/opção: encaminhar para detalhes se a listagem não fornecer dados suficientes para compra direta.
- Preço ou nome longo: não sobrepor elementos; adaptar quebra de linha.
- Redes sociais: usar URLs oficiais verificadas. O footer atual contém `#`, que não é destino válido; os endereços precisam ser definidos para concluir o header.

## Navegação proposta para menus

- “COMPRE AGORA”: “Todos os produtos” → `/product`.
- “CONHEÇA O PROJETO”: “Sobre nós” → `/about-us`; “Nosso compromisso” → `/about-us#sustentability`.
- Preservar os links existentes `/about-us#history` e `/about-us#sustentability`: `history` identifica o início do conteúdo institucional no hero, e `sustentability` o fechamento. São âncoras técnicas compatíveis, sem novas seções ou fatos históricos inventados.
- Dropdowns abrem por clique/teclado e fecham por Escape, clique externo ou navegação. Hover não pode ser o único acesso.

## Aceite geral

- Desktop conserva ordem, imagens, textos institucionais, cores e proporções da referência.
- Header aparece uma única vez em cada rota e mantém conta, login e carrinho funcionais.
- Em 360 px, todo texto e ação continuam legíveis e acessíveis sem rolagem horizontal da página.
- Teclado alcança menus, cards, miniaturas e ações com foco visível.
