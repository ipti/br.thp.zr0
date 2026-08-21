// Chamadas HTTP do fluxo de Pedido de Encomenda. Isolado de src/app/cart/ —
// nunca importar daqui em src/app/cart/ nem o inverso.
import http from '@/service/axios'
import {
  SimulateProductionOrderPayload,
  SimulateProductionOrderResponse,
  ReserveProductionOrderPayload,
  ReserveProductionOrderResult,
  CreateProductionOrderPayload,
  CreateProductionOrderResult,
} from './types'

export const SimulateProductionOrderRequest = async (
  body: SimulateProductionOrderPayload
) => {
  return await http.post<SimulateProductionOrderResponse>(
    '/production-order/simulate',
    body
  )
}

export const ReserveProductionOrderRequest = async (
  body: ReserveProductionOrderPayload
) => {
  return await http.post<ReserveProductionOrderResult>(
    '/production-order/reserve',
    body
  )
}

export const CreateProductionOrderRequest = async (
  body: CreateProductionOrderPayload
) => {
  return await http.post<CreateProductionOrderResult>('/production-order', body)
}
