import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// vike é ESM-only; a Function compila para CommonJS, então usamos import() dinâmico
// (mesmo padrão validado na Fase 0 — ver docs/feature/migration_plan/tasks/fase-0-spike-validacao.md).
// Caminho como variável (não literal) para o TS não tentar resolver o módulo
// em tempo de type-check — o caminho só existe depois do build do client/server
// (é relativo ao JS compilado em api/dist/src/functions/, não ao ssr.ts fonte).
const entryPath = "../../../../dist/server/entry.mjs";
let entryLoaded: Promise<unknown> | undefined;

export async function ssr(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  entryLoaded ??= import(entryPath);
  await entryLoaded;
  const { renderPage } = await import("vike/server");

  // A SWA reescreve "/" e "/product/*" para "/api/ssr" internamente — o path
  // original que o Vike precisa pra rotear vem no header x-ms-original-url,
  // não em request.url (que aponta pro path já reescrito).
  const originalUrlHeader = request.headers.get("x-ms-original-url");
  const url = new URL(originalUrlHeader ?? request.url);
  const pageContextInit = { urlOriginal: url.pathname + url.search };

  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;

  if (!httpResponse) {
    return { status: 404, body: "Not found" };
  }

  return {
    status: httpResponse.statusCode,
    headers: Object.fromEntries(httpResponse.headers),
    body: httpResponse.body,
  };
}

app.http("ssr", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "{*path}",
  handler: ssr,
});
