# Especificação de UX e IHC — Carrinho e checkout

## 1. Diagnóstico da experiência atual

### Problemas críticos

| Evidência atual | Impacto para o cliente | Princípio de IHC afetado | Prioridade |
|---|---|---|---:|
| O botão “Continuar” pode permanecer ativo sem item selecionado | avanço para uma jornada inválida | prevenção de erros | P0 |
| O stepper e `?index=` permitem tentar acessar etapas futuras | estado incompleto, erro tardio e perda de confiança | controle, consistência | P0 |
| “Fazer encomenda” tem peso visual próximo ao fluxo principal dentro do item | impressão de que encomenda complementa o carrinho | correspondência com o negócio | P0 |
| O limite do botão `+` não explica estoque disponível | controle parece quebrado | visibilidade do estado | P0 |
| Remoção ocorre por um ícone `X`, sem rótulo, confirmação ou desfazer | exclusão acidental e baixa acessibilidade | reconhecimento e recuperação | P1 |
| Checkbox por item não possui contexto textual claro | seleção e total podem divergir sem o usuário perceber | visibilidade e consistência | P1 |
| Resumo mostra apenas “valor total dos produtos” na primeira etapa | custo final pouco previsível | transparência | P1 |
| Valores usam `R$200.00` e textos têm inconsistências | leitura inadequada ao locale e menor credibilidade | consistência | P1 |
| Feedback depende de modais bloqueantes (`Swal`) | interrompe contexto e pode ser frágil com teclado/leitor de tela | diálogo e recuperação | P1 |
| Hierarquia tipográfica, áreas vazias e alinhamentos não formam um grid comum | varredura lenta e pouca relação item–resumo | carga cognitiva | P1 |

### Heurísticas aplicadas

A proposta segue as heurísticas de Nielsen, especialmente visibilidade do estado, correspondência com o mundo real, prevenção/recuperação de erros, consistência, reconhecimento em vez de memorização e eficiência. Também adota WCAG 2.2 AA como referência: foco visível, operação por teclado, alvos mínimos de 44 × 44 px, sem dependência exclusiva de cor e reflow com zoom de 200%.

## 2. Modelo mental e regras visíveis

### Mensagem de contexto

No topo da primeira etapa:

> Carrinho de pronta entrega  
> Itens disponíveis em estoque para envio. Precisa de outra quantidade? A encomenda é feita em um pedido separado.

O link “Entenda a encomenda” pode explicar a diferença. A ação por produto deve ser secundária, textual e rotulada **“Encomendar este produto separadamente”**. Antes de sair, se houver alterações ainda não persistidas, confirmar a troca de jornada.

### Regras que a interface deve garantir

1. O checkout contém somente itens de Pronta Entrega.
2. A quantidade máxima é o estoque agregado disponível no momento.
3. Ao atingir o máximo, o `+` fica desabilitado e aparece “Máximo disponível: N”.
4. Redução de estoque durante a jornada gera aviso inline e exige revisão antes de prosseguir.
5. Só itens selecionados entram no subtotal, frete e pedido.
6. Nenhuma etapa futura abre sem que as anteriores estejam válidas.
7. A reserva de estoque acontece após todas as opções de entrega estarem selecionadas.
8. Pronta Entrega nunca migra ou completa automaticamente a quantidade por Encomenda.
9. Preços usam `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

## 3. Arquitetura da jornada

```text
Carrinho
  -> autenticação, se necessária
  -> Endereço
  -> Entrega + reserva de estoque
  -> Revisão e pagamento
  -> Resultado do pedido/pagamento
