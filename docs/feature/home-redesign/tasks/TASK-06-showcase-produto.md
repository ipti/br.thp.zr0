# TASK-06 — Showcase de produto

## Metadados

- **Prioridade:** P0
- **Status:** Não iniciada
- **Dependências:** TASK-01

## Objetivo

Usar melhor a largura disponível e apresentar imagem, miniaturas, informações e CTAs do produto de forma consistente em desktop e mobile.

## Arquivos previstos

- `src/app/components/product/product.tsx`
- `src/app/components/product/product.css`
- `src/app/components/product/details_product/details_product.tsx`
- `src/app/components/product/details_product/details_product.css`

## Passos de implementação — Estrutura

1. Aplicar `.home-content`.
2. Trocar o grid por:
   - Desktop: `minmax(0, 1fr) 160px`.
   - Mobile: uma coluna.
3. Remover frações menores que `1fr` que deixam espaço sem uso.
4. Ajustar imagem principal com `aspect-ratio`.
5. Evitar altura fixa de 500 px no mobile.
6. Agrupar imagem e detalhes em uma unidade visual.

## Passos de implementação — Galeria

1. Tornar miniaturas botões, não imagens clicáveis isoladas.
2. Adicionar estado visual da miniatura selecionada.
3. Desktop: coluna lateral com tamanho consistente.
4. Mobile: trilho horizontal rolável.
5. Garantir foco e descrição acessível.
6. Usar chave estável baseada no identificador do produto.
7. Tratar produto sem imagem com fallback.

## Passos de implementação — Detalhes e ações

1. Manter nome, avaliação e preço alinhados sem colisão.
2. Permitir quebra adequada para nomes e preços longos.
3. Garantir que descrição não empurre ações para fora da tela.
4. Corrigir CTA mobile para mostrar “Ver detalhes”.
5. Remover ícone de carrinho quando a ação for abrir detalhes.
6. Manter `/product/{uid}` como destino.
7. Posicionar “Ver todos os produtos” após galeria ou conteúdo, conforme breakpoint.
8. Garantir distância segura do widget de atendimento.

## Critérios de aceite

- O grid utiliza toda a largura do container.
- No desktop, a galeria permanece alinhada à imagem principal.
- No mobile, miniaturas são horizontais e não deixam metade da tela vazia.
- O CTA mostra “Ver detalhes” em todas as resoluções.
- Produto sem imagem não quebra a seção.
- Produto com descrição longa permanece legível.
- Selecionar uma miniatura atualiza o produto em destaque.

## Validação

- Testar lista vazia, um produto e oito produtos.
- Testar produto sem imagem.
- Testar nome com mais de 50 caracteres.
- Testar preço com cinco ou mais dígitos.
- Testar 360, 390, 768, 1024 e 1440 px.
- Testar teclado e leitor de tela nas miniaturas.

## Riscos

- Imagens remotas podem não ser aceitas pelo `next/image`.
- O componente de detalhes é compartilhado com a página de produto.

## Mitigação

- Verificar configuração de imagens remotas antes da migração.
- Condicionar estilos e ações explicitamente pelo contexto `home`.

