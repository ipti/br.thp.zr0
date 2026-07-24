# TASK-03 — Hero responsivo

## Metadados

- **Prioridade:** P0
- **Status:** Não iniciada
- **Dependências:** TASK-01

## Objetivo

Manter o impacto visual do comparador de materiais no desktop e entregar uma composição legível, estável e acionável no mobile.

## Arquivos previstos

- `src/app/components/splitter_home/splitter_home.tsx`
- `src/app/components/splitter_home/splitter_home.css`
- Assets do hero, caso seja necessária versão otimizada

## Passos de implementação

1. Criar estrutura semântica para conteúdo, mídia e CTA.
2. Aplicar `min-height: calc(100svh - var(--header-height))`.
3. Limitar a largura do conteúdo central.
4. Dimensionar logo com `clamp()`.
5. Dimensionar título com `clamp()` e largura máxima.
6. Limitar CTA à largura disponível e remover padding horizontal excessivo no mobile.
7. Adicionar camada de contraste entre imagens e texto.
8. Manter Splitter redimensionável no desktop.
9. No mobile:
   - Desabilitar interação do Splitter, ou
   - Substituir por divisão estática.
10. Reduzir a largura visual do divisor no mobile.
11. Definir `sizes`, `priority` e qualidade adequada para imagens.
12. Garantir foco visível no CTA e no controle do Splitter, quando interativo.

## Critérios de aceite

- Logo, título e CTA não ultrapassam a viewport em 360 px.
- CTA permanece totalmente visível e com área de toque adequada.
- O divisor não encobre a mensagem principal.
- O hero ocupa a primeira dobra sem gerar altura adicional desnecessária.
- O texto mantém contraste adequado nas duas imagens.
- O CTA direciona para `/product`.

## Validação

- Desktop: 1440 × 1000 e 1024 × 768.
- Mobile: 390 × 844 e 360 × 800.
- Testar orientação retrato e paisagem.
- Testar navegação por teclado.
- Medir LCP antes e depois.

## Riscos

- Simplificar o Splitter pode reduzir o efeito de marca.
- Uma camada escura muito forte pode esconder a textura do material.

## Mitigação

- Preservar a interação no desktop.
- Ajustar contraste com gradiente localizado atrás do conteúdo.

