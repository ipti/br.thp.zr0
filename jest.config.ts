import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  // jest-environment-jsdom adiciona a condição de export "browser" por
  // padrão, o que faz o resolvedor escolher o bundle de browser do MSW
  // mesmo para `msw/node` (setupServer) — removendo-a, o Node resolve
  // corretamente para o build server-side.
  testEnvironmentOptions: { customExportConditions: [''] },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// next/jest sempre sobrescreve `transformIgnorePatterns` com seu próprio
// valor (ignora o que é passado em `config`), então o ajuste necessário para
// o MSW (que publica alguns pacotes internos como ESM puro) precisa ser
// aplicado depois que next/jest resolve sua config, não antes.
async function resolveJestConfig() {
  const nextConfig = await createJestConfig(config)()

  return {
    ...nextConfig,
    // MSW e suas dependências internas publicam ESM puro em node_modules;
    // transformar todo node_modules (transformIgnorePatterns: []) chega a
    // travar a suíte por minutos na primeira execução — listamos só os
    // pacotes que de fato precisam de transform.
    transformIgnorePatterns: [
      '/node_modules/(?!(msw|@mswjs|rettime|@bundled-es-modules|@open-draft|until-async|outvariant|statuses|strict-event-emitter|headers-polyfill|is-node-process)/)',
    ],
  }
}

export default resolveJestConfig
