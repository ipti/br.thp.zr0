# TASK-06 — Vídeo e fechamento institucional

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** TASK-01, TASK-03

## Objetivo

Implementar as duas últimas seções do PSD sem herdar regras de posicionamento específicas da Home.

## Arquivos previstos

- `src/app/product/components/storefront/store_video.tsx`
- `src/app/product/components/storefront/store_video.css`
- `src/app/product/components/storefront/store_closing.tsx`
- `src/app/product/components/storefront/store_closing.css`
- `src/app/product/page.tsx`

## Implementação

1. Criar um bloco de vídeo largo com proporção estável e botão de reprodução central.
2. Confirmar se o vídeo remoto existente corresponde ao conteúdo do PSD.
3. Usar poster exportado quando necessário para reproduzir o frame de referência.
4. Oferecer controles acessíveis e não iniciar áudio automaticamente.
5. Respeitar `prefers-reduced-motion` e evitar reprodução automática obrigatória.
6. Criar o fechamento em duas colunas: mensagem/logotipo à esquerda e imagem institucional à direita.
7. Reutilizar `pessoas_zr0.svg` ou o componente de fechamento de About somente se a estrutura visual e a semântica forem compatíveis.
8. Não reutilizar diretamente margens negativas ou alturas artificiais do componente de vídeo da Home.

## Critérios de aceite

- Vídeo e fechamento aparecem na mesma ordem e proporção geral do PSD.
- O player pode ser operado por teclado.
- O botão de reprodução possui nome acessível.
- Falha do vídeo mantém poster e mensagem/fallback utilizável.
- O fechamento não corta texto ou imagem.
- Não existem grandes espaços vazios produzidos por margens negativas.

## Validação

Testar vídeo carregado, erro de rede, teclado, movimento reduzido e redimensionamento da janela. Comparar o fechamento com a seção equivalente já implementada em About para decidir entre reutilização e extração de componente compartilhado.
