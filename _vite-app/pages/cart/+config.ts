import type { Config } from "vike/types";

// Rota autenticada/interativa: SPA client-side puro, sem SSR (ver Fase 3b).
// prerender: gera o HTML uma vez no build (o shell não depende de dado por
// request), virando um arquivo estático de verdade — sem tocar a function.
const config: Config = {
  ssr: false,
  prerender: true,
};

export default config;
