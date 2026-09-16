# Manifesto de referência e assets — `/about-us`

## Separação entre páginas

Este manifesto pertence exclusivamente à futura rota `/about-us`. O hero já implementado em `src/app/components/landing/hero/` pertence à landing `/` e não será alterado ou reutilizado automaticamente. A única mudança compartilhada prevista é o header público, na TASK-02.

## Fonte analisada

| Item | Valor | Confiança |
| --- | --- | --- |
| Arquivo original | `C:\Users\TIJONNY\Downloads\THP-ZRO-LP-2026 (3) - MAIN.psd` | Confirmado |
| Dimensão | 1920 × 3736 px, RGB | Confirmado pelo bitmap composto |
| Peso | aproximadamente 98,7 MB | Confirmado |
| Referência versionada | `docs/feature/about-us-psd/reference/psd-preview.jpg` | Confirmado; somente QA |
| Camadas do PSD | Indisponíveis no runtime atual | Confirmado; Pillow expõe somente a composição achatada |

O PSD original não foi copiado para o repositório. A prévia JPEG não deve ser usada como fundo ou como substituta da página; texto e controles serão HTML.

## Medidas da composição desktop

Valores marcados como “medidos” foram lidos na composição achatada de 1920 px. Valores “aproximados” incluem antialias, sombras, conteúdo fotográfico ou limites visuais que impedem determinar uma borda única sem abrir as camadas.

| Área | Medida de referência | Situação |
| --- | --- | --- |
| Canvas | 1920 × 3736 px | Medido |
| Header | cerca de 346 px de altura | Aproximado |
| Hero institucional | cerca de 678 px de altura | Medido pela textura existente de 1920 × 678; início visual próximo de y=346 |
| Fundo após hero | `#f8f8f8` | Medido por amostragem de áreas uniformes |
| Container principal | cerca de 1440 px | Aproximado; margens laterais próximas de 240 px |
| Vitrine | 4 colunas | Medido visualmente |
| Card da vitrine | aproximadamente 344 × 344 px | Aproximado |
| Gap entre cards | aproximadamente 28–32 px | Aproximado |
| Imagem principal | duas colunas próximas de 1:1 | Aproximado |
| Miniaturas | 4 colunas, alinhadas à largura do destaque | Medido visualmente |
| Fechamento | texto e fotografia em duas colunas próximas de 1:1 | Aproximado |

Os tokens correspondentes ficam em `src/app/about-us/about_us.css`. `--about-hero-height` é uma medida desktop de referência, não uma altura fixa para mobile.

## Cores

| Token | Valor inicial | Origem |
| --- | --- | --- |
| `--about-color-header` | `#ffffff` | Medido no header |
| `--about-color-surface` | `#f8f8f8` | Medido no fundo das seções |
| `--about-color-text` | `#111111` | Aproximação do texto antialiasado |
| `--about-color-accent` | `#00493d` | Aproximação do verde dos botões/texto |
| `--about-color-sage` | `#87937d` | Aproximação dos fragmentos decorativos |
| `--about-color-sand` | `#d8cfb4` | Aproximação dos fragmentos decorativos |

As cores aproximadas devem ser refinadas caso o arquivo de identidade ou as camadas do PSD forneçam os valores originais.

## Tipografia

O desenho usa uma sans-serif geométrica. `HurmeGeometricSans1.otf`, já versionada e registrada como `Hurme Geometric Sans 1`, é a candidata visual mais próxima disponível. O runtime não permite confirmar a família gravada nas camadas do PSD; portanto a correspondência permanece aproximada.

O arquivo local expõe um único peso declarado como 400. Antes de simular pesos fortes pelo navegador, conferir se o PSD usa outro arquivo da família. Poppins e Inter permanecem disponíveis para elementos do sistema, mas não foram escolhidas como fonte principal desta página.

## Inventário conferido

