# TASK-01 — Fundação de layout e tokens

## Metadados

- **Prioridade:** P0
- **Status:** Não iniciada
- **Dependências:** Nenhuma
- **Bloqueia:** TASK-02 a TASK-09

## Objetivo

Criar uma base consistente de largura, espaçamento e tipografia para todas as seções da Home, corrigindo problemas globais sem causar regressão nas demais rotas.

## Escopo

- Corrigir tokens CSS malformados.
- Corrigir seletores globais que deveriam ser classes.
- Definir container e gutters da Home.
- Remover altura fixa das seções de conteúdo.
- Manter altura de viewport apenas no hero.
- Normalizar o comportamento de rolagem.

## Arquivos previstos

- `src/app/globals.css`
- `src/app/components/home.css`
- `src/app/page.tsx`

## Passos de implementação

1. Corrigir a declaração de `--text-xl` e separar corretamente os demais tokens.
2. Definir tokens da Home:
   - `--home-max-width`.
   - `--home-gutter`.
   - `--home-section-space`.
   - `--header-height`, se necessário.
3. Corrigir `home-container` para `.home-container`.
4. Remover ou corrigir seletores globais inválidos como `flex-direction-column`.
5. Criar `.home-content` para centralização e largura máxima.
6. Substituir `.section-home { height: 100vh; }` por estrutura baseada em conteúdo.
7. Criar classe específica para o hero com `min-height` em `svh`.
8. Revisar `html` e `body` para que a rolagem principal não dependa de altura fixa.
9. Aplicar o container apenas à Home ou de forma controlada.
10. Confirmar que o fundo full bleed do hero e do Impacto continua ocupando toda a largura.

## Critérios de aceite

- Tokens CSS são sintaticamente válidos.
- `.home-container` é aplicado como classe.
- Sobre, Impacto e demais seções não usam `height: 100vh`.
- A Home não apresenta rolagem horizontal em 360 px.
- Header, conteúdo e footer podem compartilhar a mesma linha de alinhamento.
- `/product`, `/cart` e `/auth/login` não sofrem alteração visual inesperada.

## Validação

- Executar ESLint nos arquivos TSX alterados.
- Executar build do projeto.
- Inspecionar 1440, 1024, 768, 390 e 360 px.
- Verificar a rolagem pelo teclado, touch e mouse.
- Comparar largura do header, seções e footer.

## Riscos

- Tokens globais podem afetar componentes fora da Home.
- Alterar `html` e `body` pode afetar layouts que dependem de `height: 100%`.

## Mitigação

- Preferir tokens e classes com prefixo `home-`.
- Validar rotas com layouts próprios antes de concluir.