```

Para manter compatibilidade, a implementação pode conservar inicialmente cinco estados internos. Para o usuário, recomenda-se renomear:

1. Carrinho
2. Endereço
3. Entrega
4. Revisão
5. Pagamento

Etapas concluídas podem ser revisitadas. Etapas futuras ficam não interativas. Alterar item, quantidade ou endereço invalida entrega e reserva dependentes, com aviso explícito.

## 4. Wireframes de baixa fidelidade

### Desktop — Carrinho

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Carrinho de pronta entrega                         Etapa 1 de 5      │
│ Itens em estoque para envio. [Entenda a encomenda]                  │
│ ① Carrinho ── ② Endereço ── ③ Entrega ── ④ Revisão ── ⑤ Pagamento   │
├──────────────────────────────────────────────┬───────────────────────┤
│ [✓] Selecionar todos (2)                     │ Resumo                │
│                                              │ 2 itens selecionados  │
│ ┌──────────────────────────────────────────┐ │ Subtotal     R$ 400,00│
│ │ [✓] [foto] Cadeira                       │ │ Frete  Calculado depois│
│ │            R$ 200,00 por unidade         │ │ ───────────────────── │
│ │            [−] 2 [+] Máx. 8              │ │ Total parcial R$400,00│
│ │ [Remover] [Encomendar separadamente ↗]   │ │ [Continuar p/endereço]│
│ └──────────────────────────────────────────┘ │ Compra segura          │
│ [Continuar comprando]                        │                       │
└──────────────────────────────────────────────┴───────────────────────┘
```

O resumo fica `sticky` no desktop, sem ultrapassar a viewport. O CTA informa o destino e fica desabilitado com explicação quando não há seleção.

### Mobile — Carrinho

```text
┌─────────────────────────────┐
│ Carrinho de pronta entrega  │
│ Etapa 1 de 5                │
│ ① ━ ② ━ ③ ━ ④ ━ ⑤          │
│ [✓] Selecionar todos        │
│ ┌─────────────────────────┐ │
│ │ [✓] [foto] Cadeira      │ │
│ │ R$ 200,00 / unidade     │ │
│ │ [−] 2 [+]  Máx. 8       │ │
│ │ Total do item R$ 400,00 │ │
│ │ Remover                 │ │
│ │ Encomendar separadamente│ │
│ └─────────────────────────┘ │
│                             │
│ Subtotal         R$ 400,00 │
│ [Continuar para endereço]  │
└─────────────────────────────┘
```

No mobile, o CTA primário pode ficar em uma barra inferior fixa com safe area, desde que não cubra o último conteúdo nem o widget de atendimento.

## 5. Comportamento por etapa

### 5.1 Carrinho

- Título específico “Carrinho de pronta entrega”, quantidade de itens e orientação curta.
- “Selecionar todos” com estado marcado, desmarcado e indeterminado.
- Cada item mostra imagem, nome, variação quando houver, preço unitário, quantidade, estoque e subtotal.
- Controle de quantidade com rótulo acessível, campo numérico ou valor anunciado e feedback de salvamento.
- Ao remover, retirar imediatamente e mostrar toast: “Cadeira removida. Desfazer”.
- Se a remoção for a última, mostrar estado vazio com CTA “Ver produtos”.
- Encomenda é link secundário com ícone de abrir jornada; texto deixa claro que é outro pedido.
- Falha ao sincronizar quantidade mantém o valor anterior e informa o motivo junto ao controle.

### 5.2 Endereço

- Cabeçalho “Onde você quer receber?” e resumo compacto dos itens.
- Cards inteiros selecionáveis por rádio, não apenas uma pequena área interna.
- Endereço selecionado com borda, ícone e texto — não somente cor.
- “Adicionar novo endereço” como ação secundária e modal com foco gerenciado.
- Erro “Selecione um endereço para continuar” junto ao grupo e com foco no primeiro erro.
- Voltar preserva seleção e não invalida dados desnecessariamente.

### 5.3 Entrega

- Agrupar opções por produto/remessa, explicando quando um pedido será enviado por mais de uma oficina.
- Cada opção mostra transportadora, serviço, previsão em dias úteis e custo.
- Uma opção obrigatória por remessa; o CTA informa quantas faltam: “Selecione a entrega de 1 item”.
- Exibir subtotal, frete e total atualizado no resumo.
- Ao reservar, mostrar progresso no próprio CTA e bloquear duplo envio.
- Estoque insuficiente aparece inline no item afetado, com ações “Ajustar quantidade” e “Encomendar separadamente”.

### 5.4 Revisão