| Asset existente | Dimensão | Transparência | Correspondência com o PSD | Uso decidido |
| --- | ---: | --- | --- | --- |
| `src/assets/img/ZR0_logotipo.png` | 1192 × 1232 | Sim | Logo preto compatível | Reutilizar; revisar o grande espaço transparente ao dimensionar |
| `src/assets/img/home/hero/hero_texture.png` | 1920 × 678 | Não, alfa opaco | Textura clara do hero compatível visualmente | Reutilizar somente em `/about-us` após comparação final |
| `src/assets/img/home/pessoas_zr0.svg` | viewBox 709 × 524 | Cantos transparentes | Fotografia do mesmo grupo e enquadramento vistos no fechamento | Reutilizar; corrigir o texto alternativo no novo componente |
| `src/assets/img/home/pingos.svg` | viewBox 1920 × 1980 | Sim | Formas compatíveis, porém cores teal não correspondem diretamente às cores suaves do PSD | Reutilizar apenas com tratamento de cor local comprovado; não editar o original compartilhado |
| `src/assets/img/home/hero/hero_person.png` | 1062 × 586 | Sim | Não corresponde: mulher de roupa xadrez, posicionada com mesa | Manter na landing; proibido usar no hero de `/about-us` |
| `src/assets/img/home/hero/hero_product_table.png` | 567 × 595 | Sim | Não corresponde: mesa pequena em vez da cadeira grande | Manter na landing; proibido usar no hero de `/about-us` |
| `src/assets/img/about.png` | 555 × 540 | Sim | Outra cena, com crianças em sala | Não usar no fechamento deste PSD |
| `src/assets/img/home_left.png` | fotografia de tampinhas | Não | Não aparece isoladamente na composição | Não usar sem nova confirmação |
| `src/assets/img/home_right.png` | fotografia de placas recicladas | Não | Não aparece isoladamente na composição | Não usar sem nova confirmação |

## Exports ainda necessários

Não foi possível obter recortes íntegros a partir do bitmap achatado sem incluir texto, fundo ou partes sobrepostas. A pasta `src/assets/img/about_us/` foi criada para receber estes exports:

| Nome recomendado | Export necessário | Requisitos |
| --- | --- | --- |
| `about_hero_chair.png` | Cadeira grande do lado esquerdo | PNG transparente, sem texto/fundo, resolução mínima igual à área de uso no PSD |
| `about_hero_person.png` | Mulher de vermelho do lado direito | PNG transparente, corpo e cadeira completos conforme a camada, sem textura de fundo |

As fotografias de produtos da vitrine e do destaque devem vir da API. Se a implementação precisar reproduzir exatamente os produtos fotografados no PSD durante a validação, usar dados equivalentes em ambiente de teste; não associar crops do PSD a UIDs incorretos.

## Header para a TASK-02

O desktop apresenta duas faixas dentro de uma região branca de aproximadamente 346 px: a primeira concentra redes, logo e ações; a segunda centraliza os dois menus. Essa medida pertence à composição de 1920 px e não deve virar `--header-height` fixo em todos os breakpoints.

Na TASK-02, medir o elemento renderizado em desktop, tablet e mobile e atualizar offsets sticky/âncoras com tokens `--header-*`. Não alterar `--home-max-width` nem o hero da landing para acomodar o novo header.

## Validação executada

- Abertura do PSD como bitmap composto: 1920 × 3736, RGB.
- Inspeção visual individual dos PNGs candidatos.
- Extração temporária apenas para inspeção dos rasters incorporados em `pessoas_zr0.svg` e `pingos.svg`; os arquivos compartilhados não foram modificados.
- Verificação de dimensão, modo e canal alfa dos PNGs principais.
- Confirmação de que os dois recortes necessários do hero não existem entre os assets atuais.

## Pendências para as próximas tasks

1. Obter os dois exports do hero nas camadas originais do PSD.
2. Confirmar a família e os pesos tipográficos do documento original.
3. Refinar verde, sálvia e bege a partir dos estilos/camadas originais, se disponíveis.
4. Validar o tratamento cromático de `pingos.svg` sem afetar a landing.
