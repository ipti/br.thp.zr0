# Fase 3e — Seller (área do vendedor)

Maior área do app em número de rotas. Totalmente autenticada, com controle de acesso por
perfil/role (`AccessPage` + `acessReadPage`). SPA client-side puro.

## Arquivos afetados

Guard de acesso (fazer primeiro, é usado por toda a área):

- `src/app/seller/layout.tsx` (next/navigation)
- `src/app/seller/components/access_page.tsx` (usa `usePathname` do next/navigation +
  `acessReadPage`/`Profile` de `src/app/middleware/use_acess_page.ts` e `use_permission.ts`)
- `src/app/seller/components/unauthorized/unauthorized.tsx`
- `src/app/seller/context` (revisar o que expõe — provavelmente estado de perfil/permissões)

Rotas e componentes por sub-área:

- **Home do seller**: `src/app/seller/home/page.tsx`
- **Categoria**: `category/page.tsx`, `category/create/page.tsx`,
  `category/update/page.tsx` (next/navigation), `category/components/list.tsx`
  (next/navigation)
- **Produto (do seller, diferente de `/product`)**: `product/page.tsx`,
  `product/create/page.tsx`, `product/one/page.tsx`, `product/update/page.tsx`
  (next/navigation), `product/components/list.tsx` (next/navigation)
- **Pedidos cancelados**: `canceled-orders/page.tsx`, `canceled-orders/one/page.tsx`
  (next/navigation), `canceled-orders/components/list.tsx` (next/navigation)
- **Usuários**: `user/page.tsx`, `user/create/page.tsx`, `user/update/page.tsx`
  (next/navigation), `user/components/list.tsx` (next/navigation)
- **Oficina de transformação** (maior sub-área):
  - `transformation-workshop/page.tsx`, `create/page.tsx`, `update/page.tsx`
    (next/navigation), `components/list.tsx` (next/navigation)
  - `member/page.tsx` + `components/members.tsx` (next/navigation) +
    `components/modal_add_member/modal_add_member.tsx` (next/navigation)
  - `one/page.tsx` + `components/one.tsx` (next/navigation) +
    `components/members/members.tsx` (next/navigation) +
    `components/orders/orders.tsx` (next/navigation) +
    `components/products/products.tsx` (next/navigation)
  - `orders/page.tsx`, `orders/one/page.tsx` (next/navigation),
    `orders/components/list.tsx` (next/navigation)
  - `product/page.tsx` + `product/components/list.tsx` (next/navigation) +
    `product/components/modal_add_product/modal_add_product.tsx` (next/navigation)

## Tarefas

- [ ] Portar `AccessPage` (`access_page.tsx`): trocar `usePathname()` do Next por
      `usePageContext().urlPathname` (`vike-react/usePageContext`) — lógica de
      `acessReadPage(profile, pathname)` não muda.
- [ ] Portar `use_acess_page.ts` / `use_permission.ts` (`src/app/middleware/`) sem mudança de
      lógica (são funções puras baseadas em pathname/role).
- [ ] Trocar `next/navigation` por `navigate()`/`usePageContext()` em todos os arquivos
      listados acima
      (maior volume de arquivos do projeto — considerar dividir entre mais de uma pessoa por
      sub-área: categoria / produto / usuários / oficina de transformação / pedidos
      cancelados).
- [ ] Revisar `seller/context` e confirmar que o estado de perfil/permissão continua
      disponível globalmente na área (Context API é agnóstico de framework, deve portar sem
      mudança de padrão).
- [ ] Validar, por sub-área, os fluxos de CRUD (criar/editar/listar) contra a API real.

## Critério de "pronto"

- Guard de acesso bloqueia corretamente usuários sem permissão em cada sub-rota.
- Todas as sub-áreas (categoria, produto, usuários, oficina de transformação, pedidos
  cancelados) navegam e fazem CRUD corretamente.
- Nenhuma referência restante a `next/navigation` em `src/app/seller/**`.
