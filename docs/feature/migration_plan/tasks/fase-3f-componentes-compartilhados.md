# Fase 3f — Componentes e utils compartilhados

Estes arquivos são usados por várias áreas ao mesmo tempo (home, product, cart, seller...) —
fazer **antes ou junto** das outras sub-fases de 3, para não bloquear todo mundo esperando o
mesmo arquivo.

## Arquivos afetados

`next/navigation`:

- `src/components/back_button/back_button.tsx`
- `src/components/card_product/card_product.tsx`
- `src/components/header/header.tsx`
- `src/components/header/header_seller/header_seller.tsx`
- `src/components/header/menu_user/menu_user.tsx`
- `src/components/header/cart_dialog/cart_dialog.tsx`
- `src/components/slider_bar/slider_bar.tsx`
- `src/utils/navigation.tsx`
- `src/app/not-found.tsx`
- `src/app/middleware/get_page.tsx` (consumidor do header `x-path` do `middleware.ts` raiz —
  ver tarefa específica abaixo)

`next/image`:

- `src/app/components/footer/footer.tsx`
- `src/app/components/splitter_home/splitter_home.tsx`
- `src/components/logo/logo.tsx`
- `src/components/header/header.tsx`
- `src/components/header/header_seller/header_seller.tsx`
- `src/components/slider_bar/slider_bar.tsx`
- `src/app/not-found.tsx`

## Tarefas

- [ ] Trocar `next/navigation` (`useRouter`, `useParams`, `usePathname`) por `navigate()`
      (`vike/client/router`) e `usePageContext()` (`vike-react/usePageContext`) em todos os
      arquivos listados.
- [ ] Trocar `next/image` (`<Image>`) por `<img>` com `loading="lazy"` manual e `width`/
      `height` explícitos (evitar layout shift) — revisar se algum uso depende de otimização
      automática de formato (`next/image` converte para WebP/AVIF) e, se sim, avaliar uma lib
      agnóstica de otimização (ex.: servir imagens já otimizadas via CDN/Blob Storage) como
      substituto.
- [ ] `src/app/middleware/get_page.tsx`: hoje lê o header `x-path` setado pelo
      `middleware.ts` raiz do Next (que não existe em Vite/SPA). Trocar a fonte do path atual
      para `usePageContext().urlPathname` — **eliminar a dependência do header `x-path` por
      completo**, já que ele não tem equivalente nativo fora do Next.
- [ ] `src/utils/navigation.tsx`: revisar o que expõe (provavelmente helpers de navegação
      programática) e portar para usar `navigate()` de `vike/client/router`.
- [ ] `src/app/not-found.tsx`: portar para `pages/_error/+Page.tsx` (convenção do Vike para
      página de erro/not-found — já vem stubada no esqueleto da Fase 1).

## Critério de "pronto"

- Header, menu de usuário, diálogo de carrinho, botão voltar, slider e logo funcionam
  identicamente em qualquer página que os use.
- Página 404 funcional para rotas inexistentes.
- Zero ocorrências de `next/navigation`, `next/image`, `x-path` no projeto novo
  (`grep -r "next/" src/` deve retornar vazio ao final de toda a Fase 3).
