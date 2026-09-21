# Asset Manifest — product-store-psd

Referência ao preview: `psd-preview.jpg` (1920 × 4864 px, JPEG, RGB)

---

## Seções do PSD

### S1 — Header / Navegação

| Elemento | Tipo | Status |
|---|---|---|
| Logo Zr0 (SVG/PNG) | Imagem vetorial | Verificar em `public/` ou `src/assets/` |
| Ícone Facebook | Ícone (SVG) | Já disponível via biblioteca de ícones |
| Ícone Instagram | Ícone (SVG) | Já disponível via biblioteca de ícones |
| Ícone Carrinho | Ícone (SVG) | Já disponível via biblioteca de ícones |
| Ícone Usuário | Ícone (SVG) | Já disponível via biblioteca de ícones |
| Navegação "COMPRE AGORA" | Componente HTML | Implementar via `<nav>` |
| Navegação "CONHEÇA O PROJETO" | Componente HTML | Implementar via `<nav>` |

### S2 — Hero / Headline

| Elemento | Tipo | Status |
|---|---|---|
| Fundo terrazzo/texturizado | Imagem de textura | **Exportação necessária** — background do hero (1920 × ~900 px) |
| Formas orgânicas sálvia (blobs superiores) | SVG / PNG com transparência | **Exportação necessária** — 2 shapes: canto superior esquerdo e direito |
| Formas orgânicas areia (blobs superiores) | SVG / PNG com transparência | **Exportação necessária** — 1–2 shapes nos cantos |
| Texto headline | Texto HTML | `font-family: var(--store-font-heading)`, uppercase, bold |

### S3 — Manifesto / Sobre o Produto

| Elemento | Tipo | Status |
|---|---|---|
| Composição visual do manifesto | Fotografia e grafismos | Extraída do preview em `src/assets/img/product-store/manifesto-visual.jpg` (920 × 800 px) |
| Textos do manifesto | Texto HTML | Corpo em `var(--store-font-body)` |

### S4 — Produto em Destaque (PDP)

| Elemento | Tipo | Status |
|---|---|---|
| Imagem principal do produto (Cadeira) | Fotografia | Provavelmente já presente no CMS/API — confirmar |
| Thumbnails da galeria (4 imagens) | Fotografias | Provavelmente já presentes no CMS/API — confirmar |
| Botão "MAIS DETALHES" | Componente HTML | Estilo outline, `var(--store-border)` |
| Botão "ADICIONAR AO CARRINHO" | Componente HTML | Estilo filled, `var(--store-green)` |
| Ícone carrinho no botão | Ícone (SVG) | Já disponível via biblioteca de ícones |

### S5 — "VEJA TAMBÉM"

| Elemento | Tipo | Status |
|---|---|---|
| Imagens dos 4 produtos relacionados | Fotografias | Provavelmente já presentes no CMS/API — confirmar |
| Link "VER TODOS →" | Componente HTML | Texto + ícone seta |

### S6 — Vídeo

| Elemento | Tipo | Status |
|---|---|---|
| Thumbnail do vídeo | Fotografia / Frame de vídeo | **Exportação necessária** — 1920 × ~720 px |
| Ícone play (círculo branco) | SVG / Componente HTML | Implementar em CSS ou SVG inline |
| Vídeo em si | Arquivo de mídia | Fora do escopo desta task (ver TASK-06) |

### S7 — Fechamento Institucional

| Elemento | Tipo | Status |
|---|---|---|
| Foto grupo/equipe (foto THP) | Fotografia | **Exportação necessária** — ou obter via CMS |
| Logo Zr0 (fechamento) | Mesmo asset de S1 | Reutilizar |
| Tagline "Do descarte à permanência." | Texto HTML | `var(--store-font-body)`, normal weight |

---

## Resumo de status por asset

| Asset | Ação |
|---|---|
| Fundo terrazzo hero | Exportar do PSD — camada de fundo S2 |
| Blobs sálvia (decorativos) | Exportar do PSD — 2–3 variações de shape |
| Blobs areia (decorativos) | Exportar do PSD — 1–2 variações de shape |
| Composição visual do manifesto | Extraída do preview e integrada ao componente |
| Thumbnail vídeo | Exportar do PSD ou obter arquivo de vídeo |
| Foto fechamento (equipe THP) | Exportar do PSD ou obter via CMS |
| Imagens de produtos (Cadeira + relacionados) | Confirmar presença no CMS/API — **não exportar do PSD achatado** |
| Logo Zr0, ícones (carrinho, usuário, social) | Verificar `public/` ou `src/assets/` |

---

## Camadas ocultas — fora do escopo

Atributos de produto não visíveis na composição achatada (variantes de cor, tags de material, metadados de cooperativa) ficam fora do escopo desta task. Esses dados devem vir da API/CMS de produto, não do PSD.
