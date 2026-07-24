# ZR0 Frontend

Frontend Next.js 15 (App Router) do sistema ZR0. Os dados e as regras de
negócio permanecem na API NestJS em `../br.thp.zr0.api`.

## Server e Client Components

- `/`, `/product` e `/product/[id]` são renderizadas no servidor para entregar
  conteúdo completo no HTML inicial.
- Busca e paginação de produtos usam parâmetros de URL e fazem a consulta no
  servidor.
- Galeria, wishlist, quantidade, frete, carrinho, login e telas autenticadas
  continuam interativas no cliente.
- O servidor Next acessa o Nest por `API_INTERNAL_URL`.
- A URL canônica, o `robots.txt` e o `sitemap.xml` usam `SITE_URL`.
- O navegador chama apenas `/api/*`; o route handler de proxy encaminha essas
  chamadas para o Nest. Ele não contém regra de negócio nem acessa banco.

Essa separação evita publicar hostnames internos do Docker, reduz diferenças de
CORS entre ambientes e permite promover a mesma imagem entre ambientes
alterando apenas `API_INTERNAL_URL` em runtime.

## Desenvolvimento local

Copie `.env.example` para `.env.local`, execute a API Nest em outra porta (o
exemplo usa `3001`) e rode:

```bash
npm ci
npm run dev
```

O site ficará disponível em [http://localhost:3000](http://localhost:3000).

## Docker

Somente o frontend, usando uma API já publicada:

```bash
docker compose up --build
```

Frontend, API Nest e MariaDB na mesma rede:

```bash
docker compose -f docker-compose.full-stack.yml up --build
```

O arquivo full-stack lê opcionalmente `../br.thp.zr0.api/.env` para os segredos
exigidos pela API. Ele sobrescreve somente `DATABASE_URL`, `APP_PORT` e `SITE`
para usar os serviços internos. As migrations são aplicadas no startup; o seed
não é executado automaticamente para não duplicar dados em todo restart.

Para popular um banco novo uma única vez:

```bash
docker compose -f docker-compose.full-stack.yml run --rm api npm run seed
```

## Validação

```bash
npm run build
npm run lint
docker compose config
docker compose -f docker-compose.full-stack.yml config
```

O projeto ainda possui dívida anterior de TypeScript/ESLint fora das páginas
públicas; por isso o `next.config.ts` mantém temporariamente a validação global
desabilitada durante o build. Isso deve ser removido depois que os erros
legados forem tratados.
