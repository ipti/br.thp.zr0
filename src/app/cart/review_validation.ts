import { Address } from '@/app/profile/address/service/type'
import { UserGlobal } from '@/service/global_request/type'
import { CartItem } from '@/service/store/type'
import { validateCNPJ, validateCPF } from '@/utils/hook/validation_cnpj_cpf'
import { DeliverySelectedType } from './zustand/zustand'

export const PAYMENT_METHODS = ['PIX', 'CREDIT_CARD', 'BANK_SLIP'] as const
export type CheckoutPaymentMethod = (typeof PAYMENT_METHODS)[number]

export type ReviewValidationInput = {
  user?: UserGlobal
  address?: Address
  selectedAddressId?: number
  items: CartItem[]
  deliveries?: DeliverySelectedType[]
  paymentMethod?: string
  couponDiscount?: number
  orderTotal: number
}

const hasText = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0

const isPositiveInteger = (value: unknown) =>
  typeof value === 'number' && Number.isInteger(value) && value > 0

const onlyDigits = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\D/g, '') : ''

export function validateCheckoutReview({
  user,
  address,
  selectedAddressId,
  items,
  deliveries,
  paymentMethod,
  couponDiscount = 0,
  orderTotal
}: ReviewValidationInput): string[] {
  const errors: string[] = []

  if (!isPositiveInteger(user?.id)) {
    errors.push('Sua sessão expirou. Entre novamente para continuar.')
  } else {
    if (
      !hasText(user?.name) ||
      !hasText(user?.email) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user?.email ?? '')
    ) {
      errors.push('Complete seu nome e e-mail nos dados pessoais.')
    }
    if (![10, 11].includes(onlyDigits(user?.customer?.phone).length)) {
      errors.push('Informe um telefone nos dados pessoais.')
    }
    const cpf = user?.customer?.cpf ?? ''
    const cnpj = user?.customer?.cnpj ?? ''
    if (!validateCPF(cpf) && !validateCNPJ(cnpj)) {
      errors.push('Informe um CPF ou CNPJ para emissão do pedido.')
    }
  }

  if (!address || !isPositiveInteger(selectedAddressId) || address.id !== selectedAddressId) {
    errors.push('Selecione novamente o endereço de entrega.')
  } else {
    const addressComplete = [
      address.name,
      address.phone,
      address.cep,
      address.address,
      address.number,
      address.neighborhood
    ].every(hasText)

    if (
      !addressComplete ||
      onlyDigits(address.cep).length !== 8 ||
      ![10, 11].includes(onlyDigits(address.phone).length) ||
      !isPositiveInteger(address.city?.id) ||
      !isPositiveInteger(address.state?.id)
    ) {
      errors.push('Complete todos os campos obrigatórios do endereço de entrega.')
    }
  }

  if (items.length === 0) {
    errors.push('Selecione pelo menos um produto para o pedido.')
  } else if (
    items.some(item =>
      !hasText(item.id) ||
      !isPositiveInteger(item.quantity) ||
      !Number.isFinite(item.price) ||
      item.price < 0
    )
  ) {
    errors.push('Há um produto com quantidade ou preço inválido no carrinho.')
  }

  const selectedIds = new Set(items.map(item => item.id))
  const deliveryKeys = new Set<string>()
  const deliveredQuantity = new Map<string, number>()
  let invalidDelivery = !deliveries?.length

  for (const delivery of deliveries ?? []) {
    const key = `${delivery.productId}:${delivery.workshopId}`
    const option = delivery.validOptions
    const valid =
      selectedIds.has(delivery.productId) &&
      isPositiveInteger(delivery.workshopId) &&
      isPositiveInteger(delivery.quantity) &&
      hasText(option?.carrier) &&
      hasText(option?.service) &&
      Number.isFinite(option?.cost) &&
      option.cost >= 0 &&
      Number.isFinite(option?.deliveryTime) &&
      option.deliveryTime >= 0 &&
      !deliveryKeys.has(key)

    if (!valid) invalidDelivery = true
    deliveryKeys.add(key)
    deliveredQuantity.set(
      delivery.productId,
      (deliveredQuantity.get(delivery.productId) ?? 0) + delivery.quantity
    )
  }

  if (
    items.some(item => deliveredQuantity.get(item.id) !== item.quantity) ||
    (deliveries ?? []).some(delivery => !selectedIds.has(delivery.productId))
  ) {
    invalidDelivery = true
  }

  if (invalidDelivery) {
    errors.push('Escolha uma entrega válida para todos os produtos selecionados.')
  }

  if (!PAYMENT_METHODS.includes(paymentMethod as CheckoutPaymentMethod)) {
    errors.push('Selecione um método de pagamento válido.')
  }

  if (!Number.isFinite(orderTotal) || orderTotal < 0) {
    errors.push('Não foi possível calcular o total do pedido.')
  }
  if (
    !Number.isFinite(couponDiscount) ||
    couponDiscount < 0 ||
    couponDiscount > orderTotal
  ) {
    errors.push('O desconto aplicado é inválido. Remova o cupom e tente novamente.')
  }

  return errors
}
