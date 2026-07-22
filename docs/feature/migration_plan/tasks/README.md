# Tasks — Migração Next.js → Vite

Índice das atividades detalhadas para executar o [MIGRATION_PLAN.md](../MIGRATION_PLAN.md).
Cada arquivo abaixo é uma fase (ou sub-fase) independente, com checklist, arquivos afetados
e critério de "pronto". Ordem sugerida de execução é a numeração dos arquivos.

## Legenda

- `[ ]` não iniciado · `[~]` em andamento · `[x]` concluído
- **Arquivos afetados**: caminhos relativos a `br.thp.zr0/src/`, levantados por auditoria do
  código atual (não é estimativa — são os arquivos reais encontrados).

## Escopo total (números da auditoria)

| Métrica | Valor |
|---|---|
| Rotas (`page.tsx`) | 40 |
| Arquivos usando `next/navigation` | 50 |
| Arquivos usando `next/image` | 7 |
| Arquivos usando `next/font` | 1 |
| Arquivos usando `next/script` | 1 |
| Arquivos usando `next/link` | 0 |
| Rotas que precisam de SSR/SSG (SEO) | 2 (`/`, `/product/:id`) |
| Rotas que viram SPA puro | as outras 38 |

## Regra obrigatória para qualquer rota nova (achado da Fase 1)

Toda rota client-only (Fase 3a–3f) precisa do `+config.ts` com **as duas** chaves, não só uma:

```ts
const config: Config = {
  ssr: false,
  prerender: true,
};
```

Sem `prerender: true`, o Vike ainda gera o HTML dessa rota por request via function — o que
mantém o custo de servidor rodando pra toda página, inclusive as que não precisam. Com
`prerender: true`, o Vike gera um HTML estático de verdade no build (ex.:
`dist/client/cart/index.html`), servido sem tocar a function nunca. Detalhes e validação
real (SWA CLI + Azure Function local) em
[fase-1-esqueleto-app.md](./fase-1-esqueleto-app.md#achados-importantes-mudam-a-regra-pra-fase-23).

## Ordem de execução

1. [Fase 0 — Spike de validação (100% local, sem deploy novo)](./fase-0-spike-validacao.md)
2. [Fase 1 — Esqueleto do app novo](./fase-1-esqueleto-app.md)
3. [Fase 2 — Páginas SEO-críticas (`/` e `/product/:id`)](./fase-2-paginas-seo.md)
4. Fase 3 — Resto do app como SPA (dividida por área, podem rodar em paralelo entre si depois da Fase 1):
   - [3a — Auth](./fase-3a-auth.md)
   - [3b — Cart, Order, Payment](./fase-3b-cart-order-payment.md)
   - [3c — Listagem/busca de produto (`/product`)](./fase-3c-product-listagem.md)
   - [3d — Profile](./fase-3d-profile.md)
   - [3e — Seller (área do vendedor)](./fase-3e-seller.md)
   - [3f — Componentes e utils compartilhados](./fase-3f-componentes-compartilhados.md)
5. [Fase 4 — Corte de tráfego / validação em produção](./fase-4-corte-trafego.md)
6. [Fase 5 — Limpeza](./fase-5-limpeza.md)

## Dependências entre fases

- Fase 0 bloqueia todo o resto (decide o framework).
- Fase 1 bloqueia as Fases 2 e 3.
- Fases 2 e 3 (3a–3f) podem ser feitas em paralelo por pessoas diferentes, uma vez que a Fase 1
  esteja pronta — não têm dependência forte entre si, exceto pelos componentes compartilhados
  (3f), que devem ser feitos **antes** ou **junto** das outras sub-fases de 3, já que
  `header.tsx`, `card_product.tsx` etc. são usados por várias áreas ao mesmo tempo.
- Fase 4 depende de 2 e todas as 3x estarem concluídas.
- Fase 5 só depois da Fase 4 validada em produção.
