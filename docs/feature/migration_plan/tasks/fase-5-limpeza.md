# Fase 5 — Limpeza

Objetivo: remover o que ficou obsoleto depois que o app novo estiver validado em produção
(ver Fase 4) por tempo suficiente para descartar rollback.

Pré-requisito: Fase 4 concluída e período de segurança de rollback vencido.

## Tarefas

- [ ] Remover o container antigo: `Dockerfile`, `docker-compose.yml` do projeto Next.
- [ ] Desligar/remover o App Service (ou equivalente) que rodava o container Node 24/7 no
      Azure.
- [ ] Remover o repositório/pasta do projeto Next antigo (ou arquivá-lo, se preferirem manter
      histórico de referência por algum tempo — decidir).
- [ ] Remover do `package.json` (se ainda não removido na Fase 1): `next`, `next-auth`,
      `eslint-config-next`, `next.config.ts`, `next-env.d.ts`, `middleware.ts` (raiz).
- [ ] Remover o rewrite `/api/:path*` do `next.config.ts` — já não se aplica (arquivo inteiro
      sai junto).
- [ ] Atualizar README do projeto com as novas instruções de setup/build/deploy (substituindo
      referências a `next dev`, `next build`, `next start`).
- [ ] Atualizar pipeline de CI/CD (se existir fora deste repo) removendo etapas específicas do
      Next e adicionando build/deploy do Vite + Azure Static Web Apps + Function.
- [ ] Revisar e fechar os "pontos em aberto" da seção 7 do MIGRATION_PLAN.md que ficaram sem
      resposta durante a execução, registrando a decisão final tomada.

## Critério de "pronto"

- Nenhum resquício do stack Next.js no repositório (`grep -ri "next" package.json` só retorna
  o que não é relacionado ao framework, se houver).
- Custo de hosting mensal do front confirmado como reduzido frente à baseline anterior
  (comparar com a estimativa feita na Fase 0).
- Documentação (README + MIGRATION_PLAN.md) refletindo o estado final real do projeto.
