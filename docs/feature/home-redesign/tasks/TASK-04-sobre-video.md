# TASK-04 — Seção Sobre e vídeo

## Metadados

- **Prioridade:** P0
- **Status:** Não iniciada
- **Dependências:** TASK-01
- **Bloqueia:** TASK-05

## Objetivo

Melhorar leitura e ritmo visual da seção Sobre e tornar a transição para o vídeo previsível, sem sobreposições baseadas na altura da tela.

## Arquivos previstos

- `src/app/components/about/about.tsx`
- `src/app/components/about/about.css`
- `src/app/components/video/video.tsx`
- `src/app/components/video/video.css`

## Passos de implementação — Sobre

1. Aplicar `.home-content`.
2. Remover margem horizontal fixa de `5rem`.
3. Usar duas colunas equilibradas no desktop.
4. Empilhar título e conteúdo no mobile.
5. Limitar os parágrafos a aproximadamente 60 caracteres por linha.
6. Ajustar tamanho de título e texto com `clamp()`.
7. Manter CTA próximo ao texto relacionado.
8. Substituir `<a>` por `Link` do Next quando aplicável.
9. Preservar animação de entrada sem esconder conteúdo quando JavaScript falhar.

## Passos de implementação — Vídeo

1. Remover `margin-top: -30vh` e `margin-bottom: -60vh`.
2. Criar wrapper que reserve o espaço real do vídeo.
3. Caso exista sobreposição visual, limitar o deslocamento com valor previsível.
4. Manter proporção `16 / 9`.
5. Adicionar poster para o estado anterior ao carregamento.
6. Alterar preload para `metadata`.
7. Adicionar `aria-label` dinâmico ao botão.
8. Atualizar estado ao receber eventos `play`, `pause` e `ended`.
9. Garantir foco visível.
10. Desabilitar autoplay quando movimento reduzido estiver ativo, se necessário.

## Critérios de aceite

- A seção Sobre cresce conforme o conteúdo.
- O texto não fica comprimido por margens fixas no mobile.
- O vídeo não encobre a seção Sobre ou os indicadores.
- O controle informa corretamente reproduzir ou pausar.
- A página continua compreensível se o vídeo não carregar.
- Não existe espaço branco excessivo entre Sobre e vídeo.

## Validação

- Testar conteúdo com 50% mais texto.
- Bloquear o carregamento do vídeo e validar fallback.
- Testar autoplay permitido e bloqueado.
- Testar `prefers-reduced-motion`.
- Testar 360, 390, 768, 1024 e 1440 px.

## Riscos

- Remover margens negativas pode alterar a intenção visual da composição.
- Eventos de autoplay variam por navegador.

## Mitigação

- Recriar a sobreposição com wrapper e deslocamento controlado.
- Sincronizar UI com eventos reais do elemento `video`.

