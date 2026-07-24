# TASK-08 — Acessibilidade e performance

## Metadados

- **Prioridade:** P1
- **Status:** Não iniciada
- **Dependências:** TASK-02 a TASK-07

## Objetivo

Consolidar acessibilidade, estabilidade visual e desempenho após a reorganização dos componentes.

## Escopo de acessibilidade

1. Revisar ordem dos títulos:
   - Um único `h1`.
   - Seções principais com `h2`.
2. Garantir nomes acessíveis em botões por ícone.
3. Garantir foco visível em CTAs, miniaturas, vídeo, conta e carrinho.
4. Garantir área de toque mínima de 44 × 44 px.
5. Revisar contraste de texto sobre imagens.
6. Revisar `alt` de todas as imagens.
7. Adicionar estado acessível ao controle de vídeo.
8. Respeitar `prefers-reduced-motion`.
9. Garantir leitura e operação com zoom de 200%.
10. Validar que animações não sejam necessárias para revelar conteúdo.

## Escopo de performance

1. Identificar a imagem responsável pelo LCP.
2. Gerar versão otimizada da imagem principal.
3. Configurar `priority`, `sizes` e qualidade.
4. Migrar imagens elegíveis para `next/image`.
5. Adicionar dimensões ou `aspect-ratio` para evitar CLS.
6. Alterar vídeo para `preload="metadata"`.
7. Adicionar poster leve ao vídeo.
8. Evitar carregar recursos abaixo da dobra com prioridade alta.
9. Revisar necessidade de `dynamic = 'force-dynamic'` na Home.
10. Confirmar que falha da API de produtos não bloqueia a página.

## Arquivos previstos

- Todos os componentes da Home alterados nas tarefas anteriores.
- `src/app/page.tsx`
- `src/app/layout.tsx`
- `next.config.ts`, somente se necessário para imagens remotas.
- Assets otimizados.

## Critérios de aceite

- Toda ação possui nome acessível.
- Navegação por teclado alcança todas as ações.
- Foco é visualmente perceptível.
- Conteúdo é legível com zoom de 200%.
- Movimento reduzido é respeitado.
- CLS visual alvo é menor que 0,1.
- LCP alvo em produção é menor ou igual a 2,5 s no percentil 75.
- O vídeo não é baixado integralmente antes de ser necessário.
- Imagens abaixo da dobra não competem com a imagem principal.

## Validação

- Lighthouse mobile e desktop.
- Aba Performance do navegador.
- Navegação por teclado.
- Leitor de tela em header, hero, vídeo, produto e footer.
- Simulação de rede lenta.
- Simulação de API indisponível.

## Riscos

- Métricas locais não representam produção.
- Imagens de produto dependem de origem remota.

## Mitigação

- Registrar métricas locais apenas como referência.
- Confirmar resultados com monitoramento real após publicação.

