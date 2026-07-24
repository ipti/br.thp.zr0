# TASK-09 — Validação e regressão

## Metadados

- **Prioridade:** P0
- **Status:** Não iniciada
- **Dependências:** TASK-01 a TASK-08

## Objetivo

Validar a entrega completa, registrar evidências e impedir regressões na Home e nas rotas que compartilham componentes globais.

## Validação

### Matriz de resoluções

| Perfil | Resolução |
|---|---|
| Desktop amplo | 1440 × 1000 |
| Desktop compacto | 1024 × 768 |
| Tablet | 768 × 1024 |
| Mobile principal | 390 × 844 |
| Mobile mínimo | 360 × 800 |

### Matriz de estados

- Visitante autenticado.
- Visitante não autenticado.
- Carrinho vazio.
- Carrinho com um item.
- Carrinho com quantidade alta.
- API de produtos disponível.
- API de produtos indisponível.
- Produto sem imagem.
- Produto com descrição longa.
- Vídeo disponível.
- Vídeo indisponível.
- Widget de atendimento aberto e fechado.
- Movimento reduzido ativado.

### Passos de validação funcional

1. Abrir a Home.
2. Validar header e suas ações.
3. Acionar CTA do hero.
4. Voltar e navegar até Sobre.
5. Acionar “Saiba mais”.
6. Reproduzir e pausar o vídeo.
7. Conferir os quatro indicadores.
8. Selecionar diferentes produtos pelas miniaturas.
9. Acionar “Ver detalhes”.
10. Acionar “Ver todos os produtos”.
11. Navegar pelos links do footer.
12. Abrir o Chatwoot e repetir ações próximas ao canto inferior direito.

### Passos de validação técnica

1. Executar ESLint nos arquivos alterados.
2. Executar build do Next.js.
3. Registrar erros preexistentes separadamente.
4. Confirmar ausência de novos erros relacionados à feature.
5. Executar Lighthouse desktop e mobile.
6. Testar navegação somente por teclado.
7. Testar zoom de 200%.
8. Inspecionar ausência de rolagem horizontal.
9. Verificar console do navegador.
10. Verificar requisições de imagem e vídeo.

### Regressão mínima

Validar:

- `/product`
- `/product/{uid}`
- `/cart`
- `/auth/login`
- Menu de usuário
- Modal de login
- Carrinho no header

### Evidências obrigatórias

- Screenshot antes e depois para cada resolução.
- Lighthouse antes e depois.
- Lista de arquivos alterados.
- Resultado do lint.
- Resultado do build.
- Registro de eventuais erros preexistentes.
- Checklist funcional preenchido.

## Critérios de aceite

- Todos os cenários críticos foram aprovados.
- Não existe rolagem horizontal.
- Não existem elementos sobrepostos ou cortados.
- Todos os CTAs possuem destino correto.
- O widget não bloqueia ações.
- Não foram introduzidos erros de lint.
- Nenhuma regressão crítica foi encontrada nas rotas compartilhadas.
- Evidências foram anexadas à entrega.

## Critério de bloqueio

A entrega não deve ser publicada se:

- O hero estiver cortado em 360 ou 390 px.
- O CTA principal estiver inacessível.
- O produto em destaque não puder abrir detalhes.
- Header ou carrinho deixarem de funcionar.
- O widget bloquear ações principais.
- Houver rolagem horizontal causada pela feature.
