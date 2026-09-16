# História técnica — arquitetura da tela

## Identificação

- **Código:** HT-ABOUT-PSD-001
- **Relacionada a:** HF-ABOUT-PSD-001
- **Status:** Planejada

## Padrão observado no código

- Next.js 15 App Router, React 18, TypeScript com `strict` e alias `@/` para `src/`.
- Componentes funcionais, nomes de pastas/arquivos em minúsculas e underscore; CSS importado ao lado do TSX. Novos arquivos seguem aspas simples, sem ponto e vírgula, conforme componentes da landing.
- `next/image` para assets locais e `next/link` para navegação interna.
- `ZButton` encapsula PrimeReact; conta usa `LoginModal`, `MenuUser` e `react-tiny-popover`.
- `getProducts()` em `src/app/middleware/producs_list.ts` resolve `ProductList` no servidor e retorna lista vazia em falhas.
- `useCartStore` em `src/service/store/cart_store.tsx` centraliza carrinho, persistência e sincronização. `useToast` entrega feedback.
- Não copiar os wrappers `home.css` com regras legadas para a nova rota.

## Diagnóstico relevante

- `/about-us` ainda não tem página, apesar dos links em About e Footer.
- `src/app/page.tsx` possui duas versões controladas por `NEW_LANDING_PAGE_ENABLED`.
- O Hero atual só apresenta título, posiciona a pessoa à esquerda e utiliza mesa; portanto não corresponde ao hero completo deste PSD.
- `ProductsShowcase` acrescenta introdução que não aparece no PSD.
- `Product` antigo remove a miniatura ativa. `DetailsProduct` mostra avaliações, favoritos e ações diferentes; `home` navega para detalhes em vez de adicionar diretamente. Não reutilizar esses componentes inteiros para forçar esta apresentação.
- `ClosingStatement` tem texto e imagem que precisam ser comparados com os originais antes de reutilização.
- O header é importado na home e nos layouts de product, cart, profile, order, payment e production-order. O seller possui `HeaderSeller` próprio.
- Tokens atuais: `--home-max-width: 1200px` e `--header-height: 75px`. A altura do novo header exige revisar consumidores; o comentário sobre medição não corresponde a uma medição implementada no header lido.

## Árvore de componentes proposta

```text
src/components/header/
  header.tsx + header.css                 # editar o Header compartilhado
  header_navigation/
    header_navigation.tsx + header_navigation.css
  header_social/
    header_social.tsx + header_social.css
  menu_user/ e login/                     # manter integrações existentes

src/app/about-us/
  page.tsx                               # servidor: metadata, fetch e composição
  about_us.css                           # tokens e container locais da página
  components/
    about_hero/about_hero.tsx + about_hero.css
    about_products/about_products.tsx + about_products.css
    product_card/product_card.tsx + product_card.css
    featured_product/featured_product.tsx + featured_product.css
    product_selector/product_selector.tsx + product_selector.css
    about_closing/about_closing.tsx + about_closing.css

src/assets/img/about_us/                  # exports conferidos do PSD
```

Separar os componentes da nova rota evita modificar as duas versões atuais da home. Reutilizar assets que sejam comprovadamente os mesmos, os tipos e integrações; não duplicar serviços. Sem criar componente genérico para cada texto ou forma decorativa.

## Composição e contratos

```text
AboutUsPage [server]
├── Header [client, global]
│   ├── HeaderSocial
│   ├── logo
│   ├── carrinho + conta (store / Popover / LoginModal)
│   └── HeaderNavigation
└── main.about-us
    ├── AboutHero [server]
    ├── AboutProducts [server; products: ProductList]
    │   └── ProductCard × até 4 [server; product: ProductType]
    ├── FeaturedProduct [client; products: ProductList]
    │   └── ProductSelector [products, selectedUid, onSelect(uid)]
    └── AboutClosing [server]
```

