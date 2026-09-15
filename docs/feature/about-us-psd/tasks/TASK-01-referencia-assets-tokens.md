# TASK-01 — Referência, assets e tokens

## Metadados

- **Prioridade:** P1
- **Status:** Concluída com pendências documentadas de exportação
- **Dependências:** Nenhuma

## Objetivo

Transformar o PSD em especificação verificável e assets reutilizáveis sem reinterpretar o design.

## Arquivos previstos

- `src/assets/img/about_us/`
- `src/app/about-us/about_us.css`
- `docs/feature/about-us-psd/reference/asset-manifest.md`

## Passos de implementação

1. Conferir a composição 1920 × 3736 e medir limites das seções, grid, espaçamentos, raios, cores e tipografia. Registrar valores medidos e estimados separadamente.
2. Inventariar assets existentes e compará-los visualmente com o PSD.
3. Exportar somente assets faltantes, com transparência nos recortes; preservar proporções e qualidade. A cadeira fica à esquerda, a pessoa à direita.
4. Registrar origem, caminho, dimensão e uso de cada asset no manifesto. Não versionar o PSD de aproximadamente 99 MB.
5. Definir tokens `--about-*` no escopo da página e documentar medidas do header para TASK-02.
6. Identificar a fonte do PSD. Se indisponível, registrar a diferença antes de adotar a candidata local.

## Critérios de aceite

- Logo, hero, decoração e comunidade têm correspondência visual conferida ou pendência explícita.
- PNG de recorte não inclui fundo indesejado; imagens mantêm nitidez no tamanho de uso.
- Textos serão HTML, não incorporados em uma captura da tela.
- Tokens não alteram a home, seller ou componentes globais.

## Validação e riscos

Inspeção visual dos exports contra a referência. Camadas/fontes inacessíveis impedem concluir a fidelidade desses itens; registrar exatamente o export necessário. Nenhum teste unitário para arquivos estáticos.

## Resultado

- Tokens locais criados em `src/app/about-us/about_us.css`, sem importar ou modificar o hero da landing.
- Inventário, medidas, cores, tipografia e decisões registrados em `reference/asset-manifest.md`.
- Logo, textura e fotografia da comunidade identificados como reutilizáveis, sujeitos à comparação final.
- Os assets atuais `hero_person.png` e `hero_product_table.png` foram explicitamente rejeitados para `/about-us`, pois pertencem a outra composição.
- A pasta `src/assets/img/about_us/` foi reservada para os dois recortes faltantes: cadeira e mulher de vermelho.
- O PSD e as fontes não expõem metadados de camada no runtime atual; nomes de fonte, cores secundárias e dois recortes permanecem como pendências explícitas, permitidas pelos critérios desta task.
