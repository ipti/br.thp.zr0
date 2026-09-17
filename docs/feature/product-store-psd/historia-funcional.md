# História funcional — Loja de produtos

## História

Como visitante da ZR0, quero entrar em uma página de produtos que apresente a proposta da marca, destaque um produto e sugira outros itens, para que eu consiga descobrir o catálogo antes de acessar a listagem completa ou comprar.

Como visitante que já sabe o que procura, quero acessar “Todos os produtos”, pesquisar, filtrar, ordenar e paginar o catálogo, sem perder as funcionalidades da tela atual.

## Jornada principal

1. O visitante acessa `/product`.
2. O hero comunica a proposta de transformação de resíduos.
3. O bloco editorial explica como os produtos são concebidos.
4. O visitante analisa um produto em destaque e alterna suas imagens.
5. O visitante abre os detalhes ou adiciona uma unidade ao carrinho.
6. Em “Veja também”, pode abrir um dos quatro produtos recomendados.
7. Em “Ver todos”, segue para `/product/all`.
8. A página encerra com vídeo e mensagem institucional.

## Jornada do catálogo completo

1. O visitante acessa `/product/all` pelo header, pelo footer ou por “Ver todos”.
2. Pesquisa pelo nome ou descrição.
3. Filtra por categoria.
4. Ordena os resultados.
5. Navega entre as páginas.
6. Abre `/product/[id]` para ver detalhes.

## Estados obrigatórios

- Produto em destaque disponível e com imagens.
- Produto em destaque sem imagem.
- Produto em destaque sem estoque.
- Menos de quatro imagens na galeria.
- Menos de quatro recomendações.
- Lista de produtos vazia.
- API indisponível.
- Vídeo disponível e indisponível.
- Usuário autenticado e não autenticado.
- Carrinho vazio e com quantidade próxima do estoque disponível.

## Regras funcionais

- “Mais detalhes” abre `/product/{uid}`.
- “Adicionar ao carrinho” adiciona uma unidade do produto em destaque respeitando o estoque e o estado atual do carrinho.
- As miniaturas alteram somente a imagem ativa do mesmo produto.
- “Veja também” não repete o produto em destaque.
- “Ver todos” abre `/product/all`.
- Parâmetros antigos de catálogo em `/product` devem ser preservados ao redirecionar para `/product/all`.
- O catálogo completo deve manter comportamento e resultados equivalentes aos atuais.

## Critérios gerais de aceite

- A vitrine segue a mesma ordem visual do PSD.
- Todas as informações comerciais exibidas correspondem aos dados da API.
- Nenhum CTA aponta para rota inexistente.
- A listagem completa mantém busca, filtros, ordenação e paginação.
- A tela funciona com teclado, zoom de 200% e larguras a partir de 360 px.
