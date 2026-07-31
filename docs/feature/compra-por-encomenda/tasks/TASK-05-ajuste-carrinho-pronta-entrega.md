# TASK-05 - Ajuste do carrinho de Pronta Entrega para usar inventory

## Metadados

- **Prioridade:** P1
- **Status:** Não iniciada
- **Dependências:** TASK-01
- **Bloqueia:** TASK-07

> **Nota de escopo:** a versão anterior desta tarefa ("Tela de pedido com múltiplas remessas e status de produção") assumia que um pedido podia misturar Pronta Entrega e Encomenda, exigindo timeline de 5 passos e datas estimadas dentro do mesmo pedido. Isso foi descartado e passou a ser tratado inteiramente pela TASK-04 (que cobre isso no nível do pedido de Encomenda). Esta tarefa foi redefinida com um escopo muito menor: o carrinho de Pronta Entrega **permanece estruturalmente como está hoje** — a única mudança é garantir que ele continue funcionando sem regressão depois que o backend migrar a fonte de estoque para `inventory`, e, opcionalmente, oferecer um atalho de navegação para a jornada de Encomenda quando o estoque não for suficiente.

## Objetivo

Confirmar que o carrinho de Pronta Entrega (`Delivery`, `CardDelivery`, `Finish` — `src/app/cart/components/**`) continua funcionando exatamente como hoje depois que o backend passar a calcular estoque disponível via `inventory` (agregado entre OTs) em vez de `transformation_workshop_product`, e adicionar um link opcional para a jornada de Encomenda (`/production-order`) no aviso de "estoque insuficiente" já existente.

## Escopo

- Validar que nenhuma tela do carrinho quebra quando o backend retornar disponibilidade agregada de `inventory` (o shape de resposta não muda, só a fonte de dado é diferente no backend).
- No aviso de "estoque insuficiente" já existente hoje (`Swal.fire` em `delivery.tsx:74-81` ou equivalente), adicionar, quando fizer sentido, um link/CTA para `/production-order?productId=...` — apenas navegação, sem passar nenhum estado entre os dois fluxos.
- **Fora de escopo:** qualquer mudança estrutural no wizard, na store (`useCartStepsStore`), ou na lógica de seleção de frete existente; a jornada de Encomenda em si (TASK-01 a TASK-04); timeline/status de produção (não se aplica a este fluxo).

## Arquivos previstos

- `src/app/cart/components/delivery/delivery.tsx` (revisão, mudança pontual) — link opcional no aviso de estoque insuficiente.
- Demais arquivos de `src/app/cart/components/**` — apenas revisão/teste de regressão, sem alteração de código esperada.

## Passos de implementação

1. Revisar `delivery.tsx` e confirmar que a chamada de frete existente (`ShippingCalculateAction`) não assume nada sobre a origem do estoque no backend — deve continuar funcionando sem alteração de código.
2. No bloco de tratamento de erro de estoque insuficiente, adicionar um link textual (ex.: "Não encontrou a quantidade que precisa? Faça uma encomenda.") apontando para `/production-order?productId=${productId}`.
3. Rodar a suíte de regressão manual do carrinho completo (Carrinho → Endereço → Entrega → Confirmação → Pagamento) para confirmar ausência de qualquer diferença de comportamento.

## Critérios de aceite

- O carrinho de Pronta Entrega funciona de ponta a ponta sem nenhuma alteração de comportamento perceptível.
- O aviso de estoque insuficiente, quando exibido, oferece um link opcional para a jornada de Encomenda.
- Nenhum estado é compartilhado entre o carrinho e a jornada de Encomenda além da navegação simples via URL.

## Validação

- Teste manual do fluxo completo do carrinho, com produto com estoque suficiente e com estoque insuficiente.
- Confirmar que o link para `/production-order` navega corretamente e que a jornada de Encomenda funciona de forma independente a partir daí.
- Rodar ESLint e build do Next.js.

## Riscos

- Baixo — esta tarefa não altera lógica de negócio do carrinho, apenas confirma ausência de regressão e adiciona um link de navegação.

## Mitigação

- Tratar esta tarefa como validação/regressão primeiro, mudança de código depois (o link é a única alteração real esperada).
