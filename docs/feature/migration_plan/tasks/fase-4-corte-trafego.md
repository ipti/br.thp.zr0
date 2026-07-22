# Fase 4 — Corte de tráfego / validação em produção

Objetivo: colocar o app novo em produção com segurança, validar que a indexação/SEO melhorou
de fato, e só então desligar o app antigo.

Pré-requisito: Fases 2 e 3 (3a–3f) concluídas e testadas.

## Tarefas

### Deploy paralelo

- [ ] Subir o app novo (Vite + SSR serverless) em um ambiente próprio (ex.: subdomínio de
      staging ou slot de deploy separado), sem ainda apontar o domínio de produção para ele.
- [ ] Rodar smoke test manual em todas as áreas (auth, cart, order, payment, profile, seller,
      product, home) no ambiente de staging.
- [ ] Validar variáveis de ambiente de produção (`VITE_API_URL`,
      `VITE_STRIPE_PUBLIC_KEY` — equivalentes às `NEXT_PUBLIC_*` atuais) configuradas
      corretamente no novo ambiente.
- [ ] Confirmar CORS liberado na API NestJS para o domínio de produção do novo front (se a
      decisão da seção 4.5 do MIGRATION_PLAN.md — chamar a API direto do navegador — for
      mantida).

### Validação de SEO antes do corte

- [ ] Rodar Lighthouse/PageSpeed Insights em `/` e em 2–3 páginas de produto no ambiente de
      staging.
- [ ] Testar preview de link (WhatsApp, Facebook Sharing Debugger, Twitter Card Validator) em
      pelo menos 3 produtos diferentes.
- [ ] Validar `robots.txt` e `sitemap.xml` acessíveis no domínio de staging.
- [ ] Comparar HTML retornado por `curl` (sem JS) entre app antigo e novo para `/` e
      `/product/:id` — confirmar que o novo tem conteúdo igual ou melhor.

### Corte de tráfego

- [ ] Definir estratégia de corte: direto (trocar DNS/CDN de uma vez) ou gradual (% de
      tráfego, se a infraestrutura de hosting escolhida suportar).
- [ ] Apontar o domínio de produção para o novo app.
- [ ] Monitorar por 24–48h: taxa de erro, latência (especialmente cold start da function nas
      duas rotas SSR), volume de tráfego, custo real no portal Azure.
- [ ] Manter o app antigo (container Next) de pé, mas fora de tráfego, por um período de
      rollback rápido (definir por quanto tempo — sugestão: 1–2 semanas).

### Pós-corte

- [ ] Submeter o novo `sitemap.xml` no Google Search Console.
- [ ] Acompanhar no Search Console, ao longo das semanas seguintes, se a cobertura de
      indexação das páginas de produto melhora (métrica que valida se o diagnóstico original
      estava certo — ver ponto em aberto da seção 7 do MIGRATION_PLAN.md).

## Critério de "pronto"

- Tráfego de produção 100% no app novo, sem regressão de erro/latência relevante.
- Nenhum fluxo crítico (login, compra, cadastro de produto pelo seller) quebrado.
- Preview de link funcionando em produção real (não só staging).
