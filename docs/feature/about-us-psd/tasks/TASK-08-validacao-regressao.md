# TASK-08 — Validação visual e regressão

## Metadados

- **Prioridade:** P1
- **Status:** Concluída parcialmente — validação automatizada completa; validação visual/navegador e sessão autenticada bloqueadas por falta de ambiente gráfico (ver `docs/feature/about-us-psd/validacao.md`)
- **Dependências:** TASK-07

## Objetivo

Comprovar fidelidade visual, comportamento da nova página e estabilidade do header compartilhado.

## Arquivos previstos

- Testes de header e destaque definidos nas TASK-02 e TASK-05
- `docs/feature/about-us-psd/validacao.md`
- `docs/feature/about-us-psd/reference/` para evidências selecionadas

## Passos de implementação

1. Executar lint (`npm run lint`), verificação TypeScript (`npx tsc --noEmit`), testes dos componentes afetados e build (`npm run build`). Registrar comandos, resultados e bloqueios de ambiente sem expor segredos.
2. Capturar página em largura 1920 px e comparar lado a lado/sobreposta ao PSD: header, hero, margens, cards, painel, miniaturas, fechamento, tipografia e decoração.
3. Usar dados equivalentes em ambiente de teste para comparação; documentar diferenças do catálogo real, fonte ou assets que impeçam correspondência exata.
4. Conferir larguras 360, 390, 768, 1024 e 1440 px, teclado, foco e zoom.
5. Validar seleção, detalhes, compra, estoque insuficiente, catálogo vazio, imagem ausente e falha de catálogo (hoje representada por lista vazia).
6. Testar header na home com flag ligada/desligada, catálogo, detalhe, carrinho, perfil, pedidos, pagamento e encomendas. Confirmar que rotas protegidas mantêm suas regras e seller não recebeu header duplicado.
7. Confirmar links sociais reais, menus, login, conta autenticada, contador, âncoras e presença única do header.
8. Atualizar status das tasks com evidências; documentar limitações em vez de declarar aprovação sem execução.

## Critérios de aceite

- Verificações concluídas ou falhas preexistentes/bloqueios claramente separados das mudanças.
- Nenhuma divergência conhecida de ordem, composição, ação ou navegação fica sem registro e resolução.
- Evidência desktop inclui comparação com o PSD; evidência mobile comprova adaptação utilizável.
- Não publicar/deployar como parte desta task; entregar implementação e resultados para revisão.

## Riscos

API indisponível pode esconder o painel e invalidar a comparação visual. Sessão autenticada pode ser necessária para validar overlays e rotas protegidas. Não declarar esses casos testados usando apenas mocks ou inspeção estática.

## Resultado

Relatório completo em [`../validacao.md`](../validacao.md). Resumo:

- **Executado e sem regressão:** `npm run lint`, `npx tsc --noEmit`, `npx jest` (suíte completa) e `npm run build` — nenhum erro novo em `src/app/about-us/` ou `src/components/header/`; as falhas/erros pré-existentes no restante do repositório foram conferidas e confirmadas como não relacionadas (arquivos não tocados por esta feature).
- **Executado via `next start` + inspeção do HTML (sem navegador gráfico):** header único e presente em `/about-us`, `/`, `/product`, `/cart`, `/production-order`; os dois caminhos da flag `NEW_LANDING_PAGE_ENABLED` funcionam; catálogo de `/about-us` renderizou 4 produtos reais da API com preços formatados (não fixtures do PSD); âncoras `#history`/`#sustentability` presentes; links sociais aparecem corretamente desabilitados (URLs ainda pendentes).
- **Bloqueado, não testado:** comparação visual pixel a pixel com o PSD em 1920 px e nas demais larguras, navegação manual por teclado/zoom em navegador real, e qualquer fluxo com sessão autenticada (`MenuUser`, `HeaderSeller`/`seller/home`, checkout). Rotas protegidas (`/profile`, `/seller/home`) redirecionaram corretamente sem sessão (307), mas o conteúdo pós-login não pôde ser inspecionado.
- **Estados de exceção:** cobertos por teste automatizado (`featured_product.test.tsx`) para seleção, compra, estoque insuficiente/atingido e lista vazia; catálogo vazio e imagem ausente têm tratamento no código mas não foram exercitados por uma falha real de API (a API respondeu normalmente durante a checagem).
- **Pendências consolidadas** (recortes do hero, alt de `pessoas_zr0.svg`, URLs sociais) permanecem em aberto e documentadas, sem terem sido mascaradas.

Esta task não deve ser lida como "aprovação visual final" — apenas como validação automatizada e funcional via servidor, com os bloqueios acima explicitados para quem tiver acesso a navegador e a uma conta de teste.
