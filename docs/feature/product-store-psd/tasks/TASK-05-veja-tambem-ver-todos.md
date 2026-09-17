# TASK-05 — “Veja também” e “Ver todos”

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** TASK-02, TASK-04

## Objetivo

Construir a grade de recomendações do PSD e conectar a vitrine ao catálogo completo.

## Arquivos previstos

- `src/app/product/page.tsx`
- `src/app/product/components/storefront/related_products.tsx`
- `src/app/product/components/storefront/related_products.css`
- componente compartilhado de card, caso a extração seja necessária
- testes da seção

## Implementação

1. Selecionar até quatro produtos, excluindo o UID do produto em destaque.
2. Exibir imagem, nome e preço de cada item conforme a hierarquia visual do PSD.
3. Fazer cada card abrir `/product/{uid}`.
4. Posicionar “VER TODOS →” ao final da seção, alinhado à direita no desktop.
5. Fazer “Ver todos” apontar para `/product/all`.
6. Reutilizar comportamento existente de imagem e formatação de preço, sem importar estilos incompatíveis da listagem completa.
7. Não incluir avaliação, favorito, selo ou controle adicional que não esteja visível no PSD.
8. Quando houver menos de quatro produtos, renderizar apenas os disponíveis, sem cards vazios artificiais.

## Critérios de aceite

- O destaque não aparece novamente em “Veja também”.
- São exibidos no máximo quatro produtos.
- Nome, preço e link correspondem ao produto de cada card.
- “Ver todos” abre `/product/all`.
- A grade mantém alinhamento visual com o bloco de produto em destaque.
- Imagem ausente e título longo não quebram o card.

## Testes

- Quatro recomendações disponíveis.
- Apenas uma recomendação disponível.
- Produto com imagem ausente.
- Exclusão correta do produto em destaque.
- Navegação do card e do link “Ver todos”.
