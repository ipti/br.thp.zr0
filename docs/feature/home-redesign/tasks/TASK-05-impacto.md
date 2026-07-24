# TASK-05 — Indicadores de impacto

## Metadados

- **Prioridade:** P1
- **Status:** Não iniciada
- **Dependências:** TASK-01 e TASK-04

## Objetivo

Apresentar os indicadores de impacto de forma compacta, equilibrada e legível, sem depender de uma seção com altura de viewport.

## Arquivos previstos

- `src/app/components/impact/impact.tsx`
- `src/app/components/impact/impact.css`

## Passos de implementação

1. Remover dependência de `height: 100%` e alinhamento no final da seção.
2. Aplicar padding vertical responsivo.
3. Aplicar `.home-content`.
4. Manter quatro colunas no desktop.
5. Usar grade 2 × 2 em tablet e mobile quando houver espaço.
6. Usar uma coluna somente em larguras realmente restritas.
7. Uniformizar espaçamento entre número e rótulo.
8. Revisar formato dos números:
   - Separador de milhar.
   - Casas decimais.
   - Unidade, quando aplicável.
9. Remover regras duplicadas de `.impact-item`.
10. Consolidar animação em transição ou keyframe, evitando dupla definição.
11. Aplicar movimento reduzido quando solicitado pelo sistema.

## Critérios de aceite

- A seção não ocupa obrigatoriamente uma viewport inteira.
- Os quatro indicadores permanecem visualmente equivalentes.
- Mobile usa grade compacta sempre que possível.
- Números e rótulos não quebram de forma inadequada.
- A animação ocorre uma única vez e não é obrigatória para leitura.

## Validação

- Testar 1440, 1024, 768, 390 e 360 px.
- Testar rótulos 50% maiores.
- Validar contraste do cinza sobre preto.
- Validar movimento reduzido.

## Dependência de conteúdo

Confirmar com produto/negócio:

- Se “200” representa peças, quilos ou outro indicador.
- Se “10.00” é realmente a escala de avaliação desejada.
- Se os valores são fixos ou futuramente virão da API.

