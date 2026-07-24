# TASK-02 — Header responsivo

## Metadados

- **Prioridade:** P1
- **Status:** Não iniciada
- **Dependências:** TASK-01

## Objetivo

Organizar Produtos, logo, conta e carrinho em um header equilibrado, com alinhamento consistente e sem colisões no mobile.

## Arquivos previstos

- `src/components/header/header.tsx`
- `src/components/header/header.css`

## Passos de implementação

1. Aplicar o mesmo container horizontal da Home.
2. Substituir a distribuição atual por um grid de três áreas:
   - Navegação.
   - Marca.
   - Conta e carrinho.
3. Manter o logo centralizado visualmente sem depender exclusivamente de posição absoluta.
4. Definir altura e padding responsivos.
5. Garantir área de toque mínima de 44 × 44 px.
6. Adicionar `aria-label` ao botão de conta.
7. Adicionar descrição acessível ao carrinho.
8. Revisar a representação do carrinho vazio no mobile.
9. Garantir que o badge não se sobreponha ao texto ou a outro ícone.
10. Preservar abertura do menu de usuário e modal de login.

## Critérios de aceite

- Não existe colisão entre botão Produtos, logo e ações em 360 px.
- O logo permanece centralizado em desktop e mobile.
- Conta e carrinho são acessíveis por teclado.
- Badge funciona com zero, um e múltiplos itens.
- Menu de usuário e login mantêm o comportamento atual.

## Validação

- Testar autenticado e não autenticado.
- Testar carrinho com 0, 1 e 99 itens.
- Testar larguras 360, 390, 768, 1024 e 1440 px.
- Navegar usando `Tab`, `Enter` e `Escape`.

## Riscos

- Alterar o layout pode deslocar o Popover.
- O badge pode aumentar a largura das ações.

## Mitigação

- Validar ancoragem do Popover em todos os breakpoints.
- Limitar visualmente valores grandes do badge sem alterar o total real.

