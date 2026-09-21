# TASK-01 — Referência visual, assets e tokens

## Metadados

- **Prioridade:** P1
- **Status:** Concluída
- **Dependências:** —

## Objetivo

Preparar uma referência verificável do PSD e definir os tokens visuais que orientarão todas as outras tasks.

## Arquivos previstos

- `docs/feature/product-store-psd/reference/psd-preview.jpg`
- `docs/feature/product-store-psd/reference/asset-manifest.md`
- `src/app/product/components/storefront/storefront.css` ou arquivo equivalente de tokens locais

## Implementação

1. Exportar uma prévia achatada do PSD em resolução integral e armazená-la em `reference/`.
2. Registrar dimensões, seções, textos, espaçamentos e assets no manifesto.
3. Identificar quais imagens já existem no repositório e quais precisam ser exportadas.
4. Confirmar os tons de verde, fundo, texto, sálvia e areia por amostragem do arquivo.
5. Confirmar Hurme para títulos e Poppins para corpo comparando com as fontes embarcadas.
6. Criar tokens locais `--store-*`; não modificar tokens globais sem necessidade compartilhada comprovada.
7. Registrar que camadas ocultas, incluindo atributos de produto não visíveis na composição achatada, ficam fora do escopo.

## Critérios de aceite

- Existe uma prévia versionada e acessível à equipe.
- O manifesto relaciona cada seção do PSD ao asset ou estratégia de implementação.
- Todo asset ausente está explicitamente marcado como bloqueio, substituição aprovada ou exportação necessária.
- Cores e medidas deixam de ser valores informais espalhados pelos componentes.
- Nenhuma imagem achatada do PSD é usada como substituta da página HTML.

## Validação

Comparar o preview exportado com o PSD aberto e verificar se não houve mudança de perfil de cor, corte ou escala. Registrar no arquivo da task os valores finais dos tokens.

## Progresso registrado

- Preview exportado em `docs/feature/product-store-psd/reference/psd-preview.jpg`.
- Arquivo validado com 1920 × 4864 px, formato JPEG e espaço de cor RGB.
- Inspeção visual confirmou a composição completa, sem cortes aparentes.
- Manifesto de assets criado em `docs/feature/product-store-psd/reference/asset-manifest.md`.
- Tokens locais `--store-*` criados em `src/app/product/components/storefront/storefront.css`.

## Valores finais dos tokens

### Cores
| Token | Valor | Descrição |
|---|---|---|
| `--store-bg` | `#F0EDEA` | Fundo geral — off-white quente |
| `--store-surface` | `#FFFFFF` | Cards e superfícies |
| `--store-text-primary` | `#1C1C1A` | Títulos e labels |
| `--store-text-secondary` | `#4A4A46` | Corpo de texto |
| `--store-text-muted` | `#787870` | Captions e labels secundários |
| `--store-green` | `#2B5C26` | Verde CTA — botão "Adicionar ao Carrinho" |
| `--store-green-hover` | `#234A1E` | Verde CTA hover/active |
| `--store-sage` | `#8FAA87` | Sálvia — blobs decorativos verdes |
| `--store-sand` | `#C8B99A` | Areia — blobs decorativos bege |
| `--store-border` | `#1C1C1A` | Borda forte (thumbnail ativo, outline btn) |
| `--store-border-light` | `#D8D4CE` | Borda suave (separadores) |

### Tipografia
| Token | Valor |
|---|---|
| `--store-font-heading` | `'Hurme Geometric Sans 1', sans-serif` |
| `--store-font-body` | `'Poppins Regular', sans-serif` |

Ambas as fontes já estão embarcadas no projeto via `@font-face` em `globals.css`. Confirmado: Hurme para títulos/labels uppercase, Poppins para corpo e botões.

### Assets com exportação necessária
Ver detalhes completos em `reference/asset-manifest.md`. Resumo dos bloqueios:
- Fundo texturizado (terrazzo) do hero
- Blobs orgânicos sálvia e areia (2–3 variações cada)
- Imagem circular da seção manifesto
- Thumbnail do player de vídeo
- Foto de fechamento institucional (equipe THP)
