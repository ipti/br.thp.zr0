# História técnica — Loja de produtos

## Arquitetura de rotas

| Rota | Responsabilidade |
| --- | --- |
| `/product` | Vitrine editorial baseada no PSD |
| `/product/all` | Catálogo completo com busca, filtros, ordenação e paginação |
| `/product/[id]` | Detalhe do produto existente |

`/product/all` é uma rota estática e deve ser resolvida antes do segmento dinâmico `[id]` pelo App Router.

## Estrutura proposta

```text
src/app/product/
├── page.tsx
├── all/
│   └── page.tsx
├── [id]/
│   └── page.tsx
└── components/storefront/
    ├── store_hero.tsx
    ├── store_manifesto.tsx
    ├── featured_product.tsx
    ├── featured_gallery.tsx
    ├── related_products.tsx
    ├── store_video.tsx
    └── store_closing.tsx
```

Cada componente visual deve possuir seu CSS próximo ao componente, seguindo o padrão existente no projeto. Não criar um único arquivo CSS monolítico para toda a página.

## Ordem visual do PSD

1. Header público compartilhado.
2. Hero texturizado com chamada central.
3. Manifesto em duas colunas, com texto e fotografia circular.
4. Produto em destaque em duas colunas.
5. Galeria de miniaturas do produto em destaque.
6. Quatro produtos em “Veja também”.
7. Link “Ver todos”.
8. Vídeo horizontal.
9. Fechamento institucional.

## Tipografia

- **Hurme Geometric Sans 1:** títulos, chamadas, labels e botões.
- **Poppins Regular:** parágrafos, preços, descrições e informações auxiliares.
- Não usar Libre Baskerville nesta composição sem evidência visual no PSD.

Escala inicial, a ser refinada por comparação visual:

```css
--store-title-hero: clamp(2.25rem, 3.1vw, 3.75rem);
--store-title-editorial: clamp(2rem, 2.7vw, 3.25rem);
--store-title-section: clamp(1.75rem, 2.2vw, 2.625rem);
--store-body: clamp(1rem, 1.1vw, 1.125rem);
```

## Cores e layout

Tokens iniciais:

```css
--store-green: #10594f;
--store-text: #1d231f;
--store-background: #f7f7f4;
--store-sage: #b9c9a9;
--store-sand: #d4c5a3;
--store-white: #ffffff;
--store-max-width: 95rem;
--store-gutter: clamp(1.5rem, 7.8vw, 9.375rem);
--store-section-space: clamp(4.5rem, 8vw, 9.375rem);
```

As cores devem ser confirmadas na comparação visual. Evitar substituir os tons do PSD por preto puro ou pelo verde genérico dos componentes PrimeReact.

## Dados

O modelo atual não identifica um produto editorialmente destacado. A solução inicial recomendada é resolver no servidor uma variável `STORE_FEATURED_PRODUCT_UID`, com fallback para o primeiro produto disponível.

Em evolução futura, o backend poderá fornecer campos como `isFeatured` e `storefrontOrder`. Essa evolução não bloqueia a primeira versão.

- Galeria: `product.product_image`, ordenada por `order` quando disponível.
- Recomendações: quatro produtos diferentes do destaque.
- Preço: formatado em BRL pelo utilitário existente ou `Intl.NumberFormat`.
- Estoque: considerar a quantidade já existente no carrinho.

## Compatibilidade de URLs

Durante a migração, `/product` deve inspecionar parâmetros reconhecidos de catálogo, como `q`, `page`, `category`, `categoryId` e `sort`. Quando presentes, deve redirecionar para `/product/all` preservando a query string.

Essa regra permite que links indexados ou salvos continuem levando ao catálogo filtrado.

## Assets

Podem ser reaproveitados:

- `src/assets/img/home/hero/hero_texture.png`;
- `src/assets/img/home/pingos.svg`;
- `src/assets/img/home/pessoas_zr0.svg`;
- `src/assets/img/ZR0_logotipo.png`;
- imagens de produto retornadas pela API.

Precisam ser exportados ou confirmados:

- fotografia circular do processo produtivo;
- grafismos pretos do manifesto, caso não sejam construídos em CSS/SVG;
- poster do vídeo, caso o frame do PSD seja obrigatório.

## Estratégia de testes

- Testes unitários para seleção da galeria e regras do carrinho.
- Testes de componentes para produto em destaque e recomendações.
- Teste de integração dos parâmetros e redirecionamentos.
- Build e lint.
- Comparação visual em desktop, tablet e mobile.
- Regressão do catálogo, detalhes, header, footer e carrinho.
