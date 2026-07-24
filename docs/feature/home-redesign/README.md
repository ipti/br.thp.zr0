# Modernização visual e responsiva da Home

## Identificação

- **Feature:** HOME-REDESIGN
- **Status:** Planejada
- **Área:** E-commerce / Home pública
- **Rota:** `/`
- **Objetivo:** Melhorar hierarquia visual, alinhamentos, responsividade, acessibilidade e desempenho da Home sem alterar suas regras comerciais.

## Documentos

- [História funcional](./historia-funcional.md)
- [História técnica](./historia-tecnica.md)
- [Plano de tarefas](./tasks/README.md)

## Problemas que motivam a feature

- O hero perde legibilidade e proporção em telas pequenas.
- Seções de conteúdo utilizam altura fixa de `100vh`, causando excesso de espaço no desktop e conteúdo apertado no mobile.
- O vídeo depende de margens negativas em unidades de viewport para sobrepor a seção de impacto.
- O showcase de produto utiliza colunas que não ocupam toda a largura disponível.
- A galeria de produtos fica vertical e desalinhada no mobile.
- O CTA do produto perde o texto “Ver detalhes” no mobile.
- Header, conteúdo principal e footer utilizam larguras máximas diferentes.
- O widget de atendimento pode cobrir informações e ações importantes.
- Existem inconsistências em variáveis e seletores CSS globais.
- A imagem principal e o vídeo podem ser otimizados para melhorar o carregamento inicial.

## Resultado esperado

A Home deve apresentar:

- Uma composição visual consistente entre desktop, tablet e mobile.
- Conteúdo alinhado em um mesmo grid.
- Seções com ritmo vertical previsível.
- CTAs legíveis e sempre acessíveis.
- Produto em destaque com imagem, informações e miniaturas bem distribuídas.
- Melhor comportamento de carregamento e menor risco de layout shift.
- Navegação por teclado e suporte adequado a tecnologias assistivas.

## Fora do escopo

- Alteração da API de produtos.
- Alteração das regras do carrinho, autenticação ou checkout.
- Criação de um novo CMS.
- Redefinição da identidade visual da ZR0.
- Alteração do catálogo ou das categorias de produtos.

## Ordem recomendada

1. Fundação de layout e tokens.
2. Header e hero.
3. About, vídeo e impacto.
4. Showcase de produto.
5. Footer e convivência com o chat.
6. Acessibilidade e performance.
7. Validação visual e regressão.

