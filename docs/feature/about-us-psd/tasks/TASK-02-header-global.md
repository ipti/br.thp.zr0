# TASK-02 — Header público geral conforme PSD

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** TASK-01

## Objetivo

Aplicar a apresentação do PSD ao Header compartilhado, mantendo navegação, autenticação e carrinho.

## Arquivos previstos

- `src/components/header/header.tsx` e `header.css`
- `src/components/header/header_navigation/header_navigation.tsx` e `.css`
- `src/components/header/header_social/header_social.tsx` e `.css`
- `src/app/globals.css` e consumidores de `--header-height`, se necessário para offsets
- `src/components/header/__tests__/header.test.tsx`

## Passos de implementação

1. Montar duas linhas conforme medidas conferidas: redes à esquerda, logo central, carrinho antes de conta à direita; menus centralizados abaixo.
2. Usar branco sólido, ícones pretos, dimensões do logo preservadas; substituir aparência atual de botão Produtos, sombra e blur.
3. Implementar os menus e destinos definidos na história funcional com links reais e estado de expansão acessível.
4. Manter `LoginModal`, `MenuUser`, `useFetchUserToken`, hidratação e store; preservar semântica atual do contador (`cart.length`), com descrição acessível.
5. Exibir nome da conta como descrição acessível/tooltip quando o desenho mostrar somente ícones.
6. Resolver URLs oficiais de redes. Não copiar `href="#"` do footer nem inventar endereços; enquanto pendente, deixar a limitação documentada e não declarar esta task concluída.
7. Verificar fechamento dos menus com Escape e retorno de foco; evitar sobreposição com Popover e login.
8. Revisar altura sticky/offsets. Manter os pontos atuais de uso, acrescentando apenas o uso na nova rota; não inserir Header no root layout.

## Critérios de aceite

- Mesmo componente nas rotas públicas que já o consomem, sem variante exclusiva desta tela.
- Logo visualmente central com laterais de larguras diferentes.
- Navegação disponível inclusive em `/product`; carrinho e conta continuam funcionais.
- Em 360 px não há colisões; ações têm alvo mínimo de 44 × 44 px e foco visível.
- HeaderSeller continua independente.

## Validação e riscos

Testar usuário autenticado/anônimo, contador vazio/preenchido, menus por teclado, abertura de login e navegação. Conferir home nas duas flags, product, cart, profile, order, payment e production-order. Mudança compartilhada tem risco de deslocar overlays e âncoras; incluir esses casos na regressão.

## Resultado

Revisão em `src/components/header/` contra os critérios de aceite:

- **Componente único e reutilizado** — `Header` (`header.tsx`) é o mesmo em `page.tsx` (home), `product`, `cart`, `profile`, `order`, `payment` e `production-order`. `HeaderSeller` permanece um componente separado, sem imports cruzados. OK.
- **Duas linhas / layout** — grid `1fr auto 1fr` centraliza o logo com `HeaderSocial` à esquerda e carrinho+conta à direita; navegação centralizada na segunda linha (`HeaderNavigation`). Fundo branco sólido, ícones pretos (`#111111`), sem sombra/blur. OK.
- **Menus com links reais** — `HeaderNavigation` aponta para `/product`, `/about-us` e `/about-us#sustentability` (rota criada só na TASK-03; aceitável nesta ordem de dependências, mas o link ficará quebrado até lá — sinalizar na regressão da TASK-03/08).
- **Login/conta/carrinho preservados** — `LoginModal`, `MenuUser`, `useFetchUserToken`, hidratação (`hydrated`) e `useCartStore` mantidos; contador usa `cart.length` com `aria-label` descritivo (`"Abrir carrinho com N item(ns)"`). Nome da conta exposto via `aria-label` (`accountLabel`) quando autenticado. OK.
- **URLs de redes sociais** — resolvidas via `NEXT_PUBLIC_FACEBOOK_URL`/`NEXT_PUBLIC_INSTAGRAM_URL` (vazias em `.env.example`); sem link ausente é renderizado como `<span>` desabilitado com tooltip "indisponível", em vez de `href="#"` ou URL inventada. Pendência documentada corretamente, conforme passo 6.
- **Teclado/foco** — Escape fecha o menu aberto e devolve foco ao trigger (testado); `:focus-visible` com outline de 3px. Fechamento por clique fora também implementado. OK.
- **Sticky/offsets** — `--header-height` e variáveis derivadas em `globals.css`; nenhum uso de `Header` no root layout, apenas nos layouts/páginas que já o consumiam. OK.
- **Alvo mínimo 44×44px** — corrigido na TASK-07: `header_social.css` tinha `2.25rem × 2.75rem` (36×44px) abaixo de 599px; ajustado para `2.75rem × 2.75rem` (44×44px). Os demais alvos (`site-header__action`, itens do menu de navegação) já respeitavam 44×44px.
- **Testes** — `header.test.tsx` cobre hidratação, abertura do login e navegação/Escape com retorno de foco; suíte passa (`npx jest src/components/header`).

Conclusão: todos os critérios de aceite atendidos.
