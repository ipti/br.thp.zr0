# TASK-07 — Navegação, SEO e compatibilidade de URLs

## Metadados

- **Prioridade:** P0
- **Status:** Concluída
- **Dependências:** TASK-02, TASK-05

## Objetivo

Atualizar todos os pontos de entrada da loja e preservar links antigos após a separação entre vitrine e catálogo.

## Arquivos previstos

- `src/app/product/page.tsx`
- `src/components/header/**`
- `src/components/footer/**`
- componentes da Home e About que apontam para `/product`
- `src/app/sitemap.ts`
- metadata das rotas de produto
- testes de navegação e redirecionamento

## Implementação

1. Manter a entrada geral “Produtos” apontando para `/product` quando seu sentido for abrir a vitrine.
2. Alterar “Todos os produtos” no header para `/product/all`.
3. Alterar “Ver todos” da Home, About e nova vitrine para `/product/all`.
4. Alterar links de categoria do footer para `/product/all?category=...` ou parâmetro efetivamente usado pela listagem.
5. Em `/product`, detectar `q`, `page`, `category`, `categoryId` e `sort`; redirecionar para `/product/all` preservando valores e codificação.
6. Não redirecionar `/product` sem query de catálogo.
7. Definir metadata própria para a vitrine e para o catálogo completo.
8. Adicionar ambas as rotas ao sitemap com canonicals corretos.
9. Revisar breadcrumb do detalhe: “Produtos” pode levar à vitrine; oferecer “Todos os produtos” adicional somente se não poluir a composição.

## Critérios de aceite

- Nenhum link de “Todos os produtos” leva por engano à vitrine.
- `/product?q=mesa&page=2` termina em `/product/all?q=mesa&page=2`.
- Parâmetros desconhecidos não causam loop de redirecionamento.
- Vitrine, catálogo e detalhe possuem títulos e descrições distintos.
- Sitemap contém `/product`, `/product/all` e detalhes de produto conforme a estratégia existente.
- Não existem links internos quebrados para a rota antiga.

## Validação

Usar busca textual no repositório por `href="/product"`, `` `/product?` `` e `router.replace('/product` para revisar todos os consumidores. Testar URLs com caracteres acentuados, múltiplos filtros e acesso direto pelo navegador.
