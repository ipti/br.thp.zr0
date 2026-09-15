# TASK-06 — Fechamento institucional

## Metadados

- **Prioridade:** P1
- **Status:** Concluída com uma pendência de conteúdo (alt text, ver Resultado)
- **Dependências:** TASK-03

## Objetivo

Reproduzir o último bloco do PSD, com texto, marca e foto original da comunidade.

## Arquivos previstos

- `src/app/about-us/components/about_closing/about_closing.tsx` e `.css`
- `src/app/about-us/page.tsx`

## Passos de implementação

1. Criar componente server com texto à esquerda e foto arredondada à direita.
2. Aplicar texto literal da história funcional, logo e assinatura “Do descarte à permanência.”.
3. Usar foto conferida na TASK-01, com alt descrevendo o que realmente aparece nela.
4. Posicionar decoração nas bordas conforme PSD e preservar respiro entre painel de produtos e fechamento.
5. Expor âncora `sustentability`, já utilizada nos links existentes, sem acrescentar seção.
6. Encerrar a composição após este bloco, sem inserir footer escuro ou CTA adicional.

## Critérios de aceite

- Texto, ordem, foto e logo correspondem à referência.
- Desktop tem duas colunas e mobile empilha sem corte da fotografia.
- Âncora existente funciona e não fica coberta pelo header.

## Validação e riscos

Comparação visual com a parte inferior do PSD. Não presumir que `pessoas_zr0.svg` ou `about.png` é a foto correta sem conferir seu conteúdo. Não substituir comunidade real por imagem gerada.

## Resultado

Implementado `about_closing.tsx`/`.css`; `page.tsx` agora renderiza `<AboutClosing />` após `FeaturedProduct`, encerrando a composição sem footer escuro nem CTA adicional. `next build` e `eslint` sem erros novos.

- **Texto literal** — título, corpo e assinatura copiados exatamente da história funcional ("Acreditamos que a sustentabilidade vai além da redução de impactos.", "É sobre criar sistemas capazes de regenerar comunidades, ampliar oportunidades e transformar resíduos em futuro.", "Do descarte à permanência."), diferente da cópia já existente em `ClosingStatement` da landing (que usa texto parecido, mas não idêntico) — não reaproveitei esse componente para não herdar um texto divergente da referência.
- **Logo e foto** — reutiliza `ZR0_logotipo.png` e `pessoas_zr0.svg`, ambos já confirmados como reaproveitáveis no manifesto da TASK-01 para esta seção.
- **Duas colunas / mobile empilha** — grid `1fr 1fr` no desktop, colapsa para uma coluna em `≤1023px`; a imagem usa `width:100%; height:auto` dentro de `figure` com `border-radius`, sem `object-fit: cover`/altura fixa que cortasse a fotografia ao empilhar.
- **Âncora** — `<section id="sustentability">` com `scroll-margin-top: var(--header-height)`, garantindo que o header sticky (TASK-02) não cubra o título ao navegar por `/about-us#sustentability` a partir do menu "Nosso compromisso".
- **Isolamento** — CSS novo em `about_closing.css`, sem tocar `closing_statement.css`/`.landing-closing-statement` da landing.

### Pendência de conteúdo

O manifesto da TASK-01 já registrava que o alt text de `pessoas_zr0.svg` precisa ser corrigido no novo componente. Como o arquivo é grande (827 KB) e não pôde ser inspecionado visualmente nesta revisão, usei um alt conservador ("Fotografia de pessoas da comunidade parceira da ZR0") em vez de repetir a descrição específica já usada na landing ("Mulheres e crianças reunidas em uma oficina comunitária"), que o próprio manifesto não confirma. Recomendo validar visualmente o SVG e ajustar o alt para descrever com precisão quem/o quê aparece antes de fechar esta task no todo.