- Ordem de leitura: contato, endereço, itens, entregas, cupom, pagamento, valores.
- Cada bloco tem ação “Editar” que retorna à etapa correspondente.
- Cupom possui estados aplicando, aplicado, inválido e removível; erro não apaga o código digitado.
- Método de pagamento usa opções visíveis (rádio/cards), evitando dropdown para uma escolha curta.
- CTA: “Finalizar pedido” ou “Ir para pagamento”, conforme o comportamento real; nunca “Continuar e finalizar” ambíguo.
- Antes do envio, apresentar termos/políticas aplicáveis com link, sem checkbox pré-marcado.

### 5.5 Pagamento/resultado

- Não permitir “Voltar” para recriar pedido já emitido.
- Exibir estado inequívoco: aprovado, em processamento, pendente ou falhou.
- Informar número do pedido, próximos passos e ações “Ver pedido” e “Continuar comprando”.
- Falha de pagamento preserva o pedido e oferece nova tentativa segura, quando a regra permitir.

## 6. Estados obrigatórios

- Carregamento inicial com skeleton que preserve o layout.
- Carrinho vazio.
- Item indisponível.
- Estoque alterado/quantidade reduzida.
- Nenhum item selecionado.
- Usuário não autenticado e sessão expirada.
- Lista de endereços vazia, carregando e com erro.
- Frete calculando, sem opção, parcial e com erro.
- Reserva em curso, expirada e indisponível por concorrência.
- Cupom aplicado, inválido, expirado e removido.
- Criação do pedido em curso, sucesso, falha recuperável e resposta desconhecida.
- Pagamento aprovado, pendente, recusado e em processamento.

## 7. Conteúdo e linguagem

- Preferir verbos e destinos: “Continuar para endereço”, “Calcular entrega”, “Revisar pedido”.
- Evitar “Continuar” sem contexto, `X` sem rótulo e mensagens técnicas.
- Corrigir acentuação: “Endereço”, “Confirmação”, “Não foi possível”, “Sessão expirada”.
- Usar “item” para produto no carrinho e “remessa” quando uma oficina/origem gera entrega própria.
- Informar estimativas como estimativas e dias úteis como dias úteis.

## 8. Acessibilidade e responsividade

- Um único `h1` por etapa; subtítulos em ordem semântica.
- Stepper com etapa atual (`aria-current="step"`) e estados concluído/futuro anunciados.
- Checkboxes, rádios e quantidade com `label`/nome acessível.
- Ícones decorativos com `aria-hidden`; botões por ícone com `aria-label`.
- Atualizações de total, estoque e toast em região `aria-live` apropriada.
- Foco movido para título/erro após mudança de etapa ou falha.
- Contraste mínimo de 4,5:1 para texto normal e 3:1 para controles/estados.
- Alvo interativo mínimo de 44 × 44 px e distância segura entre remover e quantidade.
- Reflow sem rolagem horizontal em 320/360/390 px e zoom de 200%.
- Não depender de hover; foco visível em todos os controles.

## 9. Métricas de sucesso

- Taxa de avanço Carrinho → Endereço.
- Taxa de conclusão por etapa e abandono por motivo.
- Incidência de “nenhum item selecionado”.
- Erros de estoque/reserva por sessão.
- Alterações de quantidade que falham.
- Tempo mediano por etapa.
- Uso de “Encomendar separadamente”, sem interpretar essa saída como abandono comum.
- Erros de pagamento e retentativas bem-sucedidas.

Eventos não devem registrar endereço, telefone, token ou outros dados pessoais/sensíveis.

## 10. Critérios de aceite funcionais

1. Não é possível avançar do carrinho sem ao menos um item selecionado e válido.
2. Não é possível abrir etapa futura por clique, URL ou restauração de estado sem cumprir pré-requisitos.
3. Quantidade nunca ultrapassa o estoque retornado pela fonte oficial e o limite é explicado.
4. Alterar quantidade/item/endereço invalida somente dados dependentes.
5. O total usa apenas itens selecionados e é consistente em todas as etapas.
6. Encomenda abre rota e estado independentes; nenhum dado do carrinho é convertido automaticamente.
7. Remoção oferece desfazer e possui nome acessível.
8. Falhas de rede/estoque são contextualizadas e possuem ação de recuperação.
9. O resumo discrimina subtotal, frete, desconto e total quando cada valor estiver disponível.
10. A jornada funciona com teclado, leitor de tela, zoom de 200% e largura de 360 px.
