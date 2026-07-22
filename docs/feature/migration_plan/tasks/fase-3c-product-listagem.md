# Fase 3c — Listagem/busca de produto (`/product`)

Rota: `product` (listagem com busca/filtro). **Não confundir com `/product/[id]`**, que é
tratada na Fase 2 (SSR/SEO). Por decisão do plano (MIGRATION_PLAN.md, seção 2), esta fica como
SPA client-side — a não ser que a resposta ao ponto em aberto da seção 7 mude isso.

## Arquivos afetados

- `src/app/product/page.tsx` (hoje Server Component, delega para `Products`)
- `src/app/product/components/products.tsx`
- `src/app/product/components/product_filter/product_filter.tsx`
- `src/app/product/components/product_list/product_list.tsx`
- `src/app/product/components/product_list/components/product_card/product_card.tsx`
  (next/navigation)
- `src/app/product/components/search_input.tsx` (next/navigation)
- `src/app/product/service/{controller,query,request,type.d.ts}`
- `src/app/middleware/producs_list.ts` (reaproveitado pela Fase 2 também — ver nota abaixo)

## Tarefas

- [ ] Converter `page.tsx` de Server Component para uma rota client-side padrão (`+config.ts`
      com `{ ssr: false, prerender: true }`, ver regra no topo do README de tasks): o
      parâmetro de busca `q` (hoje lido via `searchParams` do Next) passa a vir de
      `usePageContext().urlParsed.search`.
- [ ] Portar `getProducts()` (`producs_list.ts`) para uma versão client-side (chamada via
      axios/react-query) — **nota**: a Fase 2 precisa de uma versão server-side da mesma
      função para a home; avaliar se compensa ter uma função de fetch compartilhada com um
      parâmetro de "onde está rodando" ou simplesmente duas implementações pequenas
      (client-side aqui, server-side na Fase 2) para não acoplar as duas fases.
- [ ] Trocar `next/navigation` em `product_card.tsx` e `search_input.tsx` por `navigate()`
      (`vike/client/router`) / `usePageContext()` (`vike-react/usePageContext`).
- [ ] Confirmar que a navegação da listagem para `/product/:id` (rota SSR da Fase 2) funciona:
      o Vike intercepta cliques em `<a href>` internos e faz a troca de página client-side
      mesmo quando o destino é uma rota SSR (ele busca o HTML/dados da nova página e troca o
      conteúdo sem reload completo) — validar isso na prática, não só assumir.

## Critério de "pronto"

- Busca/filtro de produtos funciona igual ao comportamento atual.
- Navegação da listagem para o detalhe do produto funciona sem quebrar o SSR da Fase 2.
- Nenhuma referência restante a `next/navigation` nesses arquivos.
