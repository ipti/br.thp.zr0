# Tasks de implementação — PRODUCT-STORE-PSD

Caminhos citados são relativos à raiz `br.thp.zr0`.

| Task | Entrega | Status | Prioridade | Dependências |
| --- | --- | --- | --- | --- |
| [01](./TASK-01-referencia-assets-tokens.md) | Referência visual, assets e tokens | Em andamento — preview exportado | P1 | — |
| [02](./TASK-02-migrar-catalogo-listar-todos.md) | Catálogo atual em `/product/all` | Não iniciada | P0 | — |
| [03](./TASK-03-estrutura-hero-manifesto.md) | Estrutura da vitrine, hero e manifesto | Não iniciada | P1 | 01, 02 |
| [04](./TASK-04-produto-destaque-galeria-carrinho.md) | Produto em destaque, galeria e carrinho | Não iniciada | P0 | 03 |
| [05](./TASK-05-veja-tambem-ver-todos.md) | Recomendações e acesso ao catálogo | Não iniciada | P1 | 02, 04 |
| [06](./TASK-06-video-fechamento-institucional.md) | Vídeo e fechamento institucional | Não iniciada | P1 | 01, 03 |
| [07](./TASK-07-navegacao-seo-compatibilidade.md) | Links, redirecionamentos, metadata e sitemap | Não iniciada | P0 | 02, 05 |
| [08](./TASK-08-responsividade-acessibilidade.md) | Adaptação tablet/mobile e acessibilidade | Não iniciada | P1 | 03–07 |
| [09](./TASK-09-testes-validacao-regressao.md) | Testes, comparação visual e regressão | Não iniciada | P0 | 01–08 |

## Ordem sugerida

1. Executar TASK-01 e TASK-02.
2. Construir a composição base na TASK-03.
3. Implementar a experiência comercial nas TASK-04 e TASK-05.
4. Completar a página com a TASK-06.
5. Consolidar URLs e SEO na TASK-07.
6. Refinar responsividade e acessibilidade na TASK-08.
7. Liberar somente após a TASK-09.

## Regra de conclusão

Uma task só pode ser marcada como concluída quando:

- todos os critérios de aceite estiverem atendidos;
- testes e comandos executados estiverem registrados no próprio arquivo;
- divergências conhecidas estiverem documentadas;
- não houver pendência silenciosa de asset ou integração.
