jest.mock('server-only', () => ({}))

import { getServerApiUrl } from './server_api'

const API_ENV_KEYS = [
  'API_INTERNAL_URL',
  'API_URL',
  'NEXT_PUBLIC_API_URL'
] as const

describe('getServerApiUrl', () => {
  const originalEnvironment = Object.fromEntries(
    API_ENV_KEYS.map(key => [key, process.env[key]])
  )

  beforeEach(() => {
    for (const key of API_ENV_KEYS) delete process.env[key]
  })

  afterAll(() => {
    for (const key of API_ENV_KEYS) {
      const originalValue = originalEnvironment[key]
      if (originalValue === undefined) delete process.env[key]
      else process.env[key] = originalValue
    }
  })

  it('usa a API br-thp como fallback de produção', () => {
    expect(getServerApiUrl()).toBe('https://br-thp-zro-api.azurewebsites.net')
  })

  it('prioriza API_INTERNAL_URL e remove barras finais', () => {
    process.env.API_INTERNAL_URL = 'https://api-configurada.example///'
    process.env.NEXT_PUBLIC_API_URL = 'https://api-publica.example'

    expect(getServerApiUrl()).toBe('https://api-configurada.example')
  })
})
