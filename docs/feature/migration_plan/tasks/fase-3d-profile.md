# Fase 3d — Profile

Rotas: `profile`, `profile/address`, `profile/order`, `profile/order/[id]`,
`profile/wishlist`, `profile/your_information`. Área autenticada — SPA client-side puro.

## Arquivos afetados

- `src/app/profile/layout.tsx` (next/navigation)
- `src/app/profile/page.tsx`
- `src/app/profile/address/page.tsx`
- `src/app/profile/order/page.tsx` + `components/card_order/card_order.tsx` (next/navigation)
- `src/app/profile/order/[id]/page.tsx` + `components/card/card.tsx` (next/navigation) +
  `components/components.tsx` (next/navigation)
- `src/app/profile/wishlist/page.tsx`
- `src/app/profile/your_information/page.tsx`
- `src/app/profile/components/card_profile/card_profile.tsx` (next/navigation)

## Tarefas

- [ ] Trocar `next/navigation` por `navigate()` (`vike/client/router`) e `usePageContext()`
      (`vike-react/usePageContext`) em todos os arquivos listados.
- [ ] Portar o guard de autenticação do layout (`profile/layout.tsx`) para o padrão definido
      na Fase 3a (mesmo mecanismo de guard usado no auth).
- [ ] Validar `profile/order/[id]` (detalhe de pedido do cliente) carrega dado correto via
      `usePageContext().routeParams`.
- [ ] Confirmar wishlist (favoritos) — hoje provavelmente client-side já (zustand ou
      react-query) — não deve exigir mudança de lógica, só de imports.

## Critério de "pronto"

- Todas as 6 rotas navegam e carregam dados corretamente, autenticado.
- Nenhuma referência restante a `next/navigation` nesses arquivos.
