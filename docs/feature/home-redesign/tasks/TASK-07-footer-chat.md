# TASK-07 — Footer e área segura do chat

## Metadados

- **Prioridade:** P1
- **Status:** Não iniciada
- **Dependências:** TASK-01

## Objetivo

Alinhar o footer ao restante da Home e garantir que o widget de atendimento não cubra conteúdo ou ações importantes.

## Arquivos previstos

- `src/app/components/footer/footer.tsx`
- `src/app/components/footer/footer.css`
- `src/app/layout.tsx`, se o posicionamento do Chatwoot exigir configuração
- Estilos das seções afetadas

## Passos de implementação — Footer

1. Aplicar a mesma largura máxima da Home.
2. Remover margem superior baseada em `10vh`.
3. Controlar separação pelo padding da seção anterior ou do footer.
4. Aumentar o logo para dimensão reconhecível.
5. Alinhar marca, colunas e redes sociais.
6. Manter quatro áreas no desktop.
7. Usar duas colunas no tablet e uma coluna organizada no mobile.
8. Revisar espaçamento vertical dos grupos.
9. Substituir links `#` por destinos válidos ou estado não clicável.
10. Usar `Link` do Next para rotas internas.

## Passos de implementação — Chat

1. Mapear o tamanho real do widget fechado e aberto.
2. Definir safe area inferior e lateral no mobile.
3. Garantir que CTAs próximos ao canto direito possuam espaço adicional.
4. Testar footer com widget aberto.
5. Evitar sobrescrever seletores internos do Chatwoot sem necessidade.
6. Se disponível, configurar offset pela API oficial do widget.

## Critérios de aceite

- Footer inicia sem espaço vazio excessivo.
- Logo é reconhecível.
- Colunas ficam alinhadas ao conteúdo principal.
- Nenhum link falso aparenta funcionalidade.
- Widget não cobre CTA, preço, miniatura ou link.
- Footer permanece utilizável em 360 px.

## Validação

- Testar widget aberto e fechado.
- Testar mobile em retrato e paisagem.
- Navegar pelo footer somente com teclado.
- Validar links internos e externos.
- Testar com textos maiores e zoom de 200%.

## Riscos

- O conteúdo do iframe do Chatwoot não pode ser estilizado diretamente.
- Alterar offsets pode afetar outras rotas.

## Mitigação

- Preferir safe area no conteúdo.
- Restringir ajustes de layout à Home quando possível.

