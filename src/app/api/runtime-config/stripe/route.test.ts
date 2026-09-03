import { STRIPE_PUBLIC_KEY_ENV } from '@/components/payment/stripe_config'
import { GET } from './route'

describe('GET /api/runtime-config/stripe', () => {
  const originalValue = process.env[STRIPE_PUBLIC_KEY_ENV]

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env[STRIPE_PUBLIC_KEY_ENV]
    } else {
      process.env[STRIPE_PUBLIC_KEY_ENV] = originalValue
    }
  })

  it('lê a publishable key do ambiente em runtime', async () => {
    process.env[STRIPE_PUBLIC_KEY_ENV] = 'pk_live_runtime_key'

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ publicKey: 'pk_live_runtime_key' })
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('não expõe valores ausentes ou inválidos', async () => {
    process.env[STRIPE_PUBLIC_KEY_ENV] = 'invalid'

    const response = await GET()

    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ publicKey: null })
  })
})
