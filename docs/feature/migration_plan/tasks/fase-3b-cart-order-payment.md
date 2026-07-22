# Fase 3b — Cart, Order, Payment

Rotas: `cart`, `order`, `order/[id]`, `payment`. Área totalmente autenticada/transacional —
SPA client-side puro, sem necessidade de SEO.

## Arquivos afetados

- `src/app/cart/page.tsx` + `components/components.tsx` (next/navigation) +
  `components/identify/identify.tsx` (next/navigation) + `service/controller.tsx`
  (next/navigation)
- `src/app/order/layout.tsx` (next/navigation)
- `src/app/order/[id]/page.tsx` + `components/components.tsx` (next/navigation)
- `src/app/payment/page.tsx` + `components/payment.tsx` (next/navigation) +
  `layout.tsx` (next/navigation)
- Integração Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`) usada em `payment` —
  confirmar se depende de alguma API server-side do Next (ex.: rota de API para criar
  PaymentIntent) ou se já chama a API NestJS diretamente.

## Tarefas

- [ ] Trocar `useRouter`/`useParams`/`usePathname` (`next/navigation`) pelas APIs reais do
      Vike — `navigate()` (de `vike/client/router`) e `usePageContext().routeParams` /
      `usePageContext().urlPathname` (de `vike-react/usePageContext`) — em todos os arquivos
      listados.
- [ ] Confirmar (grep por `/api/route` ou `app/api`) se existe alguma API Route do Next
      (`route.ts`) usada pelo fluxo de pagamento — se existir, precisa migrar essa lógica para
      a API NestJS ou para uma function serverless separada, já que Vite/SPA não tem API
      routes embutidas. **(auditoria inicial não encontrou nenhuma pasta `app/api`, mas
      revalidar antes de fechar esta fase)**.
- [ ] Portar `order/[id]` (detalhe de pedido) — checar se usa dado sensível que hoje só existe
      por vir de Server Component; se sim, mover a leitura para uma chamada client-side
      autenticada (com o token do cookie) via axios.
- [ ] Validar o fluxo de checkout completo contra o Stripe em modo teste após a migração.

## Critério de "pronto"

- Fluxo carrinho → identificação → pagamento → confirmação de pedido funciona fim a fim.
- Detalhe de pedido (`order/[id]`) carrega os dados corretos, respeitando autenticação.
- Nenhuma referência restante a `next/navigation` nesses arquivos.
