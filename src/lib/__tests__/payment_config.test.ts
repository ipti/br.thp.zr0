describe('getPaymentConfig', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('mantém o pagamento habilitado quando PAYMENT_ENABLED não está definido', async () => {
    delete process.env.PAYMENT_ENABLED
    const { getPaymentConfig } = await import('../payment_config')
    expect(getPaymentConfig().paymentEnabled).toBe(true)
  })

  it('desabilita o pagamento apenas com o valor exato "false"', async () => {
    process.env.PAYMENT_ENABLED = 'false'
    const { getPaymentConfig } = await import('../payment_config')
    expect(getPaymentConfig().paymentEnabled).toBe(false)
  })

  it('mantém habilitado para qualquer valor diferente de "false"', async () => {
    process.env.PAYMENT_ENABLED = 'nope'
    const { getPaymentConfig } = await import('../payment_config')
    expect(getPaymentConfig().paymentEnabled).toBe(true)
  })

  it('retorna string vazia quando WHATSAPP_NUMBER não está definido', async () => {
    delete process.env.WHATSAPP_NUMBER
    const { getPaymentConfig } = await import('../payment_config')
    expect(getPaymentConfig().whatsappNumber).toBe('')
  })

  it('repassa o número configurado', async () => {
    process.env.WHATSAPP_NUMBER = '5511999999999'
    const { getPaymentConfig } = await import('../payment_config')
    expect(getPaymentConfig().whatsappNumber).toBe('5511999999999')
  })

  it('avisa no console quando desabilitado sem número configurado', async () => {
    process.env.PAYMENT_ENABLED = 'false'
    delete process.env.WHATSAPP_NUMBER
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const { getPaymentConfig } = await import('../payment_config')
    getPaymentConfig()
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WHATSAPP_NUMBER'))
    warnSpy.mockRestore()
  })
})
