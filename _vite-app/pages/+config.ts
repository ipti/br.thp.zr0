import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

// Config padrão (pode ser sobrescrito por página via +config.ts local).
// https://vike.dev/config

const config: Config = {
  title: "Zr0",
  description: "Transformando plástico em oportunidades",

  extends: [vikeReact],
};

export default config;
