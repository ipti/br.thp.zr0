// Contrato do fluxo de Pedido de Encomenda. Isolado de src/app/cart/ — nunca
// importar tipos daqui em src/app/cart/ nem o inverso; os dois fluxos são
// jornadas de compra completamente independentes (ver docs/feature/compra-por-encomenda).
import { Address } from '@/app/cart/service/types'

export type SimulationMode = 'COST' | 'DEADLINE'

export interface SimulateProductionOrderPayload {
  productId: string
  quantity: number
  destinationZipCode: string
}

export interface ProductionShipment {
  workshopId: number
  workshopName: string
  quantity: number
  freightCost: number
  carrier?: string
  service?: string
  readyAt: string // ISO — sempre calculado como produção do zero
  deliveryAt: string // ISO — readyAt + prazo do frete
}

export interface ProductionOrderPlan {
  mode: SimulationMode
  shipments: ProductionShipment[]
  totalCost: number
  maxDeliveryAt: string
}

export interface SimulateProductionOrderResponse {
  costPlan: ProductionOrderPlan
  deadlinePlan: ProductionOrderPlan
  unavailable?: boolean // true = nenhuma OT com capacidade ativa para o produto
}

export interface ReserveProductionOrderShipment {
  workshopId: number
  quantity: number
}

export interface CreateProductionOrderShipment
  extends ReserveProductionOrderShipment {
  estimatedDeliveryAt?: string
}

export interface ReserveProductionOrderPayload {
  userId: number
  productId: string
  simulationMode: SimulationMode
  shipments: ReserveProductionOrderShipment[]
}

export interface CreateProductionOrderPayload
  extends Omit<ReserveProductionOrderPayload, 'shipments'> {
  shipments: CreateProductionOrderShipment[]
  address: Address
  paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'BANK_SLIP'
}

export interface ReserveProductionOrderResult {
  expiresAt: string
  shipments: {
    workshopId: number
    quantity: number
    estimatedReadyAt: string
  }[]
}

export interface CreateProductionOrderResult {
  message?: string
  orders?: { id: number; uid: string }[]
  // Compatibilidade temporária com versões anteriores da API, que retornavam
  // o pedido diretamente em vez do envelope `orders`.
  id?: number
  uid?: string
}
