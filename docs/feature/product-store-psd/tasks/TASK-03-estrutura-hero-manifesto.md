# TASK-03 — Estrutura da vitrine, hero e manifesto

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** TASK-01, TASK-02

## Objetivo

Criar a nova composição de `/product` e implementar as duas primeiras seções do PSD: hero texturizado e manifesto editorial.

## Arquivos previstos

- `src/app/product/page.tsx`
- `src/app/product/components/storefront/store_hero.tsx`
- `src/app/product/components/storefront/store_hero.css`
- `src/app/product/components/storefront/store_manifesto.tsx`
- `src/app/product/components/storefront/store_manifesto.css`

## Implementação

1. Substituir o conteúdo de `/product` pela composição da vitrine, mantendo a rota como Server Component sempre que possível.
2. Criar hero com `hero_texture.png`, altura proporcional ao PSD e título centralizado em caixa alta.
3. Implementar o título “DESIGN QUE TRANSFORMA MUITO MAIS QUE RESÍDUOS.” com largura controlada para manter as quebras do desktop.
4. Criar manifesto em duas colunas: título e três parágrafos à esquerda; fotografia circular à direita.
5. Reproduzir grafismos pretos e fragmentos coloridos com SVG/CSS ou assets exportados, sem prejudicar a leitura.
6. Aplicar Hurme nos títulos e Poppins no corpo.
7. Usar elementos semânticos `main`, `section`, `h1` e `h2`, com apenas um `h1` na página.
8. Manter componentes exclusivamente decorativos com `aria-hidden="true"`.

## Critérios de aceite

- A ordem, proporção e alinhamento das duas seções correspondem ao PSD em 1920 px.
- O hero começa imediatamente após o header compartilhado, sem sobreposição ou faixa inesperada.
- O manifesto mantém texto legível e imagem sem distorção.
- Elementos decorativos não criam rolagem horizontal.
- Ausência da fotografia específica não é ocultada: usar apenas fallback aprovado e registrar a divergência.

## Fora do escopo

- Produto em destaque.
- Recomendações.
- Vídeo e fechamento.
- Ajuste fino de mobile, tratado na TASK-08.
