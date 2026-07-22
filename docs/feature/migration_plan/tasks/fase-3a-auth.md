# Fase 3a — Auth

Rotas: `login`, `recovery-password`, `reset-password`, `sign-up`, `verify-email`.

Contexto da auditoria: **não há `next-auth` em uso** (é dependência morta no `package.json`).
O fluxo já é 100% client-side: token em cookie via `js-cookie`, anexado por interceptor do
axios (`src/service/axios.tsx`). Esta fase é, portanto, majoritariamente um port mecânico de
imports, não uma reescrita de lógica de autenticação.

## Arquivos afetados

- `src/app/auth/layout.tsx`
- `src/app/auth/login/page.tsx` + `components/form.tsx` + `service/{controller,request,types}`
- `src/app/auth/recovery-password/page.tsx` + `components/form.tsx` + `service/*`
- `src/app/auth/reset-password/page.tsx` + `components/form.tsx` (usa `next/navigation`) + `service/*`
- `src/app/auth/sign-up/page.tsx` + `components/form.tsx` + `service/*`
- `src/app/auth/verify-email/page.tsx` + `components/verify_email.tsx` (usa `next/navigation`) + `service/*`
- `src/app/middleware/authentication.tsx` (usa `next/navigation`) — confirmar se é o guard
  usado nessas páginas ou correlato de outra área.

## Tarefas

- [ ] Portar `src/service/axios.tsx` sem alteração de lógica — só confirmar que
      `import.meta.env.VITE_API_URL` substitui `apiUrl` corretamente (ver Fase 1).
- [ ] Portar `src/service/cookies.tsx` e `src/service/localstorage.tsx` sem mudança (são
      agnósticos de framework).
- [ ] Trocar, em cada arquivo listado acima (API real do Vike, não React Router):
  - `useRouter()` + `router.push('/x')` (`next/navigation`) → `navigate('/x')`, importado de
    `vike/client/router`.
  - `useParams()`/`usePathname()` (`next/navigation`) → `usePageContext().routeParams` /
    `usePageContext().urlPathname`, importado de `vike-react/usePageContext`.
- [ ] Portar `src/app/middleware/authentication.tsx` para um guard de rota no novo roteador
      (wrapper que redireciona para `/auth/login` se não houver token válido).
- [ ] Portar os forms (`formik` + `yup`) sem mudança — são agnósticos de framework.
- [ ] Confirmar que o fluxo de e-mail de verificação (`verify-email`) que hoje lê algo da URL
      (token de verificação) continua funcionando com `usePageContext().urlParsed.search`.

## Critério de "pronto"

- Login, cadastro, recuperação de senha, reset de senha e verificação de e-mail funcionam
  fim a fim contra a API real, com o token sendo salvo/lido do cookie normalmente.
- Redirecionamento pós-login para a página anterior (se existir essa lógica hoje) preservado.
- Nenhuma referência restante a `next/navigation` ou `next-auth` nesses arquivos.
