# TASK-08 — Responsividade e acessibilidade

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** TASK-03 a TASK-07

## Objetivo

Adaptar a composição desktop do PSD para tablet e mobile, mantendo leitura, navegação e operação acessíveis.

## Breakpoints de referência

| Perfil | Resolução de validação |
| --- | --- |
| Desktop do PSD | 1920 × 1080 |
| Desktop comum | 1440 × 1000 |
| Notebook | 1024 × 768 |
| Tablet | 768 × 1024 |
| Mobile principal | 390 × 844 |
| Mobile mínimo | 360 × 800 |

## Implementação

1. Usar `clamp`, grid e flex responsivos; evitar posicionamento absoluto para conteúdo estrutural.
2. No tablet, reduzir colunas e espaçamentos sem alterar a ordem semântica.
3. No mobile, empilhar manifesto e produto em destaque com imagem antes das informações.
4. Transformar miniaturas em faixa horizontal com `overflow-x: auto` e `scroll-snap` quando necessário.
5. Exibir recomendações em duas colunas ou carrossel horizontal, escolhendo a opção com melhor estabilidade e acessibilidade.
6. Tornar botões de produto em largura total no mobile.
7. Reduzir ou ocultar apenas grafismos decorativos que provoquem corte ou sobreposição.
8. Garantir foco visível, ordem de tabulação lógica e alvos interativos de pelo menos 44 × 44 px.
9. Garantir `alt` útil para conteúdo e `alt=""`/`aria-hidden` para decoração.
10. Testar zoom de 200%, fonte ampliada e `prefers-reduced-motion`.

## Critérios de aceite

- Não existe rolagem horizontal da página entre 360 e 1920 px.
- Títulos não colidem com imagens ou grafismos.
- Conteúdo mantém ordem compreensível sem CSS.
- Miniaturas, cards e botões funcionam somente com teclado.
- Foco nunca fica oculto atrás do header.
- Zoom de 200% não elimina ações nem corta textos.
- Contraste atende WCAG AA para texto e controles essenciais.
- A redução de movimento é respeitada.

## Observação

Como o PSD fornecido define somente desktop, diferenças mobile devem ser avaliadas por consistência de marca e usabilidade, não por comparação pixel a pixel inexistente.