`page.tsx` consulta `getProducts()` uma vez, obtém `products.slice(0, 4)` e passa a mesma seleção às duas áreas. Sem fetch por card. Usar UID como chave/seleção e resolver o produto a partir da lista; retornar ao primeiro disponível se a seleção deixar de existir. Estado de seleção pertence somente a `FeaturedProduct`.

`ProductSelector` usa botões com `aria-pressed`, imagens e nome acessível. Não é galeria de fotos do mesmo produto e não precisa do padrão ARIA de tabs.

Adicionar uma unidade com o contrato existente `{ id: product.uid, name, price, quantity: 1, image }`. Antes disso, verificar disponibilidade e quantidade no carrinho. Não criar outro localStorage, chamada direta de compra ou store. `addItem` não retorna confirmação de sincronização remota: não apresentar o toast como confirmação de estoque/servidor.

## Header compartilhado

Modificar o componente atual mantém todos os consumidores padronizados. Não movê-lo para `src/app/layout.tsx`, pois isso duplicaria headers e afetaria autenticação/seller. A nova rota renderiza `<Header />` uma vez.

Layout desktop em duas linhas: grid `1fr auto 1fr` com redes, marca e ações; segunda linha com os dois menus centralizados. Branco sólido, ícones pretos, sem o botão preto “Produtos”, sombra ou blur ausentes no PSD. Manter navegação também em `/product`, revisando `isProductPage`.

O PSD não define rolagem: conservar o comportamento sticky existente, verificar altura real por breakpoint e atualizar os offsets que a consomem. Não aplicar arbitrariamente 350 px de altura a todas as larguras.

## Medidas de partida, a conferir na TASK-01

As medidas abaixo são estimativas da imagem composta, não propriedades extraídas das camadas:

| Área | Referência em 1920 px |
| --- | --- |
| Conteúdo central | aproximadamente 1440 px, margens de 240 px |
| Cabeçalho | aproximadamente 350 px de altura |
| Hero | aproximadamente 680 px de altura, largura total |
| Vitrine | quatro colunas iguais, gaps próximos de 32 px |
| Destaque | duas colunas próximas de 1:1, quatro miniaturas abaixo |
| Fechamento | texto à esquerda e foto à direita, colunas próximas de 1:1 |

Definir tokens `--about-*` em `.about-us`, calibrados contra PSD. Tokens `--header-*` pertencem ao CSS compartilhado. Não alterar `--home-max-width` global para fazer a nova tela caber. Fonte candidata: Hurme já instalada; validar fonte/pesos contra PSD antes de afirmar correspondência. Branco/cinza claro, verde profundo, verde acinzentado e bege serão amostrados da referência.

## Responsividade

- Desktop ≥1024 px: preservar composição da referência e limite de largura.
- Tablet 600–1023 px: ajustar tipografia e gaps; vitrine pode passar a duas colunas quando nomes/preços exigirem.
- Mobile ≤599 px: header com marca central e ações, menus acessíveis; hero com textos completos e imagens reorganizadas; vitrine em duas colunas; destaque empilhado, botões com largura disponível; miniaturas em grid que caiba na tela; fechamento empilhado.
- Não reduzir toda a página como imagem. Textos e ações permanecem HTML acessível. Decoração não intercepta cliques e usa `aria-hidden`.

## Assets e dados pendentes

Inventariar logo, cadeira recortada, pessoa, textura, pingos e foto da comunidade. Conferir os arquivos existentes em `src/assets/img/home/` e `about.png` visualmente. Não presumir equivalência pelo nome. Não usar fotografias geradas na proposta descartada. Se for impossível extrair camadas, registrar os assets faltantes e solicitar exports; a imagem achatada é referência de QA, não substituto da página.

As URLs oficiais de Facebook/Instagram não foram encontradas no footer: são placeholders. A configuração precisa ser resolvida antes do aceite do header. A API retorna catálogo real, portanto a igualdade visual das fotos/preços só pode ser comparada com dados equivalentes; fixtures de teste não vão para produção.
