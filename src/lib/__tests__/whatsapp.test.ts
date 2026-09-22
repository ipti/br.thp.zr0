import {
  buildCartWhatsAppMessage,
  buildEncomendaWhatsAppMessage,
  buildWhatsAppLink,
} from '../whatsapp'

describe('buildCartWhatsAppMessage', () => {
  it('lista itens, subtotal, frete e total', () => {
    const message = buildCartWhatsAppMessage({
      items: [
        { name: 'Cadeira Artesanal', quantity: 2, price: 250 },
        { name: 'Mesa de Centro', quantity: 1, price: 500 },
      ],
      subtotal: 1000,
      shippingTotal: 45,
      total: 1045,
    })

    expect(message).toContain('Cadeira Artesanal (x2)')
    expect(message).toContain('Mesa de Centro (x1)')
    expect(message).toMatch(/Subtotal: R\$\s*1\.000,00/)
    expect(message).toMatch(/Frete: R\$\s*45,00/)
    expect(message).toMatch(/Total: R\$\s*1\.045,00/)
  })

  it('inclui endereço e método de pagamento quando fornecidos', () => {
    const message = buildCartWhatsAppMessage({
      items: [{ name: 'Cadeira', quantity: 1, price: 250 }],
      subtotal: 250,
      shippingTotal: 0,
      total: 250,
      addressSummary: 'Rua A, 123 - Centro, Cidade/UF - CEP 12345-678',
      paymentMethodLabel: 'PIX',
    })

    expect(message).toContain('Entrega: Rua A, 123 - Centro, Cidade/UF - CEP 12345-678')
    expect(message).toContain('Pagamento preferido: PIX')
  })

  it('omite endereço e pagamento quando não fornecidos', () => {
    const message = buildCartWhatsAppMessage({
      items: [{ name: 'Cadeira', quantity: 1, price: 250 }],
      subtotal: 250,
      shippingTotal: 0,
      total: 250,
    })

    expect(message).not.toContain('Entrega:')
    expect(message).not.toContain('Pagamento preferido:')
  })

  it('termina com o pedido de confirmação', () => {
    const message = buildCartWhatsAppMessage({
      items: [{ name: 'Cadeira', quantity: 1, price: 250 }],
      subtotal: 250,
      shippingTotal: 0,
      total: 250,
    })

    expect(message.trim().endsWith('Aguardo confirmação!')).toBe(true)
  })
})

describe('buildEncomendaWhatsAppMessage', () => {
  it('inclui produto, quantidade, plano e datas formatadas em pt-BR', () => {
    const message = buildEncomendaWhatsAppMessage({
      productName: 'Cadeira Artesanal',
      quantity: 10,
      planLabel: 'Menor prazo',
      maxDeliveryAt: '2026-11-15T00:00:00.000Z',
      productSubtotal: 2500,
      freightTotal: 300,
      estimatedTotal: 2800,
    })

    expect(message).toContain('Cadeira Artesanal — 10 unidades')
    expect(message).toContain('Plano: Menor prazo')
    expect(message).toMatch(/Entrega prevista: \d{2}\/\d{2}\/2026/)
    expect(message).toMatch(/Total estimado: R\$\s*2\.800,00/)
  })

  it('usa singular "unidade" para quantidade 1', () => {
    const message = buildEncomendaWhatsAppMessage({
      productName: 'Mesa',
      quantity: 1,
      planLabel: 'Menor custo',
      maxDeliveryAt: '2026-11-15T00:00:00.000Z',
      productSubtotal: 500,
      freightTotal: 50,
      estimatedTotal: 550,
    })

    expect(message).toContain('Mesa — 1 unidade')
    expect(message).not.toContain('1 unidades')
  })

  it('inclui endereço e pagamento quando fornecidos', () => {
    const message = buildEncomendaWhatsAppMessage({
      productName: 'Cadeira',
      quantity: 5,
      planLabel: 'Menor custo',
      maxDeliveryAt: '2026-11-15T00:00:00.000Z',
      productSubtotal: 1250,
      freightTotal: 100,
      estimatedTotal: 1350,
      addressSummary: 'Rua B, 45 - Bairro, CEP 98765-432',
      paymentMethodLabel: 'Boleto',
    })

    expect(message).toContain('Entrega: Rua B, 45 - Bairro, CEP 98765-432')
    expect(message).toContain('Pagamento preferido: Boleto')
  })
})

describe('buildWhatsAppLink', () => {
  it('remove caracteres não numéricos do telefone', () => {
    const link = buildWhatsAppLink('+55 (11) 99999-9999', 'oi')
    expect(link).toBe('https://wa.me/5511999999999?text=oi')
  })

  it('codifica a mensagem para uso em URL', () => {
    const link = buildWhatsAppLink('5511999999999', 'Olá! Linha 1\nLinha 2')
    expect(link).toContain('https://wa.me/5511999999999?text=')
    expect(decodeURIComponent(link.split('?text=')[1])).toBe('Olá! Linha 1\nLinha 2')
  })
})
