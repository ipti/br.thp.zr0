# TASK-02 — Migrar o catálogo atual para “Listar todos”

## Metadados

- **Prioridade:** P0
- **Status:** Concluída
- **Dependências:** —

## Objetivo

Mover a experiência atual de listagem de `/product` para `/product/all`, preservando busca, categoria, ordenação, paginação, estados vazios e abertura dos detalhes.

## Arquivos previstos

- `src/app/product/page.tsx`
- `src/app/product/all/page.tsx`
- `src/app/product/components/products.tsx`
- `src/app/product/components/product_filter/product_filter.tsx`
- testes relacionados à listagem e aos filtros

## Implementação

1. Criar `src/app/product/all/page.tsx` com a lógica server-side atualmente executada por `/product`.
2. Manter os parâmetros `q`, `page`, `category`, `categoryId` e `sort`.
3. Alterar o gerador de paginação para produzir `/product/all?...`.
4. Alterar `router.replace` dos filtros para `/product/all?...`.
5. Preservar o debounce da busca e a remoção de `page` quando busca ou categoria mudarem.
6. Garantir que o layout compartilhado de `/product` continue envolvendo vitrine, catálogo e detalhes com providers, header e footer.
7. Não mudar o contrato de `getProductsPage`, a aparência dos cards ou regras de filtros nesta task, exceto quando necessário para a nova rota.

## Critérios de aceite

- `/product/all` apresenta os mesmos resultados da listagem atual.
- Busca, filtro, ordenação e paginação modificam somente a URL de `/product/all`.
- Atualizar a página preserva os filtros selecionados.
- Cards continuam abrindo `/product/{uid}`.
- Estado vazio e falha de carregamento permanecem compreensíveis.
- A criação da rota estática `all` não interfere em `/product/[id]`.

## Testes

- Busca com e sem texto.
- Mudança de categoria removendo `page`.
- Ordenação crescente e decrescente.
- Navegação entre páginas.
- Acesso direto a `/product/all` com query string completa.
- Abertura de um produto cujo UID possa ser confundido com segmento de rota.
